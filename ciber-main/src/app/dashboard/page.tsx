'use client';

import {
    Users,
    Shield,
    AlertTriangle,
    Activity,
    TrendingUp,
    Search,
    Bell,
    Globe,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Filter
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Entidades Vigiladas', value: '24', icon: <Users size={20} />, change: '+12.5%', trend: 'up', color: 'text-info' },
    { label: 'Vectores Analizados', value: '642', icon: <Shield size={20} />, change: '+18% vs ayer', trend: 'up', color: 'text-primary' },
    { label: 'Exposiciones Críticas', value: '3', icon: <AlertTriangle size={20} />, change: '-2 mitigadas', trend: 'down', color: 'text-danger' },
    { label: 'Salud Portafolio', value: '72%', icon: <Activity size={20} />, change: 'Riesgo Medio', status: 'warning', color: 'text-warning' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <header className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-full neon-glow" />
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">Control de Mando</h2>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Sistema SIAR-C Activo • Inteligencia en Tiempo Real
                    </p>
                </header>

                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button className="px-5 py-2.5 rounded-lg bg-primary text-black font-black text-[10px] uppercase tracking-widest hover:neon-glow transition-all">Reporte Global</button>
                    <button className="p-2.5 text-slate-400 hover:text-white transition-colors"><Bell size={18} /></button>
                </div>
            </div>

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <GlassCard className="p-6 relative group overflow-hidden border-white/5 hover:border-primary/20 transition-all">
                            {/* Accent Background */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 ${stat.color} group-hover:neon-glow transition-all`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black tracking-tighter ${stat.trend === 'up' ? 'text-info' : 'text-danger'}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums">{stat.value}</h3>
                                    {stat.status === 'warning' && <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Threat Monitoring Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="text-primary" size={20} />
                            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Monitor de Exposición</h4>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                <input className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-[10px] text-white outline-none focus:border-primary/50 w-48" placeholder="Filtrar entidades..." />
                            </div>
                            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all"><Filter size={14} /></button>
                        </div>
                    </div>

                    <GlassCard className="overflow-hidden border-white/5 p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-4 sm:px-8 py-5">Entidad Organizativa</th>
                                        <th className="px-4 sm:px-8 py-5">Nivel de Riesgo</th>
                                        <th className="px-4 sm:px-8 py-5 text-right w-40">Capacidad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { name: 'Corporación TechGlobal', domain: 'tg-infra.net', risk: 'CRÍTICO', score: 28, color: 'text-red-500' },
                                        { name: 'Seguros FinanzaSafe', domain: 'finanzasafe.es', risk: 'ALTO', score: 45, color: 'text-orange-500' },
                                        { name: 'Red Universitaria IED', domain: 'ied-edu.org', risk: 'MEDIO', score: 62, color: 'text-amber-500' },
                                        { name: 'Logística TransMove', domain: 'transmove-log.com', risk: 'MEDIO', score: 70, color: 'text-amber-500' },
                                        { name: 'Banco Alpha Digital', domain: 'alphabank.digital', risk: 'BAJO', score: 88, color: 'text-info' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.03] transition-all group">
                                            <td className="px-4 sm:px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-primary group-hover:scale-110 group-hover:neon-glow transition-all">
                                                        {row.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{row.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono tracking-tight">{row.domain}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${100 - row.score}%` }}
                                                            className={`h-full ${row.score < 40 ? 'bg-red-500' : row.score < 70 ? 'bg-amber-500' : 'bg-primary'}`}
                                                        />
                                                    </div>
                                                    <span className={`text-[10px] font-black tracking-widest ${row.color}`}>{row.risk}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-8 py-5 text-right">
                                                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-primary hover:text-black hover:border-primary transition-all">
                                                    Analizar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* Operations Feed */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Globe className="text-info animate-spin-slow" size={20} />
                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Señales e Inteligencia</h4>
                    </div>

                    <GlassCard className="border-white/5 min-h-[400px]">
                        <div className="space-y-8">
                            {[
                                { title: 'CVE-2024-XPSS Detectado', target: 'Puntos Externos', time: '8m', status: 'critical', desc: 'Posible vulnerabilidad de desbordamiento en gateway' },
                                { title: 'Escaneo OSINT Finalizado', target: 'TechGlobal', time: '24m', status: 'ok', desc: 'Identificados 14 nuevos submdominios' },
                                { title: 'Nueva IP en Lista Negra', target: 'HoneyPot-01', time: '1h', status: 'warning', desc: 'Tráfico detectado desde botnet MIRAI' },
                                { title: 'Actualización de Perfil', target: 'Alpha Digital', time: '3h', status: 'info', desc: 'Sincronización de activos completada' },
                                { title: 'Alerta HIBP Auditada', target: 'Multi-target', time: '5h', status: 'ok', desc: 'Sin filtraciones recientes detectadas' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full border-2 border-[#0a0a0a] ring-2 ring-transparent group-hover:ring-white/10 ${item.status === 'critical' ? 'bg-red-500 neon-glow-red' :
                                            item.status === 'warning' ? 'bg-amber-500' :
                                                item.status === 'ok' ? 'bg-primary' : 'bg-info'
                                            }`} />
                                        {i < 4 && <div className="w-px flex-1 bg-white/10 my-2" />}
                                    </div>
                                    <div className="pb-2 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <p className="text-[12px] font-black text-white uppercase tracking-tight">{item.title}</p>
                                            <span className="text-[10px] text-slate-600 font-bold">{item.time}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.target}</p>
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 hover:bg-white/[0.02] transition-all">
                            Cargar registros anteriores
                        </button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
