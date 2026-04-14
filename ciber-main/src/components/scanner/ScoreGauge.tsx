'use client';

import { motion } from 'framer-motion';
import ReactCountUp from 'react-countup';
import { Shield, Target, Zap } from 'lucide-react';

interface ScoreGaugeProps {
    score: number;
    size?: number;
    label?: string;
}

export default function ScoreGauge({ score, size = 200, label = "SECURITY SCORE" }: ScoreGaugeProps) {
    const radius = 45;
    const circumference = Math.PI * radius; // Semi-circle
    const progress = (score / 100) * circumference;
    const dashOffset = circumference - progress;

    const getColor = (s: number) => {
        if (s >= 80) return '#00ff88'; // Low Risk / Good
        if (s >= 60) return '#ffd700'; // Medium Risk / Fair
        if (s >= 40) return '#ff8c00'; // High Risk / Poor
        return '#ff0033'; // Critical Risk / Critical
    };

    const getStatusText = (s: number) => {
        if (s >= 80) return 'DEFENSA ÓPTIMA';
        if (s >= 60) return 'POSTURA ESTABLE';
        if (s >= 40) return 'VULNERABILIDAD DETECTADA';
        return 'SISTEMA COMPROMETIDO';
    };

    const strokeColor = getColor(score);

    return (
        <div className="flex flex-col items-center group relative">
            <div className="relative" style={{ width: size, height: size * 0.7 }}>
                {/* Decorative Reticle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-[120%] h-[120%] rounded-full border border-primary/20 animate-[spin_30s_linear_infinite]" />
                    <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full" />
                </div>

                {/* Radar Sweep Effect */}
                <div className="absolute inset-x-0 top-0 bottom-[30%] overflow-hidden opacity-20 pointer-events-none">
                    <motion.div
                        animate={{ rotate: [0, 180] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-1/2 w-[200px] h-[200px] -ml-[100px] origin-bottom bg-gradient-to-t from-primary/30 to-transparent clip-path-radar"
                    />
                </div>

                <svg
                    viewBox="0 0 100 70"
                    className="w-full h-full drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] px-2"
                >
                    <defs>
                        <filter id="gaugeGlow">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ff0033" />
                            <stop offset="50%" stopColor="#ffd700" />
                            <stop offset="100%" stopColor="#00ff88" />
                        </linearGradient>
                    </defs>

                    {/* Scale Labels */}
                    <text x="8" y="55" fontSize="3" fontWeight="900" textAnchor="middle" className="fill-slate-600">0</text>
                    <text x="25" y="25" fontSize="3" fontWeight="900" textAnchor="middle" className="fill-slate-600">25</text>
                    <text x="50" y="15" fontSize="3" fontWeight="900" textAnchor="middle" className="fill-slate-600">50</text>
                    <text x="75" y="25" fontSize="3" fontWeight="900" textAnchor="middle" className="fill-slate-600">75</text>
                    <text x="92" y="55" fontSize="3" fontWeight="900" textAnchor="middle" className="fill-slate-600">100</text>

                    {/* Scale Ticks (More detailed) */}
                    {[...Array(51)].map((_, i) => {
                        const isMain = i % 5 === 0;
                        const angle = i * 3.6; // 180 / 50
                        const rad = (180 + angle) * Math.PI / 180;
                        const length = isMain ? 6 : 3;
                        const x1 = 50 + 48 * Math.cos(rad);
                        const y1 = 55 + 48 * Math.sin(rad);
                        const x2 = 50 + (48 - length) * Math.cos(rad);
                        const y2 = 55 + (48 - length) * Math.sin(rad);

                        return (
                            <line
                                key={i}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={i * 2 <= score ? strokeColor : 'rgba(255,255,255,0.05)'}
                                strokeWidth={isMain ? "0.8" : "0.4"}
                                className="transition-all duration-1000"
                            />
                        );
                    })}

                    {/* Background Arc */}
                    <path
                        d="M 12 55 A 38 38 0 0 1 88 55"
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Segmented Progress (Modern look) */}
                    <motion.path
                        d="M 12 55 A 38 38 0 0 1 88 55"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 2.5, ease: "circOut" }}
                        filter="url(#gaugeGlow)"
                    />
                </svg>

                {/* Score Text and Central Terminal */}
                <div className="absolute inset-x-0 bottom-6 flex flex-col items-center justify-end">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="flex flex-col items-center bg-black/40 px-6 py-2 rounded-2xl border border-white/5 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Shield size={12} className="text-slate-500" />
                            <span className="text-[9px] text-slate-500 font-black tracking-[0.4em] uppercase">
                                {label}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                <ReactCountUp end={score} duration={2.5} />
                            </span>
                            <span className="text-xl font-black text-slate-700 tracking-tighter">%</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tactical Status Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-6 w-full max-w-[280px]"
            >
                <div className="relative p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Target size={16} />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_12px_currentColor]`} style={{ backgroundColor: strokeColor, color: strokeColor }} />
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado Operativo</p>
                            <p className="text-xs font-black tracking-tight uppercase italic" style={{ color: strokeColor }}>
                                {getStatusText(score)}
                            </p>
                        </div>
                    </div>

                    {/* Meta info in gauge */}
                    <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <Zap size={10} className="text-slate-600" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase">Integridad: {score > 80 ? 'HIGH' : 'LOW'}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-[8px] font-bold text-slate-500 uppercase">Risk Level:</span>
                            <span className={`text-[8px] font-black uppercase ${score > 80 ? 'text-primary' : 'text-danger'}`}>
                                {score > 80 ? 'Alpha' : score > 50 ? 'Beta' : 'Omega'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
                .clip-path-radar {
                    clip-path: polygon(50% 100%, 0 0, 100% 0);
                }
            `}</style>
        </div>
    );
}

