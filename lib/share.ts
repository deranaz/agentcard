import type { SessionStats } from "./types";
import type { Theme } from "./themes";

// Compact share URL hash. Base64url-encoded JSON.
// Format: #s=<b64> or #s=<b64>&t=<theme>

export function encodeShareHash(stats: SessionStats): string {
  try {
    const json = JSON.stringify(compress(stats));
    return "s=" + b64urlEncode(json);
  } catch {
    return "";
  }
}

export function decodeShareHash(hash: string): SessionStats | null {
  const m = /[#&]s=([^&]+)/.exec(hash);
  if (!m) return null;
  try {
    const json = b64urlDecode(m[1]);
    const raw = JSON.parse(json);
    return decompress(raw);
  } catch {
    return null;
  }
}

export function encodeThemeHash(theme: Theme): string {
  return "&t=" + theme;
}

export function decodeThemeHash(hash: string): Theme | null {
  const m = /[#&]t=([^&]+)/.exec(hash);
  if (!m) return null;
  const t = m[1];
  if (t === "midnight" || t === "mono" || t === "terminal") return t;
  return null;
}

// Trim object to short keys to keep URLs small.
function compress(s: SessionStats): Record<string, unknown> {
  return {
    t: s.title,
    a: s.agent,
    m: s.model,
    sa: s.startedAt,
    d: s.durationSec,
    msg: s.messages,
    tc: s.toolCalls,
    ti: s.tokensIn,
    to: s.tokensOut,
    tl: s.tools.map((x) => [x.name, x.count]),
    fl: s.files.map((x) => [x.path, x.kind[0]]), // c/m/d
    o: s.outcome,
    sm: s.summary,
    src: s.source,
  };
}

function decompress(r: Record<string, unknown>): SessionStats {
  const kindMap: Record<string, "created" | "modified" | "deleted"> = {
    c: "created",
    m: "modified",
    d: "deleted",
  };
  return {
    title: (r.t as string) || "Untitled",
    agent: (r.a as string) || "Unknown",
    model: (r.m as string) || "unknown",
    startedAt: r.sa as string | undefined,
    durationSec: r.d as number | undefined,
    messages: (r.msg as number) || 0,
    toolCalls: (r.tc as number) || 0,
    tokensIn: r.ti as number | undefined,
    tokensOut: r.to as number | undefined,
    tools: Array.isArray(r.tl)
      ? (r.tl as [string, number][]).map(([name, count]) => ({ name, count }))
      : [],
    files: Array.isArray(r.fl)
      ? (r.fl as [string, string][]).map(([path, k]) => ({
          path,
          kind: kindMap[k] || "modified",
        }))
      : [],
    outcome: r.o as SessionStats["outcome"],
    summary: r.sm as string | undefined,
    source: (r.src as SessionStats["source"]) || "generic",
  };
}

function b64urlEncode(s: string): string {
  if (typeof window === "undefined") return "";
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlDecode(s: string): string {
  if (typeof window === "undefined") return "";
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
