'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, ShieldAlert, Shield, RefreshCw,
    CheckCircle, XCircle, AlertTriangle, Info,
    Lock, Globe, Server, Database, Zap, ArrowRight, Code
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const categoryIcons: Record<string, any> = {
    'hardening': Shield,
    'api-security': Server,
    'information-leakage': AlertTriangle,
    'transport-security': Lock,
    'browser-security': Globe,
    'configuration': Database,
};

const gradeColors: Record<string, string> = {
    'A': 'text-primary bg-primary/10 border-primary/30',
    'B': 'text-info bg-info/10 border-info/30',
    'C': 'text-warning bg-warning/10 border-warning/30',
    'D': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    'F': 'text-danger bg-danger/10 border-danger/30',
};

export default function SecurityAuditPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<any>(null);

    const runAudit = async () => {
        setIsRunning(true);
        setResults(null);
        try {
            const res = await fetch('/api/security-test');
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full neon-glow" />
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">Auto-Auditoría de Seguridad</h2>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                    Evaluación de la postura de seguridad de esta aplicación
                </p>
            </header>

            {/* Launch Card */}
            <GlassCard className="p-10 border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-info/5 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className={`w-24 h-24 rounded-3xl border-2 flex items-center justify-center transition-all duration-500 ${isRunning ? 'border-primary animate-pulse bg-primary/10' : 'border-white/10 bg-white/5'}`}>
                        <ShieldCheck size={40} className={isRunning ? 'text-primary animate-spin' : 'text-slate-400'} />
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic">SIAR-C Security Scanner</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                            Ejecuta un análisis completo de seguridad sobre esta propia aplicación: headers, validación de APIs, exposición de datos, HTTPS, y más.
                        </p>
                    </div>

                    <button
                        onClick={runAudit}
                        disabled={isRunning}
                        className="flex items-center gap-3 bg-primary text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:neon-glow transition-all disabled:opacity-60 text-sm"
                    >
                        {isRunning ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                        {isRunning ? 'Analizando aplicación...' : 'Iniciar Auditoría de Seguridad'}
                    </button>
                </div>
            </GlassCard>

            {/* Scan progress */}
            <AnimatePresence>
                {isRunning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        {['Verificando cabeceras de seguridad...', 'Testando validación de APIs...', 'Comprobando exposición de archivos sensibles...', 'Evaluando configuración de producción...'].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.4 }}
                                className="flex items-center gap-3 text-xs text-slate-400"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {step}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Score Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <GlassCard className={`p-6 border ${gradeColors[results.grade]}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Calificación</p>
                                <p className="text-6xl font-black">{results.grade}</p>
                                <p className="text-xs font-bold mt-1 opacity-70">Security Grade</p>
                            </GlassCard>
                            <GlassCard className="p-6">
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Puntuación</p>
                                <p className="text-4xl font-black text-white">{results.score}</p>
                                <p className="text-[10px] text-slate-500 mt-1">/ 100 puntos</p>
                            </GlassCard>
                            <GlassCard className="p-6 border-primary/20">
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Aprobados</p>
                                <p className="text-4xl font-black text-primary">{results.passed}</p>
                                <p className="text-[10px] text-slate-500 mt-1">de {results.totalTests} tests</p>
                            </GlassCard>
                            <GlassCard className="p-6 border-danger/20">
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Fallos</p>
                                <p className="text-4xl font-black text-danger">{results.failed}</p>
                                <p className="text-[10px] text-slate-500 mt-1">{results.warnings} advertencias</p>
                            </GlassCard>
                        </div>

                        {/* Score Bar */}
                        <GlassCard className="p-6">
                            <div className="flex justify-between mb-3 text-xs font-black uppercase text-slate-400 tracking-widest">
                                <span>Postura de Seguridad</span>
                                <span className={results.score >= 80 ? 'text-primary' : results.score >= 60 ? 'text-warning' : 'text-danger'}>
                                    {results.score}%
                                </span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${results.score}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${results.score >= 80 ? 'bg-primary neon-glow' : results.score >= 60 ? 'bg-warning' : 'bg-danger'}`}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-[9px] font-black text-slate-600 uppercase tracking-wider">
                                <span>Crítico (0)</span>
                                <span>Medio (50)</span>
                                <span>Seguro (100)</span>
                            </div>
                        </GlassCard>

                        {/* Individual Tests */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Code size={16} className="text-primary" /> Resultados por Test
                            </h3>
                            {results.tests.map((test: any, i: number) => {
                                const Icon = categoryIcons[test.category] || Shield;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                    >
                                        <GlassCard className={`p-6 border-l-4 ${
                                            test.status === 'pass' ? 'border-l-primary' :
                                            test.status === 'fail' ? 'border-l-danger' :
                                            test.status === 'warning' ? 'border-l-warning' : 'border-l-slate-600'
                                        }`}>
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                                                    test.status === 'pass' ? 'bg-primary/10 text-primary' :
                                                    test.status === 'fail' ? 'bg-danger/10 text-danger' :
                                                    'bg-warning/10 text-warning'
                                                }`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-4 mb-1">
                                                        <h4 className="text-sm font-bold text-white">{test.name}</h4>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className="text-[9px] font-black text-slate-500 uppercase">{test.category}</span>
                                                            {test.status === 'pass' && <CheckCircle size={16} className="text-primary" />}
                                                            {test.status === 'fail' && <XCircle size={16} className="text-danger" />}
                                                            {test.status === 'warning' && <AlertTriangle size={16} className="text-warning" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-400">{test.detail}</p>
                                                    {test.recommendation && (
                                                        <p className="mt-2 text-[10px] text-info italic flex items-center gap-1">
                                                            <Info size={10} /> {test.recommendation}
                                                        </p>
                                                    )}
                                                    {test.score !== undefined && (
                                                        <div className="mt-3">
                                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${test.score >= 80 ? 'bg-primary' : test.score >= 50 ? 'bg-warning' : 'bg-danger'}`}
                                                                    style={{ width: `${test.score}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Recommendations */}
                        {results.summary?.recommendations?.length > 0 && (
                            <GlassCard className="p-8 border-info/20 bg-info/5">
                                <h3 className="text-sm font-black text-info uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <ArrowRight size={16} /> Recomendaciones de Seguridad
                                </h3>
                                <div className="space-y-3">
                                    {results.summary.recommendations.map((rec: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                            <span className="text-info font-black mt-0.5">→</span>
                                            {rec}
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Re-run button */}
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={runAudit}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all"
                            >
                                <RefreshCw size={14} /> Volver a Ejecutar Auditoría
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
