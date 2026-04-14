'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Radar, Search, Activity, Cpu, Globe, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Device {
    ip: string;
    mac: string;
    hostname: string;
    vendor: string;
    status: 'alive' | 'dead';
}

export default function LocalScannerPage() {
    const [range, setRange] = useState('192.168.1');
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [progress, setProgress] = useState(0);

    const startScan = async () => {
        setIsScanning(true);
        setDevices([]);
        setProgress(0);

        // Simular progreso
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + 5, 95));
        }, 300);

        try {
            const res = await fetch(`/api/scan/local?range=${range}`);
            const data = await res.json();
            
            clearInterval(interval);
            setProgress(100);
            
            if (data.devices) {
                setDevices(data.devices);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsScanning(false);
        }
    };

    const exportToCSV = () => {
        if (devices.length === 0) return;
        
        const headers = ['Dispositivo', 'IP', 'MAC', 'Fabricante', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...devices.map(d => `${d.hostname},${d.ip},${d.mac},${d.vendor},${d.status}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Escaneo_Red_${range}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-full neon-glow" />
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">Escáner de Red Local</h2>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Tecnología Advanced IP Scanner Integrada
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 w-48 font-mono"
                            placeholder="Ej: 192.168.1"
                        />
                    </div>
                    <button
                        onClick={startScan}
                        disabled={isScanning}
                        className="bg-primary text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:neon-glow transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isScanning ? <Activity className="animate-spin" size={14} /> : <Radar size={14} />}
                        {isScanning ? 'Escaneando...' : 'Iniciar Escaneo'}
                    </button>
                </div>
            </header>

            {/* Progress Bar */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary neon-glow"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Barrido de red en curso...</span>
                            <span className="text-[10px] text-primary font-black">{progress}%</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard className="p-6 border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold leading-tight">Resultados</h3>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Total Detectados</p>
                            </div>
                        </div>
                        <div className="text-5xl font-black text-white tracking-tighter mb-2">{devices.length}</div>
                        <div className="flex items-center gap-2 text-info text-[10px] font-black uppercase tracking-widest">
                            <Activity size={12} />
                            Activos ahora mismo
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 border-white/5">
                        <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
                           <Cpu size={14} /> Clasificación de Red
                        </h4>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-xs font-bold text-white mb-1">Servidores/Host</p>
                                <div className="w-full bg-white/5 h-1 rounded-full">
                                    <div 
                                        className="bg-info h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${devices.length > 0 ? (devices.filter(d => d.vendor === 'Unknown Device').length / devices.length) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-xs font-bold text-white mb-1">Vendores Conocidos</p>
                                <div className="w-full bg-white/5 h-1 rounded-full">
                                    <div 
                                        className="bg-warning h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${devices.length > 0 ? (devices.filter(d => d.vendor !== 'Unknown Device').length / devices.length) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Devices Table */}
                <div className="lg:col-span-3">
                    <GlassCard className="p-0 overflow-hidden border-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Dispositivo</th>
                                        <th className="px-8 py-5">Dirección IP</th>
                                        <th className="px-8 py-5">Dirección MAC</th>
                                        <th className="px-8 py-5">Fabricante</th>
                                        <th className="px-8 py-5 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {devices.length === 0 && !isScanning ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4 group">
                                                    <div className="p-6 rounded-full bg-white/5 border border-dashed border-white/10 group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                                                        <Search className="text-slate-600 group-hover:text-primary" size={32} />
                                                    </div>
                                                    <p className="text-slate-500 text-sm font-bold">No se han encontrado dispositivos o no se ha iniciado el escaneo.</p>
                                                    <button onClick={startScan} className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Escanear subred {range}.0/24</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        devices.map((device, i) => (
                                            <motion.tr
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-white/[0.03] transition-all group"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                            <Activity className="text-primary" size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white uppercase">{device.hostname}</p>
                                                            <span className="text-[10px] text-info font-black uppercase tracking-tighter">Online</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <code className="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded">{device.ip}</code>
                                                </td>
                                                <td className="px-8 py-5 font-mono text-xs text-slate-400">
                                                    {device.mac}
                                                </td>
                                                <td className="px-8 py-5 text-xs text-slate-500 font-bold uppercase tracking-tight">
                                                    {device.vendor}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl shadow-transparent hover:shadow-primary/20">
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                    
                    {devices.length > 0 && (
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all"
                            >
                                <Download size={14} /> Exportar Resultados (CSV)
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Feature Flags / Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 border-white/5 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-info/10 flex-shrink-0 flex items-center justify-center text-info">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Escaneo Sigiloso</h4>
                        <p className="text-slate-500 text-xs mt-1">Evita detecciones por sistemas IDS de red local.</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 border-white/5 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Resolución DNS</h4>
                        <p className="text-slate-500 text-xs mt-1">Convierte direcciones IP en nombres de host conocidos.</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 border-white/5 flex gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-xl bg-slate-500/10 flex-shrink-0 flex items-center justify-center text-slate-500">
                        <Download size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Wake-on-LAN</h4>
                        <p className="text-slate-500 text-xs mt-1">Enciende dispositivos remotamente (Requiere Pro).</p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
