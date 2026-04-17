'use client';

import { useState, useEffect } from 'react';
import {
    Bell,
    AlertTriangle,
    ShieldAlert,
    Info,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    ArrowUpRight,
    MoreVertical,
    Shield,
    Eye,
    CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { Alert, AlertSeverity, AlertStatus } from '@/types/alert';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const supabase = createClient();

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setIsLoading(true);
        // We'll use mock data as there's no alerts table in the schema yet,
        // but this logic would be connected to Supabase in production.
        setTimeout(() => {
            const mockAlerts: Alert[] = [
                {
                    id: '1',
                    title: 'Detección de Malware Crítica',
                    description: 'El dominio techcorp.com ha sido marcado por 5 motores de VirusTotal como malicioso.',
                    severity: 'critical',
                    status: 'new',
                    type: 'malware',
                    client_name: 'TechCorp',
                    created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
                },
                {
                    id: '2',
                    title: 'Certificado SSL Expirando',
                    description: 'El certificado para cloud-services.io expirará en menos de 7 días.',
                    severity: 'high',
                    status: 'investigating',
                    type: 'vulnerability',
                    client_name: 'Cloud Services',
                    created_at: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
                },
                {
                    id: '3',
                    title: 'Headers de Seguridad Ausentes',
                    description: 'Múltiples encabezados de seguridad (CSP, HSTS) no detectados en api.secure.net',
                    severity: 'medium',
                    status: 'resolved',
                    type: 'vulnerability',
                    client_name: 'SecureNet',
                    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                },
                {
                    id: '4',
                    title: 'Filtración de Datos Detectada',
                    description: 'El correo admin@datasafe.io fue encontrado en una nueva filtración de datos masiva.',
                    severity: 'critical',
                    status: 'new',
                    type: 'leak',
                    client_name: 'DataSafe',
                    created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
                }
            ];
            setAlerts(mockAlerts);
            setIsLoading(false);
        }, 800);
    };

    const handleStatusUpdate = (id: string, newStatus: AlertStatus) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    };

    const getSeverityIcon = (sev: AlertSeverity) => {
        switch (sev) {
            case 'critical': return <ShieldAlert className="text-danger" size={24} />;
            case 'high': return <AlertTriangle className="text-orange-500" size={24} />;
            case 'medium': return <Info className="text-warning" size={24} />;
            case 'low': return <Info className="text-info" size={24} />;
        }
    };

    const getStatusColor = (status: AlertStatus) => {
        switch (status) {
            case 'new': return 'bg-danger text-white ring-danger/50 shadow-[0_0_10px_rgba(255,77,77,0.4)]';
            case 'investigating': return 'bg-warning text-[#0a0a0a] ring-warning/50';
            case 'resolved': return 'bg-primary text-[#0a0a0a] ring-primary/50';
            case 'closed': return 'bg-slate-700 text-slate-300 ring-slate-700/50';
        }
    };

    const filteredAlerts = alerts.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
        const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
        return matchesSearch && matchesSeverity && matchesStatus;
    });

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center border border-danger/20">
                        <Bell className="text-danger" size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Monitoreo de Alertas</h2>
                        <p className="text-slate-500 text-sm font-medium">Respuestas en tiempo real ante amenazas detectadas</p>
                    </div>
                </div>
            </header>

            {/* Alert Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Nuevas Alertas', value: alerts.filter(a => a.status === 'new').length, color: 'text-danger', icon: <Bell size={20} /> },
                    { label: 'Críticas Hoy', value: alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length, color: 'text-danger', icon: <ShieldAlert size={20} /> },
                    { label: 'En Investigación', value: alerts.filter(a => a.status === 'investigating').length, color: 'text-warning', icon: <Clock size={20} /> },
                    { label: 'Resueltas (24h)', value: alerts.filter(a => a.status === 'resolved').length, color: 'text-primary', icon: <CheckCircle2 size={20} /> },
                ].map((stat, i) => (
                    <GlassCard key={i} className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        <h3 className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
                        <div className={`mt-2 h-1 w-12 rounded-full ${stat.color.replace('text', 'bg')}`} />
                    </GlassCard>
                ))}
            </div>

            {/* Filter Bar */}
            <GlassCard className="p-4 flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por amenaza o cliente..."
                        className="w-full bg-black/20 border border-white/5 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10 shrink-0">
                        <Filter size={16} className="text-slate-500 ml-2" />
                        <select
                            value={filterSeverity}
                            onChange={e => setFilterSeverity(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-bold text-slate-300 outline-none pr-4 uppercase"
                        >
                            <option value="all">Severidad</option>
                            <option value="critical">Crítico</option>
                            <option value="high">Alto</option>
                            <option value="medium">Medio</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10 shrink-0">
                        <Clock size={16} className="text-slate-500 ml-2" />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-bold text-slate-300 outline-none pr-4 uppercase"
                        >
                            <option value="all">Estado</option>
                            <option value="new">Nuevo</option>
                            <option value="investigating">En Curso</option>
                            <option value="resolved">Resuelto</option>
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* Alerts Feed */}
            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-white/[0.02] rounded-2xl animate-pulse" />
                    ))
                ) : filteredAlerts.length > 0 ? (
                    <AnimatePresence>
                        {filteredAlerts.map((alert, idx) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <GlassCard className={`p-0 border-l-4 ${alert.severity === 'critical' ? 'border-l-danger' :
                                        alert.severity === 'high' ? 'border-l-orange-500' : 'border-l-warning'
                                    } group relative`}>
                                    <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                                        {/* Icon & Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    {getSeverityIcon(alert.severity)}
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${alert.severity === 'critical' ? 'text-danger' : 'text-slate-400'
                                                        }`}>
                                                        {alert.severity}
                                                    </span>
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    {new Date(alert.created_at).toLocaleString()}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded">
                                                    {alert.client_name}
                                                </span>
                                            </div>

                                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                                {alert.title}
                                            </h4>
                                            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                                                {alert.description}
                                            </p>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ring-2 ring-inset ${getStatusColor(alert.status)}`}>
                                                {alert.status}
                                            </div>

                                            <div className="flex gap-2 mt-4">
                                                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                                    <Eye size={16} /> Ver Detalles
                                                </button>
                                                {alert.status === 'new' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(alert.id, 'investigating')}
                                                        className="p-3 bg-warning/10 text-warning rounded-xl hover:bg-warning/20 transition-all text-xs font-bold uppercase tracking-widest"
                                                    >
                                                        Investigar
                                                    </button>
                                                )}
                                                {alert.status !== 'resolved' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(alert.id, 'resolved')}
                                                        className="p-3 bg-primary text-[#0a0a0a] rounded-xl hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                                    >
                                                        <CheckCircle size={16} /> Resolver
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action decoration */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="text-primary" size={20} />
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/10">
                            <CheckCircle2 size={40} className="text-primary opacity-20" />
                        </div>
                        <h4 className="text-white font-bold text-2xl uppercase tracking-tighter">Sistema Limpio</h4>
                        <p className="text-slate-500 mt-2 max-w-xs mx-auto">No se han detectado nuevas amenazas o todas las alertas han sido gestionadas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
