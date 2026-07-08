import {
  AudioDeviceError,
  AudioPermissionError,
  AudioUnavailableError,
  type AudioSource,
  type AudioSourceHandlers,
} from "@soniox/client";

const TIMESLICE_MS = 60;
const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
  channelCount: 1,
  sampleRate: 16000,
};

type SharedMicrophoneSourceOptions = {
  /** Fired once the mic stream is live, so a visualizer can attach its own AnalyserNode to it. */
  onStreamReady?: (stream: MediaStream) => void;
  /** Fired when the stream is torn down, so the visualizer can detach cleanly. */
  onStreamEnded?: () => void;
};

/**
 * Same contract as @soniox/client's built-in MicrophoneSource, but exposes the
 * raw MediaStream so a single getUserMedia() call can feed both Soniox's audio
 * encoding AND a local amplitude/spectrum analyser — the SDK's MicrophoneSource
 * keeps the stream private, and useAudioLevel opens its own independent stream,
 * so neither can satisfy a single-shared-stream requirement on its own.
 */
export class SharedMicrophoneSource implements AudioSource {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private boundOnData: ((event: BlobEvent) => void) | null = null;
  private boundOnError: ((event: Event) => void) | null = null;
  private startGeneration = 0;

  constructor(private readonly options: SharedMicrophoneSourceOptions = {}) {}

  async start(handlers: AudioSourceHandlers): Promise<void> {
    this.stop();
    const generation = ++this.startGeneration;

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      throw new AudioUnavailableError("navigator.mediaDevices.getUserMedia is not available");
    }
    if (typeof MediaRecorder === "undefined") {
      throw new AudioUnavailableError("MediaRecorder is not available");
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          throw new AudioPermissionError("Microphone access denied by user", err);
        }
        if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          throw new AudioDeviceError("No microphone found", err);
        }
        if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          throw new AudioDeviceError("Microphone is already in use or not readable", err);
        }
      }
      throw new AudioUnavailableError(err instanceof Error ? err.message : "Failed to access microphone", err);
    }

    if (generation !== this.startGeneration) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    this.stream = stream;
    this.options.onStreamReady?.(stream);

    try {
      const recorder = new MediaRecorder(stream);
      this.mediaRecorder = recorder;
      this.boundOnData = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then(
            (buffer) => handlers.onData(buffer),
            (err) => handlers.onError(err instanceof Error ? err : new Error(String(err))),
          );
        }
      };
      this.boundOnError = (event) => {
        const message = (event as { message?: string }).message || "MediaRecorder error";
        handlers.onError(new Error(message));
      };
      recorder.addEventListener("dataavailable", this.boundOnData);
      recorder.addEventListener("error", this.boundOnError);
      recorder.start(TIMESLICE_MS);
    } catch (err) {
      stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
      this.mediaRecorder = null;
      this.options.onStreamEnded?.();
      throw new AudioUnavailableError(err instanceof Error ? err.message : "Failed to start MediaRecorder", err);
    }
  }

  stop(): void {
    if (this.mediaRecorder) {
      if (this.mediaRecorder.state !== "inactive") {
        const recorder = this.mediaRecorder;
        const onData = this.boundOnData;
        const onError = this.boundOnError;
        recorder.addEventListener(
          "stop",
          () => {
            if (onData) recorder.removeEventListener("dataavailable", onData);
            if (onError) recorder.removeEventListener("error", onError);
          },
          { once: true },
        );
        recorder.stop();
      }
      this.boundOnData = null;
      this.boundOnError = null;
      this.mediaRecorder = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
      this.options.onStreamEnded?.();
    }
  }
}
