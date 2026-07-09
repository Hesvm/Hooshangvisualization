"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRecording } from "@soniox/react";
import { AudioDeviceError, AudioPermissionError, AudioUnavailableError } from "@soniox/client";
import { fetchSonioxSessionConfig } from "@/services/soniox/tempKeyConfig";
import { SharedMicrophoneSource } from "@/services/soniox/sharedMicrophoneSource";
import { useAudioSpectrum } from "./useAudioSpectrum";

export type VoiceMode =
  | "idle"
  | "requesting_permission"
  | "connecting"
  | "recording"
  | "finalizing"
  | "transcript_ready"
  | "error";

export type VoiceError = {
  code: "permission_denied" | "no_microphone" | "connection_failed" | "empty_transcript";
  message: string;
};

export type VoiceTranscriptionMode = "mock" | "soniox";

const FINALIZE_SLOW_MS = 1500;
const MOCK_FINALIZE_MS = 320;
const MOCK_FALLBACK_TRANSCRIPT = "می‌خوام اینو بیشتر بررسی کنم";
const VOICE_TRANSCRIPTION_MODE: VoiceTranscriptionMode =
  process.env.NEXT_PUBLIC_VOICE_TRANSCRIPTION_MODE === "soniox" ? "soniox" : "mock";

function normalizeTranscript(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function mapError(err: unknown): VoiceError {
  if (err instanceof AudioPermissionError) {
    return { code: "permission_denied", message: "برای استفاده از ورودی صوتی، دسترسی میکروفون لازمه." };
  }
  if (err instanceof AudioDeviceError) {
    return { code: "no_microphone", message: "میکروفونی پیدا نشد." };
  }
  if (err instanceof AudioUnavailableError) {
    return { code: "no_microphone", message: "ورودی صوتی روی این مرورگر پشتیبانی نمی‌شه." };
  }
  return { code: "connection_failed", message: "اتصال صوتی برقرار نشد." };
}

type UseVoiceComposerOptions = {
  getDraft: () => string;
  setDraft: (text: string) => void;
  getMockTranscript?: () => string;
  onRecordingStart?: () => void;
  onTranscriptReady?: () => void;
};

function stopMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function mapPermissionError(err: unknown): VoiceError {
  if (err instanceof DOMException) {
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      return { code: "permission_denied", message: "برای استفاده از ورودی صوتی، دسترسی میکروفون لازمه." };
    }
    if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      return { code: "no_microphone", message: "میکروفونی پیدا نشد." };
    }
  }
  return { code: "no_microphone", message: "ورودی صوتی روی این مرورگر پشتیبانی نمی‌شه." };
}

export function useVoiceComposer({
  getDraft,
  setDraft,
  getMockTranscript,
  onRecordingStart,
  onTranscriptReady,
}: UseVoiceComposerOptions) {
  const [mode, setMode] = useState<VoiceMode>("idle");
  const [error, setError] = useState<VoiceError | null>(null);
  const [isFinalizingSlow, setIsFinalizingSlow] = useState(false);

  const draftBeforeRecordingRef = useRef("");
  const sessionIdRef = useRef(0);
  const finalizeSlowTimerRef = useRef<number | null>(null);
  const pendingSubmitSessionRef = useRef<number | null>(null);
  const mockStreamRef = useRef<MediaStream | null>(null);
  const mockFinalizeTimerRef = useRef<number | null>(null);
  const pathname = usePathname();

  const { samples, attachStream, detachStream, startFakeSpectrum } = useAudioSpectrum();
  const source = useMemo(
    () =>
      new SharedMicrophoneSource({
        onStreamReady: (stream) => attachStream(stream),
        onStreamEnded: () => detachStream(),
      }),
    [attachStream, detachStream],
  );

  function clearFinalizeSlowTimer() {
    if (finalizeSlowTimerRef.current !== null) {
      window.clearTimeout(finalizeSlowTimerRef.current);
      finalizeSlowTimerRef.current = null;
    }
    setIsFinalizingSlow(false);
  }

  function clearMockFinalizeTimer() {
    if (mockFinalizeTimerRef.current !== null) {
      window.clearTimeout(mockFinalizeTimerRef.current);
      mockFinalizeTimerRef.current = null;
    }
  }

  const stopMockRecording = useCallback(() => {
    clearMockFinalizeTimer();
    stopMediaStream(mockStreamRef.current);
    mockStreamRef.current = null;
    detachStream();
  }, [detachStream]);

  const rec = useRecording({
    config: fetchSonioxSessionConfig,
    model: "stt-rt-v5",
    language_hints: ["fa"],
    source,
    resetOnStart: true,
    onStateChange: ({ new_state }) => {
      if (new_state === "starting") setMode("requesting_permission");
      else if (new_state === "connecting") setMode("connecting");
      else if (new_state === "recording") setMode("recording");
      else if (new_state === "stopping") setMode("finalizing");
    },
    onError: (err) => {
      pendingSubmitSessionRef.current = null;
      clearFinalizeSlowTimer();
      setError(mapError(err));
      setMode("error");
      setDraft(draftBeforeRecordingRef.current);
    },
  });

  const recRef = useRef(rec);

  useEffect(() => {
    recRef.current = rec;
  }, [rec]);

  // `rec.stop()` resolving does not guarantee this component has re-rendered
  // with the final transcript yet — `rec` here is only fresh once React has
  // actually committed the "stopped" state. Reading the transcript from this
  // effect (instead of synchronously after an awaited `rec.stop()`) removes
  // that race entirely: an effect body only ever runs against the render it
  // was scheduled from.
  useEffect(() => {
    if (pendingSubmitSessionRef.current === null) return;
    if (pendingSubmitSessionRef.current !== sessionIdRef.current) {
      pendingSubmitSessionRef.current = null;
      return;
    }
    if (rec.state === "error" || rec.state === "canceled") {
      pendingSubmitSessionRef.current = null;
      return;
    }
    if (rec.state !== "stopped") return;

    pendingSubmitSessionRef.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resolves the committed Soniox stopped state.
    clearFinalizeSlowTimer();
    source.stop();

    const resolved = normalizeTranscript(rec.text);
    if (!resolved) {
      setError({ code: "empty_transcript", message: "صدایی تشخیص داده نشد." });
      setDraft(draftBeforeRecordingRef.current);
      setMode("idle");
      return;
    }

    setDraft(resolved);
    setMode("transcript_ready");
    setMode("idle");
    onTranscriptReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec.state, rec.text]);

  const start = useCallback(async () => {
    setError(null);
    sessionIdRef.current += 1;
    draftBeforeRecordingRef.current = getDraft();
    onRecordingStart?.();
    setMode("requesting_permission");

    if (VOICE_TRANSCRIPTION_MODE === "mock") {
      try {
        // Demo mode: fake STT transcript from first suggestion chip until Soniox billing is enabled.
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
          throw new AudioUnavailableError("navigator.mediaDevices.getUserMedia is not available");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mockStreamRef.current = stream;
        startFakeSpectrum();
        setMode("recording");
      } catch (err) {
        stopMockRecording();
        setError(mapPermissionError(err));
        setMode("error");
        setDraft(draftBeforeRecordingRef.current);
      }
      return;
    }

    rec.start();
  }, [rec, getDraft, onRecordingStart, setDraft, startFakeSpectrum, stopMockRecording]);

  const cancel = useCallback(() => {
    sessionIdRef.current += 1;
    clearFinalizeSlowTimer();
    if (VOICE_TRANSCRIPTION_MODE === "mock") {
      stopMockRecording();
    } else {
      rec.cancel();
      source.stop();
    }
    setError(null);
    setMode("idle");
    setDraft(draftBeforeRecordingRef.current);
  }, [rec, setDraft, source, stopMockRecording]);

  const submit = useCallback(() => {
    if (VOICE_TRANSCRIPTION_MODE === "mock") {
      const session = sessionIdRef.current;
      setMode("finalizing");
      clearMockFinalizeTimer();
      mockFinalizeTimerRef.current = window.setTimeout(() => {
        if (session !== sessionIdRef.current) return;
        stopMockRecording();
        setDraft(getMockTranscript?.() || MOCK_FALLBACK_TRANSCRIPT);
        setMode("transcript_ready");
        setMode("idle");
        onTranscriptReady?.();
      }, MOCK_FINALIZE_MS);
      return;
    }

    const session = sessionIdRef.current;
    pendingSubmitSessionRef.current = session;
    setMode("finalizing");
    finalizeSlowTimerRef.current = window.setTimeout(() => setIsFinalizingSlow(true), FINALIZE_SLOW_MS);

    // The transcript itself is picked up by the `rec.state === "stopped"`
    // effect above, once React has actually rendered that final state —
    // not here, right after the promise settles.
    rec.stop().catch(() => {
      // Swallow — the effect above still resolves the outcome from
      // whatever `rec.state` ends up settling to (stopped/error/canceled).
    });
  }, [rec, getMockTranscript, onTranscriptReady, setDraft, stopMockRecording]);

  const retry = useCallback(() => {
    setError(null);
    setMode("idle");
  }, []);

  // Route change mid-recording: discard, restore the original draft, never send.
  const lastPathnameRef = useRef(pathname);
  useEffect(() => {
    if (lastPathnameRef.current !== pathname && mode !== "idle" && mode !== "error") {
      cancel();
    }
    lastPathnameRef.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => {
      recRef.current.cancel();
      source.stop();
      stopMockRecording();
      clearFinalizeSlowTimer();
    };
  }, [source, stopMockRecording]);

  return {
    mode,
    error,
    isFinalizingSlow,
    amplitudeSamples: samples,
    start,
    cancel,
    submit,
    retry,
  };
}
