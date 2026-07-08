import type { SonioxConnectionConfig } from "@soniox/client";

/**
 * Fetches a fresh temporary Soniox key from our server for exactly one
 * recording session. Passed as `useRecording`'s `config` function so it
 * re-runs per session instead of once.
 */
export async function fetchSonioxSessionConfig(): Promise<SonioxConnectionConfig> {
  const res = await fetch("/api/soniox/temp-key", { method: "POST" });
  if (!res.ok) {
    throw new Error("temp-key-request-failed");
  }
  const data = (await res.json()) as { api_key?: string };
  if (!data.api_key) {
    throw new Error("temp-key-request-failed");
  }
  return { api_key: data.api_key };
}
