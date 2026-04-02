import { NextResponse } from "next/server";
import {
  detectSqliRisk,
  encodeOutput,
  sanitizeInput,
  sanitizeRichText,
} from "@/lib/security";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = typeof body?.payload === "string" ? body.payload : "";

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "payload is required" },
        { status: 400 }
      );
    }

    const sanitizedPlain = sanitizeInput(payload);
    const sanitizedRich = sanitizeRichText(payload);
    const encoded = encodeOutput(payload);
    const hasSqliRisk = detectSqliRisk(payload);

    return NextResponse.json({
      success: true,
      before: payload,
      after: {
        sanitizedPlain,
        sanitizedRich,
        encoded,
      },
      analysis: {
        containsScriptTag: /<script/i.test(payload),
        hasSqliRisk,
      },
      note: "Use sanitizedPlain or encoded output for untrusted user content.",
    });
  } catch (error) {
    console.error("Security sanitize demo error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process input" },
      { status: 500 }
    );
  }
}
