'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import GlassCard from '../ui/GlassCard';

interface Step {
    id: string;
    name: string;
    desc: string;
    status: 'pending' | 'running' | 'completed' | 'error';
    result?: string;
}

interface ScanProgressProps {
    steps: Step[];
    target: string;
    progress: number;
}

export default function ScanProgress({ steps, target, progress }: ScanProgressProps) {
    return (
        <GlassCard className="p-8 w-full max-w-[640px] border-primary/20 shadow-xl">
            <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="text-primary animate-spin" size={24} />
                        <h3 className="text-xl font-bold">Progreso del Análisis</h3>
                    </div>
                    <p className="text-primary text-sm font-mono ml-9">{target}</p>
                </div>
                <span className="text-primary text-2xl font-black">{Math.round(progress)}%</span>
            </div>

            <ProgressBar
                progress={progress}
                className="mb-10"
            />

            <div className="space-y-4">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${step.status === 'completed' ? 'bg-primary/5 border-primary/20' :
                                step.status === 'running' ? 'bg-white/5 border-primary/40 border-l-4 border-l-primary' :
                                    'bg-white/5 border-white/10 opacity-60'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-primary/20 text-primary' :
                                    step.status === 'running' ? 'bg-white/10 text-primary' :
                                        'bg-white/5 text-slate-500'
                                }`}>
                                {step.status === 'completed' && <CheckCircle size={20} />}
                                {step.status === 'running' && <Loader2 className="animate-spin" size={20} />}
                                {step.status === 'pending' && <Clock size={20} />}
                                {step.status === 'error' && <XCircle size={20} className="text-red-500" />}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{step.name}</p>
                                <p className="text-xs text-slate-500">{step.desc}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            {step.status === 'completed' && (
                                <p className="text-primary font-bold text-sm">{step.result || 'OK'}</p>
                            )}
                            {step.status === 'running' && (
                                <p className="text-primary text-[10px] font-black animate-pulse uppercase tracking-widest">Analizando</p>
                            )}
                            {step.status === 'pending' && (
                                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">En espera</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
