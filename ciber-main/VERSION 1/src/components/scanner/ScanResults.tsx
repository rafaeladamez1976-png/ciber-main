'use client';

import { motion } from 'framer-motion';
import {
    Download,
    FileText,
    LayoutGrid,
    List,
    ShieldCheck,
    Zap,
    History,
    Target,
    Activity,
    Info,
    ChevronRight,
    Search
} from 'lucide-react';
import ScoreGauge from './ScoreGauge';
import OWASPChecklist from './OWASPChecklist';
import FindingCard from './FindingCard';
import { Scan } from '@/types/scan';
import GlassCard from '../ui/GlassCard';

interface ScanResultsProps {
    scan: Scan;
    onDownloadPdf: () => void;
}

export default function ScanResults({ scan, onDownloadPdf }: ScanResultsProps) {
    const criticalCount = scan.findings.filter(f => f.severity === 'critical').length;
    const highCount = scan.findings.filter(f => f.severity === 'high').length;

    return (
        <div className="space-y-12 max-w-6xl mx-auto pb-24">
            {/* Mission Overview */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                            <Target size={20} />
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase tabular-nums">
                            {scan.target}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5"><Activity size={12} className="text-primary" /> Escaneo {scan.target_type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="text-slate-400">ID: {scan.id.substring(0, 8)}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onDownloadPdf}
                        className="flex items-center gap-2.5 bg-primary text-[#0a0a0a] px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:neon-glow transition-all active:scale-95"
                    >
                        <Download size={16} />
                        Exportar Inteligencia
                    </button>
                    <button className="flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-300">
                        <Search size={16} />
                        Auditoría
                    </button>
                </div>
            </header>

            {/* Tactical Briefing / Executive Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <ScoreGauge score={scan.score || 0} />
                </div>

                <GlassCard className="lg:col-span-2 p-8 relative flex flex-col justify-center border-white/10">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Zap size={18} />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em]">Briefing de Operaciones</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-base text-slate-300 leading-relaxed font-medium">
                                El análisis ha finalizado con una puntuación de <span className="text-white font-black underline decoration-primary underline-offset-4">{scan.score} / 100</span>.
                                Se han identificado vectores de ataque activos que comprometen la superficie de exposición.
                            </p>
                            <div className="flex gap-3">
                                <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{criticalCount} Críticos</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{highCount} Altos</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado Final</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${scan.risk_level === 'critical' ? 'text-red-500' : 'text-primary'
                                    }`}>{scan.risk_level}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confianza</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-info">98.4% (8 APIs)</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duración</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">43.2 Segundos</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Compliance Matrix */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                            <LayoutGrid size={16} />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Matriz de Cumplimiento OWASP</h3>
                    </div>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                        Ver Guía de Remediación <ChevronRight size={14} />
                    </button>
                </div>
                <OWASPChecklist results={scan.owasp_results} />
            </div>

            {/* Tactical Intelligence / Findings */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                            <List size={16} />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Inteligencia de Amenazas</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {scan.findings.length > 0 ? (
                        scan.findings
                            .sort((a, b) => {
                                const priority: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
                                return priority[a.severity] - priority[b.severity];
                            })
                            .map((finding, idx) => (
                                <FindingCard key={idx} finding={finding} index={idx} />
                            ))
                    ) : (
                        <div className="py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                                <ShieldCheck size={40} />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Perímetro Asegurado</h4>
                            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">No se han detectado vectores de amenaza explotables ni exposiciones críticas en el objetivo analizado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
