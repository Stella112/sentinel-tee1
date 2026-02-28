import { useState, useEffect, useRef } from "react";
import {
  Shield, Terminal, Lock, Cpu, AlertTriangle,
  CheckCircle, XCircle, Zap, Activity, Radio, Twitter
} from "lucide-react";

// ── ANIMATED GRADIENT MESH BACKGROUND ─────────────────────
function GradientMesh() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0" style={{ background: "#080600" }} />

      {/* Animated blobs */}
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, #b45309 40%, transparent 70%)",
          top: "-200px", left: "-200px",
          animation: "blob1 12s ease-in-out infinite alternate",
        }} />
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #fcd34d 0%, #d97706 40%, transparent 70%)",
          bottom: "-100px", right: "-100px",
          animation: "blob2 15s ease-in-out infinite alternate",
        }} />
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #fbbf24 0%, #92400e 50%, transparent 70%)",
          top: "40%", left: "50%",
          animation: "blob3 18s ease-in-out infinite alternate",
        }} />

      {/* Gold shimmer lines */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0px, transparent 1px, transparent 60px, #f59e0b 61px)",
        backgroundSize: "86px 86px",
      }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)"
      }} />

      <style>{`
        @keyframes blob1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(80px, 60px) scale(1.15); }
          100% { transform: translate(30px, 100px) scale(0.95); }
        }
        @keyframes blob2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-60px, -80px) scale(1.2); }
          100% { transform: translate(-100px, -30px) scale(0.9); }
        }
        @keyframes blob3 {
          0%   { transform: translate(-50%, -50%) scale(1); }
          50%  { transform: translate(-50%, -50%) scale(1.3); }
          100% { transform: translate(-30%, -60%) scale(0.85); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #92400e, #f59e0b, #fcd34d, #f59e0b, #92400e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .gold-shimmer-static {
          background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 40%, #b45309 70%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

// ── SCANLINE ───────────────────────────────────────────────
function ScanlineOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
      style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,1) 2px,rgba(0,0,0,1) 4px)" }} />
  );
}

// ── CORNER BRACKETS ────────────────────────────────────────
function CornerBrackets({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-70 z-10" style={{ borderColor: "#f59e0b" }} />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 opacity-70 z-10" style={{ borderColor: "#f59e0b" }} />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 opacity-70 z-10" style={{ borderColor: "#f59e0b" }} />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-70 z-10" style={{ borderColor: "#f59e0b" }} />
      {children}
    </div>
  );
}

// ── SCORE RING ─────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? "#f59e0b" : score >= 50 ? "#fb923c" : "#f87171";
  const glow  = score >= 80 ? "rgba(245,158,11,0.9)" : score >= 50 ? "rgba(251,146,60,0.9)" : "rgba(248,113,113,0.9)";
  const label = score >= 80 ? "LOW RISK" : score >= 50 ? "MEDIUM RISK" : "CRITICAL";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" stroke="#1a1000" strokeWidth="10" />
          <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 10px ${glow})`, transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-black" style={{ color, textShadow: `0 0 24px ${glow}` }}>{score}</span>
          <span className="font-mono text-xs" style={{ color: "rgba(245,158,11,0.4)" }}>/100</span>
        </div>
      </div>
      <div className="font-mono text-xs tracking-[0.2em] px-4 py-1.5 rounded border"
        style={{ color, borderColor: color, boxShadow: `0 0 16px ${color}40, inset 0 0 10px ${color}10` }}>
        {label}
      </div>
    </div>
  );
}

// ── TYPEWRITER ─────────────────────────────────────────────
function useTypewriter(text: string, speed = 10) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

// ── LOG TERMINAL ───────────────────────────────────────────
function LogTerminal({ text }: { text: string }) {
  const displayed = useTypewriter(text, 10);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [displayed]);

  return (
    <div ref={ref}
      className="h-52 overflow-y-auto font-mono text-xs leading-relaxed p-4 rounded border whitespace-pre-wrap"
      style={{
        background: "rgba(8,5,0,0.85)",
        borderColor: "rgba(245,158,11,0.2)",
        color: "rgba(253,230,138,0.85)",
        scrollbarWidth: "thin",
        scrollbarColor: "#b4530940 transparent",
      }}>
      <span style={{ color: "rgba(245,158,11,0.45)" }}>&gt; AUDIT OUTPUT LOG{"\n"}</span>
      {displayed}
      <span className="animate-pulse" style={{ color: "#f59e0b" }}>█</span>
    </div>
  );
}

// ── LOADING TERMINAL ───────────────────────────────────────
const LOADING_STEPS = [
  "Establishing encrypted channel...",
  "Routing to secure enclave...",
  "Verifying TEE attestation certificate...",
  "Deploying analysis payload...",
  "Scanning for reentrancy vectors...",
  "Checking ownership & privilege escalation...",
  "Analyzing token transfer restrictions...",
  "Inspecting mint/burn functions...",
  "Cross-referencing honeypot signatures...",
  "Running static vulnerability analysis...",
  "Generating cryptographic proof...",
  "Signing with enclave private key...",
];

function LoadingTerminal({ step }: { step: number }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 350);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-lg p-4 font-mono text-xs space-y-1.5 border"
      style={{ background: "rgba(8,5,0,0.9)", borderColor: "rgba(245,158,11,0.2)" }}>
      {LOADING_STEPS.slice(0, step + 1).map((msg, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <span style={{ color: "#b45309" }} className="select-none">›</span>
          <span style={{ color: i < step ? "rgba(245,158,11,0.35)" : "#fcd34d" }}>
            {msg}
            {i === step && <span style={{ color: "rgba(245,158,11,0.55)" }}>{dots}</span>}
          </span>
          {i < step && <span className="ml-auto text-[10px] tracking-widest" style={{ color: "#b45309" }}>✓ OK</span>}
        </div>
      ))}
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────
interface AuditResult { score: number; analysis: string; hash: string; }

export default function App() {
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const stepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleAudit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setResult(null); setError(null); setLoadStep(0);

    stepRef.current = setInterval(() => {
      setLoadStep(prev => {
        if (prev >= LOADING_STEPS.length - 1) { clearInterval(stepRef.current!); return prev; }
        return prev + 1;
      });
    }, 800);

    try {
      const res = await fetch("http://38.49.209.149:8001/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_code: input }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
      const data = await res.json();
      const raw: string = data.analysis_result ?? "";
      const match = raw.match(/Risk Score[:\s]+(\d+)/i);
      const score = match ? Math.min(100, Math.max(0, parseInt(match[1]))) : 50;
      const analysis = raw.replace(/Risk Score[:\s]+\d+\.?\s*/i, "").trim();
      setResult({ score, analysis, hash: data.cryptographic_proof_hash ?? "N/A" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error occurred");
    } finally {
      clearInterval(stepRef.current!);
      setLoading(false);
    }
  };

  // shared panel style
  const panel = {
    background: "linear-gradient(135deg, rgba(20,13,0,0.95) 0%, rgba(10,7,0,0.97) 100%)",
    borderColor: "rgba(245,158,11,0.3)",
    boxShadow: "0 0 40px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.1)",
  };

  return (
    <>
      <ScanlineOverlay />
      <GradientMesh />

      <div className="relative z-10 min-h-screen text-zinc-100 pb-16">
        {/* Top crown glow */}
        <div className="absolute top-0 inset-x-0 h-80 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,158,11,0.2) 0%, transparent 70%)"
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 space-y-6">

          {/* ── HEADER ── */}
          <header className="rounded-xl px-6 py-5 border" style={panel}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <Shield className="w-12 h-12" style={{
                    color: "#f59e0b",
                    filter: "drop-shadow(0 0 16px rgba(245,158,11,0.9)) drop-shadow(0 0 32px rgba(180,83,9,0.6))"
                  }} />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full animate-pulse" style={{
                    background: "#f59e0b",
                    boxShadow: "0 0 10px #f59e0b, 0 0 24px #b45309"
                  }} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    <span className="gold-shimmer">SENTINEL TEE</span>
                    <span className="mx-2 font-light" style={{ color: "rgba(245,158,11,0.4)", WebkitTextFillColor: "initial" }}>//</span>
                    <span className="text-xl font-semibold" style={{ color: "#fef3c7", WebkitTextFillColor: "initial" }}>Verified Auditor</span>
                  </h1>
                  <p className="font-mono text-[11px] tracking-widest mt-0.5" style={{ color: "rgba(245,158,11,0.5)" }}>
                    POWERED BY OPENGRADIENT • TRUSTED EXECUTION ENVIRONMENT v2.4.1
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs font-mono flex-wrap">
                <div className="flex items-center gap-1.5" style={{ color: "rgba(245,158,11,0.8)" }}>
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>ENCLAVE ONLINE</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: "rgba(180,83,9,0.8)" }}>
                  <Activity className="w-3.5 h-3.5" />
                  <span>TEE VERIFIED</span>
                </div>
                <a
                  href="https://twitter.com/Marisdigitals11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 group transition-all duration-200"
                  style={{ color: "rgba(253,230,138,0.8)", textDecoration: "none" }}
                >
                  <Twitter className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
                    style={{ filter: "drop-shadow(0 0 5px rgba(245,158,11,0.7))", color: "#f59e0b" }} />
                  <span className="group-hover:underline">@Marisdigitals11</span>
                </a>
              </div>
            </div>

            {/* Divider with gold glow */}
            <div className="mt-5 mb-4 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), rgba(253,230,138,0.8), rgba(245,158,11,0.5), transparent)"
            }} />

            <div className="grid grid-cols-3 text-center gap-2">
              {[["14,829","AUDITS RUN"],["3,241","THREATS FOUND"],["99.97%","UPTIME"]].map(([v,l]) => (
                <div key={l}>
                  <div className="font-mono text-lg font-bold gold-shimmer-static">{v}</div>
                  <div className="font-mono text-[10px] tracking-widest" style={{ color: "rgba(180,83,9,0.6)" }}>{l}</div>
                </div>
              ))}
            </div>
          </header>

          {/* ── INPUT ── */}
          <CornerBrackets>
            <div className="rounded-xl overflow-hidden border" style={{
              ...panel,
              boxShadow: "inset 0 2px 30px rgba(0,0,0,0.8)",
            }}>
              <div className="flex items-center gap-2.5 px-5 py-3" style={{
                borderBottom: "1px solid rgba(245,158,11,0.12)",
                background: "rgba(8,5,0,0.6)"
              }}>
                <Terminal className="w-4 h-4" style={{ color: "#f59e0b" }} />
                <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(245,158,11,0.75)" }}>TARGET_PAYLOAD_</span>
                <span className="ml-auto font-mono text-[10px]" style={{ color: "rgba(180,83,9,0.5)" }}>{input.length} chars</span>
              </div>
              <textarea
                className="w-full bg-transparent p-5 text-sm resize-none outline-none font-mono leading-relaxed"
                style={{ minHeight: "200px", color: "rgba(253,230,138,0.85)", caretColor: "#f59e0b" }}
                placeholder={"// Paste Solidity contract or tokenomics logic here...\n// Supports: Solidity source, ABI JSON, plain descriptions\n\npragma solidity ^0.8.0;\ncontract Token { ... }"}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
            </div>
          </CornerBrackets>

          {/* ── BUTTON ── */}
          <button
            onClick={handleAudit}
            disabled={loading || !input.trim()}
            className="relative w-full py-5 rounded-xl font-mono font-black text-base tracking-[0.2em] uppercase transition-all duration-300 overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: loading || !input.trim()
                ? "rgba(245,158,11,0.05)"
                : "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(180,83,9,0.12) 50%, rgba(245,158,11,0.1) 100%)",
              border: "1px solid rgba(245,158,11,0.5)",
              color: "#fcd34d",
              boxShadow: loading || !input.trim()
                ? "none"
                : "0 0 30px rgba(245,158,11,0.2), 0 0 80px rgba(180,83,9,0.1), inset 0 1px 0 rgba(253,230,138,0.15)",
            }}
          >
            {!loading && (
              <span className="absolute inset-0 -skew-x-12 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.18), rgba(253,230,138,0.1), transparent)" }} />
            )}
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <><Cpu className="w-5 h-5 animate-spin" style={{ color: "#f59e0b" }} /><span className="animate-pulse">[ ROUTING TO SECURE ENCLAVE... ]</span></>
              ) : (
                <><Zap className="w-5 h-5" style={{ filter: "drop-shadow(0 0 8px #f59e0b)", color: "#fcd34d" }} />INITIATE TEE SECURITY AUDIT</>
              )}
            </span>
          </button>

          {/* ── LOADING ── */}
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest" style={{ color: "rgba(180,83,9,0.7)" }}>
                <Lock className="w-3.5 h-3.5" style={{ color: "#b45309" }} />
                SECURE CHANNEL ACTIVE — DO NOT NAVIGATE AWAY
              </div>
              <LoadingTerminal step={loadStep} />
            </div>
          )}

          {/* ── ERROR ── */}
          {error && (
            <div className="rounded-xl p-4 flex items-start gap-3 border" style={{
              background: "rgba(20,5,5,0.9)",
              borderColor: "rgba(248,113,113,0.35)",
              boxShadow: "0 0 24px rgba(248,113,113,0.08)"
            }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#f87171", filter: "drop-shadow(0 0 6px rgba(248,113,113,0.6))" }} />
              <div>
                <div className="font-mono font-bold text-sm tracking-widest" style={{ color: "#f87171" }}>AUDIT FAILED</div>
                <div className="font-mono text-xs mt-1" style={{ color: "rgba(248,113,113,0.6)" }}>{error}</div>
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {result && (
            <div className="space-y-4">
              {/* Section header */}
              <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest" style={{ color: "rgba(245,158,11,0.5)" }}>
                <CheckCircle className="w-4 h-4" style={{ color: "#f59e0b", filter: "drop-shadow(0 0 6px #f59e0b)" }} />
                AUDIT COMPLETE // TEE ATTESTATION VERIFIED // RESULTS BELOW
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.3), transparent)" }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Score */}
                <CornerBrackets className="md:col-span-2">
                  <div className="rounded-xl p-6 flex flex-col items-center justify-center gap-1 h-full border" style={{
                    ...panel,
                    boxShadow: "inset 0 0 60px rgba(0,0,0,0.7)",
                  }}>
                    <div className="font-mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "rgba(180,83,9,0.6)" }}>SECURITY SCORE</div>
                    <ScoreRing score={result.score} />
                    <div className="font-mono text-[10px] tracking-widest mt-2" style={{ color: "rgba(180,83,9,0.4)" }}>COMPOSITE RISK INDEX</div>
                  </div>
                </CornerBrackets>

                {/* Logs */}
                <div className="md:col-span-3 rounded-xl overflow-hidden border" style={panel}>
                  <div className="flex items-center gap-2.5 px-4 py-3" style={{
                    borderBottom: "1px solid rgba(245,158,11,0.12)",
                    background: "rgba(8,5,0,0.6)"
                  }}>
                    {result.score >= 80
                      ? <CheckCircle className="w-4 h-4" style={{ color: "#f59e0b" }} />
                      : result.score >= 50
                        ? <AlertTriangle className="w-4 h-4 text-orange-400" />
                        : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,83,9,0.7)" }}>AUDIT_LOG_STREAM_</span>
                  </div>
                  <div className="p-3">
                    <LogTerminal text={result.analysis} />
                  </div>
                </div>
              </div>

              {/* Proof Hash */}
              <div className="rounded-xl overflow-hidden border" style={{
                background: "linear-gradient(135deg, rgba(15,10,0,0.98) 0%, rgba(8,5,0,0.99) 100%)",
                borderColor: "rgba(245,158,11,0.4)",
                boxShadow: "0 0 40px rgba(245,158,11,0.1), inset 0 0 50px rgba(0,0,0,0.6)",
              }}>
                <div className="flex items-center gap-2.5 px-5 py-3" style={{
                  borderBottom: "1px solid rgba(245,158,11,0.12)",
                  background: "rgba(8,5,0,0.7)"
                }}>
                  <Lock className="w-4 h-4" style={{ color: "#f59e0b", filter: "drop-shadow(0 0 8px rgba(245,158,11,0.8))" }} />
                  <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(245,158,11,0.8)" }}>VERIFIED TEE PROOF HASH</span>
                  <span className="ml-auto font-mono text-[10px]" style={{ color: "rgba(180,83,9,0.45)" }}>SHA-256 • RSA-4096 • ON-CHAIN VERIFIABLE</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-1.5">
                  <span className="font-mono text-sm break-all tracking-wide gold-shimmer-static"
                    style={{ filter: "drop-shadow(0 0 8px rgba(245,158,11,0.35))" }}>
                    {result.hash}
                  </span>
                  <div className="flex items-center gap-4 font-mono text-[10px] tracking-widest" style={{ color: "rgba(180,83,9,0.35)" }}>
                    <span>SIGNED BY ENCLAVE</span><span>•</span>
                    <span>TAMPER-PROOF</span><span>•</span>
                    <span>IMMUTABLE ATTESTATION</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center font-mono text-[10px] tracking-widest pt-2" style={{ color: "rgba(180,83,9,0.25)" }}>
            SENTINEL TEE // TRUSTED EXECUTION ENVIRONMENT // ALL AUDITS CRYPTOGRAPHICALLY ATTESTED BY OPENGRADIENT
          </p>

          {/* Footer Twitter link */}
          <div className="flex flex-col items-center gap-3 pb-6">
            <div className="h-px w-72" style={{
              background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), rgba(253,230,138,0.6), rgba(245,158,11,0.4), transparent)"
            }} />
            <a
              href="https://twitter.com/Marisdigitals11"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group transition-all duration-200"
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 group-hover:scale-110"
                style={{
                  borderColor: "rgba(245,158,11,0.4)",
                  background: "rgba(245,158,11,0.08)",
                  boxShadow: "0 0 10px rgba(245,158,11,0.15)",
                }}
              >
                <Twitter className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
              </div>
              <span
                className="font-mono text-sm tracking-[0.15em] gold-shimmer-static group-hover:underline"
                style={{ filter: "drop-shadow(0 0 8px rgba(245,158,11,0.4))" }}
              >
                @Marisdigitals11
              </span>
            </a>
            <div className="h-px w-72" style={{
              background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), rgba(253,230,138,0.6), rgba(245,158,11,0.4), transparent)"
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
