'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    AlertCircle,
    Info,
    ShieldAlert,
    Cpu,
    Mail,
    Globe,
    Binary,
    ExternalLink,
    Terminal,
    Eye,
    Target,
    Activity,
    Lock
} from 'lucide-react';
import SeverityBadge from '../ui/SeverityBadge';
import { Finding } from '@/types/scan';

interface FindingCardProps {
    finding: Finding;
    index: number;
}

const sourceIcons: Record<string, any> = {
    'VirusTotal': <ShieldAlert size={16} />,
    'SSL Labs': <Lock size={16} />,
    'HTTP Headers': <Terminal size={16} />,
    'URLScan': <Eye size={16} />,
    'HIBP': <Mail size={16} />,
    'IPInfo': <Globe size={16} />,
    'ThreatCrowd': <Binary size={16} />,
    'AbuseIPDB': <ShieldAlert size={16} />
};

export default function FindingCard({ finding, index }: FindingCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group rounded-2xl border transition-all duration-300 overflow-hidden relative ${isExpanded
                ? 'bg-white/[0.05] border-white/20 shadow-2xl scale-[1.01] z-10'
                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                }`}
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 flex items-center gap-5 cursor-pointer relative"
            >
                {/* Tactical Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${isExpanded ? 'w-1.5' : ''} ${finding.severity === 'critical' ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' :
                    finding.severity === 'high' ? 'bg-orange-500 shadow-[0_0_15px_#f97316]' :
                        finding.severity === 'medium' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' :
                            'bg-blue-500 shadow-[0_0_10px_#3b82f6]'
                    }`} />

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${isExpanded ? 'rotate-[360deg] bg-white/10' : 'group-hover:scale-110'
                    } ${finding.severity === 'critical' ? 'text-red-500 border border-red-500/20' :
                        finding.severity === 'high' ? 'text-orange-500 border border-orange-500/20' :
                            finding.severity === 'medium' ? 'text-amber-500 border border-amber-500/20' :
                                'text-blue-500 border border-blue-500/20'
                    }`}>
                    {sourceIcons[finding.source] || <AlertCircle size={22} />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <SeverityBadge severity={finding.severity} />
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic">{finding.source}</span>
                        {finding.owasp_category && (
                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black tracking-widest border border-primary/20 uppercase">
                                {finding.owasp_category}
                            </span>
                        )}
                    </div>
                    <h4 className="text-base font-bold text-white tracking-tight group-hover:text-primary transition-colors pr-8 flex items-center gap-2">
                        {finding.title}
                        {isExpanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/40 font-mono font-normal">#EXP-{index.toString().padStart(3, '0')}</motion.span>}
                    </h4>
                </div>

                <div className={`p-2 rounded-lg bg-white/5 text-slate-500 transition-all duration-500 ${isExpanded ? 'rotate-180 bg-primary/20 text-primary' : ''}`}>
                    <ChevronDown size={18} />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                    >
                        <div className="p-6 space-y-8 bg-gradient-to-b from-white/[0.03] to-transparent">
                            <div className="grid md:grid-cols-[1.8fr_1.2fr] gap-8">
                                {/* Technical Core */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                                            <Info size={12} />
                                            Análisis Forense
                                        </div>
                                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-sm text-slate-300 leading-relaxed font-medium italic">
                                            {finding.description}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.3em]">
                                            <Activity size={12} className="text-primary" />
                                            Mitigación Estratégica
                                        </div>
                                        <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 group/rec">
                                            <p className="text-sm text-white font-bold leading-relaxed selection:bg-primary selection:text-black">
                                                {finding.recommendation}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Evidence Block (Place) */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                            <Terminal size={12} />
                                            Evidencia Técnica
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5 font-mono text-[11px] text-primary/70 overflow-x-auto whitespace-pre leading-relaxed">
                                            {`# Diagnostic result from ${finding.source}\n{ "status": "alert", "severity": "${finding.severity}", "timestamp": "${new Date().toISOString()}" }`}
                                        </div>
                                    </div>
                                </div>

                                {/* Tactical Metadata Overlay */}
                                <div className="space-y-6">
                                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Perfil de Misión</p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-600 uppercase">Confianza</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary" />)}
                                                            <div className="w-2 h-2 rounded-full bg-white/20" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white">ALTA</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-600 uppercase">Impacto</p>
                                                    <span className={`text-[10px] font-black ${finding.severity === 'critical' || finding.severity === 'high' ? 'text-danger' : 'text-warning'}`}>
                                                        SIGNIFICATIVO
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex justify-between items-center text-[11px]">
                                                    <span className="text-slate-500 font-medium">Vector de Ataque</span>
                                                    <span className="text-white font-black uppercase tracking-tighter">RED EXTERNA</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[11px]">
                                                    <span className="text-slate-500 font-medium">Identificador</span>
                                                    <span className="text-white font-mono opacity-60">ID-{finding.id.substring(0, 8)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <button className="w-full py-3 rounded-xl bg-primary text-[#0a0a0a] font-black uppercase tracking-widest text-[10px] hover:neon-glow transition-all flex items-center justify-center gap-2">
                                                <ExternalLink size={14} />
                                                Abrir Documentación
                                            </button>
                                            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2">
                                                <Lock size={14} />
                                                Reportar Falso Positivo
                                            </button>
                                        </div>
                                    </div>

                                    {/* Asset Association */}
                                    <div className="p-4 rounded-xl border border-dashed border-white/10 flex items-center gap-4 bg-white/[0.01]">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                            <Target size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase">Activo Relacionado</p>
                                            <p className="text-xs font-bold text-white truncate max-w-[150px]">Producción / Gateway</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function Zap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.71 13 3l-2 9h9L11 21l2-9H4Z" />
        </svg>
    )
}
