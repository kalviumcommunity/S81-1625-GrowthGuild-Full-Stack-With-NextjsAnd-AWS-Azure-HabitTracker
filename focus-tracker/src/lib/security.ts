import sanitizeHtml from "sanitize-html";
import validator from "validator";

const SQLI_PATTERNS = [
  /\b(OR|AND)\b\s+\d+\s*=\s*\d+/i,
  /('|\")\s*;?\s*--/i,
  /\bUNION\b\s+\bSELECT\b/i,
  /\bDROP\b\s+\bTABLE\b/i,
  /\bINSERT\b\s+\bINTO\b/i,
  /\bDELETE\b\s+\bFROM\b/i,
  /\bUPDATE\b\s+\w+\s+\bSET\b/i,
  /\bEXEC(UTE)?\b/i,
];

export function sanitizeInput(input: string): string {
  return sanitizeHtml(String(input), {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  }).trim();
}

export function sanitizeRichText(input: string): string {
  return sanitizeHtml(String(input), {
    allowedTags: ["b", "i", "em", "strong", "p", "ul", "ol", "li", "br"],
    allowedAttributes: {},
  }).trim();
}

export function encodeOutput(input: string): string {
  return validator.escape(String(input));
}

export function detectSqliRisk(input: string): boolean {
  const value = String(input || "");
  return SQLI_PATTERNS.some((pattern) => pattern.test(value));
}

export function sanitizeEmail(input: string): string {
  return validator.normalizeEmail(String(input).trim()) || "";
}

export function parseSafeInt(input: unknown, fallback = 0): number {
  const raw = sanitizeInput(String(input ?? ""));
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function sanitizeStringMap<T extends Record<string, unknown>>(obj: T): T {
  const cloned = { ...obj };

  Object.keys(cloned).forEach((key) => {
    const value = cloned[key];
    if (typeof value === "string") {
      cloned[key] = sanitizeInput(value) as T[keyof T];
    }
  });

  return cloned as T;
}

export function serializeJsonForHtmlScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
