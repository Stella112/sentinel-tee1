
import React, { useState } from 'react';
import { Shield, Activity, Lock, Terminal, Loader2, CheckCircle2, AlertTriangle, Zap, Cpu, Twitter } from 'lucide-react';

export default function App() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    score: number;
    analysis: string;
    hash: string;
  } | null>(null);

  const handleAudit = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Connects to your live VPS
      const response = await fetch('http://38.49.209.149:8001/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_code: code })
      });

      if (!response.ok) throw new Error('Failed to connect to Sentinel Enclave.');

      const data = await response.json();
      const scoreMatch = data.analysis_result.match(/Risk Score:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      const cleanAnalysis = data.analysis_result.replace(/Risk Score:\s*\d+/i, '').trim();

      setResult({
        score: score,
        analysis: cleanAnalysis,
        hash: data.cryptographic_proof_hash
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500 shadow-[0_0_30px_rgba(52,211,153,0.3)]';
    if (score >= 50) return 'text-amber-400 border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.3)]';
    return 'text-rose-500 border-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.3)]';
  };

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono selection:bg-emerald-500/30 selection:text-emerald-100 flex flex-col items-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* BACKGROUND GRID & GLOW */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 space-y-6 md:space-y-8 flex flex-col min-h-[90vh]">
        
        {/* HEADER SECTION - Cleaned up */}
        <header className="flex flex-col md:flex-row items-center justify-between border border-emerald-900/40 bg-zinc-950/80 backdrop-blur-md rounded-xl p-6 shadow-2xl">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <Shield className="w-12 h-12 text-emerald-400 relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black tracking-widest text-white drop-shadow-md">
                SENTINEL<span className="text-emerald-500">TEE</span>
              </h1>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-[10px] text-emerald-600 uppercase tracking-[0.2em] font-bold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Enclave Online // v2.4.1</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-950/50 border border-emerald-500/30 rounded-full">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-300 font-semibold tracking-wide">NET_VERIFIED</span>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'AUDITS RUN', value: '14,829', icon: CheckCircle2 },
            { label: 'THREATS FOUND', value: '3,241', icon: AlertTriangle },
            { label: 'SYSTEM UPTIME', value: '99.97%', icon: Zap },
            { label: 'ASSETS SECURED', value: '$4.2B', icon: Lock },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/40 border border-emerald-900/30 p-4 rounded-lg flex flex-col items-center justify-center hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all group">
              <stat.icon className="w-5 h-5 text-emerald-800 mb-2 group-hover:text-emerald-400 transition-colors" />
              <span className="text-xl md:text-2xl font-bold text-white tracking-wider font-sans">{stat.value}</span>
              <span className="text-[9px] md:text-[10px] text-emerald-600/70 tracking-[0.2em] uppercase mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* MAIN INPUT CARD */}
        <div className="relative group flex-grow">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
           <div className="relative bg-zinc-950 border border-emerald-500/20 rounded-xl p-1 overflow-hidden">
            <div className="bg-black/80 p-6 rounded-lg space-y-4 backdrop-blur-sm">
              
              <div className="flex justify-between items-center text-xs text-emerald-700 font-bold tracking-widest uppercase border-b border-emerald-900/30 pb-2 mb-2">
                <span className="flex items-center gap-2"><Terminal className="w-3 h-3"/> INPUT_STREAM</span>
                <span>SOLIDITY / RUST / BYTECODE</span>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste smart contract code here for TEE verification..."
                className="w-full h-72 bg-zinc-900/30 border border-zinc-800 rounded p-4 text-sm text-emerald-300 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900/50 focus:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition-all resize-none leading-relaxed font-mono"
                spellCheck="false"
              />

              <button
                onClick={handleAudit}
                disabled={isLoading || !code.trim()}
                className="w-full py-5 bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-600/50 hover:border-emerald-400 text-emerald-100 font-bold text-lg tracking-[0.2em] uppercase rounded shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    <span className="animate-pulse text-emerald-400">ENCLAVE PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5" />
                    <span>INITIATE TEE AUDIT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {error && (
          <div className="p-4 bg-rose-950/20 border border-rose-900/50 text-rose-400 rounded-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-4">
            {/* SCORE CARD */}
            <div className={`p-8 border rounded-xl bg-black flex flex-col md:flex-row items-center justify-between gap-8 ${getScoreColor(result.score)}`}>
              <div className="text-center md:text-left flex flex-col items-center md:items-start">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 mb-2">Risk Score</p>
                <div className="text-7xl md:text-8xl font-black tracking-tighter drop-shadow-2xl relative">
                  {result.score}
                  <span className="text-2xl opacity-40 font-normal absolute top-2 -right-8">/100</span>
                </div>
              </div>
              <div className="h-px w-full md:w-px md:h-24 bg-current opacity-20"></div>
              <div className="flex-1 text-sm md:text-base leading-relaxed opacity-90 font-medium font-sans">
                {result.analysis}
              </div>
            </div>

            {/* HASH BAR */}
            <div className="p-4 border border-emerald-900/30 rounded bg-zinc-950 flex items-center space-x-4 overflow-hidden shadow-lg">
              <div className="p-2 bg-emerald-900/20 rounded">
                <Lock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[9px] text-emerald-700 font-bold tracking-widest mb-0.5 uppercase">Cryptographic Proof Hash (OpenGradient)</p>
                <p className="text-xs text-emerald-500/80 truncate font-mono">{result.hash}</p>
              </div>
              <div className="hidden md:block px-3 py-1 bg-emerald-500/10 rounded-full text-[10px] text-emerald-400 border border-emerald-500/20 font-bold tracking-wider">
                VERIFIED
              </div>
            </div>
          </div>
        )}

        {/* FOOTER SIGNATURE - The new bottom section */}
        <footer className="mt-8 pt-8 border-t border-emerald-900/20 flex justify-center">
            <a 
                href="https://twitter.com/Marisdigitals11" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center space-x-2 px-4 py-2 bg-black/40 border border-emerald-900/30 rounded-full hover:border-emerald-500/50 hover:bg-emerald-950/30 transition-all duration-300"
            >
                <Twitter className="w-4 h-4 text-emerald-600 group-hover:text-emerald-400 transition-colors" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-700 group-hover:text-emerald-300 uppercase">
                    System Architecture by @Marisdigitals11
                </span>
            </a>
        </footer>

      </div>
    </div>
  );
}
