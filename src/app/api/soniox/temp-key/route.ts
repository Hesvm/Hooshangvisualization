import { NextResponse } from "next/server";
import { SonioxNodeClient } from "@soniox/node";

/**
 * Mints a short-lived, single-use Soniox key per recording session so the
 * permanent key (SONIOX_API_KEY) never reaches the browser.
 */
export async function POST() {
  if (!process.env.SONIOX_API_KEY) {
    return NextResponse.json({ error: "Soniox is not configured on the server." }, { status: 500 });
  }

  try {
    const client = new SonioxNodeClient();
    const temporaryKey = await client.auth.createTemporaryKey({
      usage_type: "transcribe_websocket",
      expires_in_seconds: 60,
      single_use: true,
      max_session_duration_seconds: 300,
    });

    return NextResponse.json({ api_key: temporaryKey.api_key });
  } catch {
    return NextResponse.json({ error: "Failed to start voice session." }, { status: 502 });
  }
}
