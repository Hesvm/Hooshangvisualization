"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const SPECTRUM_BAR_COUNT = 34;

const MIN_BAR_HEIGHT = 6;
const MAX_BAR_HEIGHT = 52;
const SMOOTHING_PREVIOUS_WEIGHT = 0.55;
const SMOOTHING_CURRENT_WEIGHT = 0.45;
const FAKE_SMOOTHING_PREVIOUS_WEIGHT = 0.65;
const FAKE_SMOOTHING_CURRENT_WEIGHT = 0.35;

function createBaseline(): number[] {
  return Array.from({ length: SPECTRUM_BAR_COUNT }, () => MIN_BAR_HEIGHT);
}

function mapAmplitudeToHeight(rms: number): number {
  // rms is ~0..0.5 for typical mic input; push it into the bar range with a
  // punchy curve so bars visibly snap on speech rather than drifting.
  const normalized = Math.min(1, rms * 3.4);
  return Math.round(MIN_BAR_HEIGHT + normalized * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT));
}

/**
 * Real-mic amplitude spectrum. Never calls getUserMedia itself — it attaches
 * to a MediaStream handed to it (from SharedMicrophoneSource), so Soniox and
 * the visualizer read the same microphone stream instead of opening two.
 */
export function useAudioSpectrum() {
  const [samples, setSamples] = useState<number[]>(createBaseline);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const smoothedRef = useRef(0);
  const samplesRef = useRef<number[]>(createBaseline());
  const fakeStartTimeRef = useRef(0);

  const detachStream = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    sourceNodeRef.current?.disconnect();
    sourceNodeRef.current = null;
    analyserRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    smoothedRef.current = 0;
    samplesRef.current = createBaseline();
    setSamples(samplesRef.current);
  }, []);

  const attachStream = useCallback(
    (stream: MediaStream) => {
      detachStream();

      const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      const audioContext = new AudioContextCtor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNode.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceNodeRef.current = sourceNode;

      const timeDomainData = new Uint8Array(analyser.fftSize);

      const tick = () => {
        analyser.getByteTimeDomainData(timeDomainData);
        let sumSquares = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          const centered = (timeDomainData[i] - 128) / 128;
          sumSquares += centered * centered;
        }
        const rms = Math.sqrt(sumSquares / timeDomainData.length);
        smoothedRef.current = smoothedRef.current * SMOOTHING_PREVIOUS_WEIGHT + rms * SMOOTHING_CURRENT_WEIGHT;

        const nextHeight = mapAmplitudeToHeight(smoothedRef.current);
        samplesRef.current = [nextHeight, ...samplesRef.current.slice(0, SPECTRUM_BAR_COUNT - 1)];
        setSamples(samplesRef.current);

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [detachStream],
  );

  const startFakeSpectrum = useCallback(() => {
    detachStream();
    fakeStartTimeRef.current = performance.now();
    smoothedRef.current = 0.18;

    const tick = (now: number) => {
      const time = now - fakeStartTimeRef.current;
      const phrasePulse = Math.max(0, Math.sin(time * 0.006)) * 0.18;
      const syllablePulse = Math.max(0, Math.sin(time * 0.021 + 0.8)) * 0.2;
      const breathPulse = Math.sin(time * 0.012) * 0.12;
      const texture = Math.random() * 0.18;
      const nextAmplitude = 0.16 + phrasePulse + syllablePulse + breathPulse + texture;
      const clamped = Math.max(0.12, Math.min(0.92, nextAmplitude));

      smoothedRef.current =
        smoothedRef.current * FAKE_SMOOTHING_PREVIOUS_WEIGHT +
        clamped * FAKE_SMOOTHING_CURRENT_WEIGHT;

      const nextHeight = mapAmplitudeToHeight(smoothedRef.current);
      samplesRef.current = [nextHeight, ...samplesRef.current.slice(0, SPECTRUM_BAR_COUNT - 1)];
      setSamples(samplesRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [detachStream]);

  useEffect(() => detachStream, [detachStream]);

  return { samples, attachStream, detachStream, startFakeSpectrum };
}
