'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ShieldAlert, Zap, Cpu, Activity } from 'lucide-react';

interface OWASPChecklistProps {
    results: Record<string, { status: 'ok' | 'warning' | 'critical', count: number }>;
}

const categories = [
    { id: 'A01', name: 'Broken Access Control', desc: 'Restricciones de acceso inadecuadas' },
    { id: 'A02', name: 'Cryptographic Failures', desc: 'Fallos en cifrado y protección de datos' },
    { id: 'A03', name: 'Injection', desc: 'Inyección de código malicioso (SQL, etc)' },
    { id: 'A04', name: 'Insecure Design', desc: 'Deficiencias en el diseño de seguridad' },
    { id: 'A05', name: 'Security Misconfiguration', desc: 'Configuraciones de seguridad erróneas' },
    { id: 'A06', name: 'Vulnerable Components', desc: 'Componentes obsoletos con exploits' },
    { id: 'A07', name: 'Auth Failures', desc: 'Fallos en identificación y autenticación' },
    { id: 'A08', name: 'Integrity Failures', desc: 'Fallos de integridad en software/datos' },
    { id: 'A09', name: 'Logging Failures', desc: 'Déficit en monitorización y logs' },
    { id: 'A10', name: 'SSRF', desc: 'Server-Side Request Forgery' },
];

export default function OWASPChecklist({ results }: OWASPChecklistProps) {
    return (
        <div className="relative">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 grid grid-cols-5 opacity-5 pointer-events-none">
                {[...Array(5)].map((_, i) => <div key={i} className="border-r border-white/10 h-full" />)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                {categories.map((cat, idx) => {
                    const res = results[cat.id] || { status: 'ok', count: 0 };
                    const isCritical = res.status === 'critical';
                    const isWarning = res.status === 'warning';

                    return (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className={`relative p-5 rounded-2xl border transition-all duration-300 group overflow-hidden ${isCritical ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]' :
                                isWarning ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]' :
                                    'bg-white/[0.02] border-white/5 hover:border-primary/40 hover:bg-white/[0.04]'
                                }`}
                        >
                            {/* Scanning Beam Animation */}
                            <motion.div
                                animate={{ top: ['-100%', '200%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: idx * 0.4 }}
                                className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100"
                            />

                            {/* Category ID Background Watermark */}
                            <div className={`absolute -right-1 -top-1 opacity-[0.05] group-hover:opacity-10 transition-opacity uppercase font-black text-4xl pointer-events-none tracking-tighter italic`}>
                                {cat.id}
                            </div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`p-2.5 rounded-xl border ${isCritical ? 'bg-red-500/20 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                                    isWarning ? 'bg-amber-500/20 border-amber-500/30 text-amber-500' :
                                        'bg-white/5 border-white/10 text-slate-400 group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all'
                                    }`}>
                                    {isCritical ? <ShieldAlert size={20} /> :
                                        isWarning ? <AlertCircle size={20} /> :
                                            <CheckCircle2 size={20} />}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-slate-500 tracking-widest leading-none mb-1">{cat.id}</span>
                                    <Activity size={10} className={`${res.status === 'ok' ? 'text-primary/40' : 'text-danger/40'} animate-pulse`} />
                                </div>
                            </div>

                            <div className="space-y-1 relative z-10">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                    {cat.name}
                                </h4>
                                <p className="text-[9px] text-slate-500 leading-relaxed line-clamp-2 h-7 font-medium">
                                    {cat.desc}
                                </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-1.5 font-black uppercase tracking-[0.15em] text-[9px]">
                                    <span className={`${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-600'}`}>
                                        {isCritical ? 'Fallo' : isWarning ? 'Vulnerable' : 'Cumple'}
                                    </span>
                                    {!isCritical && !isWarning && <span className="text-primary font-mono text-[8px] opacity-60">PASS</span>}
                                </div>

                                {res.count > 0 ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-black ${isCritical ? 'bg-red-500/20 border-red-500/30 text-red-500' : 'bg-amber-500/20 border-amber-500/30 text-amber-500'
                                            }`}>
                                        <Zap size={8} fill="currentColor" />
                                        {res.count}
                                    </motion.div>
                                ) : (
                                    <Cpu size={12} className="text-slate-800" />
                                )}
                            </div>

                            {/* Status Bottom Bar */}
                            <div className={`absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${isCritical ? 'bg-red-500' :
                                isWarning ? 'bg-amber-500' :
                                    'bg-primary opacity-0 group-hover:opacity-100'
                                }`} />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
