'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Globe,
    Shield,
    Activity,
    ExternalLink,
    Mail,
    Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { Client, NewClient } from '@/types/client';
import ClientDialog from '@/components/clients/ClientDialog';

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setIsLoading(true);
        if (!supabase) {
            // Mock data if Supabase is not configured
            setTimeout(() => {
                setClients([
                    {
                        id: '1',
                        nombre: 'Juan Pérez',
                        empresa: 'Acme Corp',
                        dominio: 'acmecorp.com',
                        ips: ['1.1.1.1', '8.8.8.8'],
                        emails: ['admin@acme.com'],
                        created_at: new Date().toISOString(),
                        is_active: true
                    },
                    {
                        id: '2',
                        nombre: 'Maria García',
                        empresa: 'Global Security',
                        dominio: 'globalsecurity.io',
                        ips: ['10.0.0.1'],
                        emails: ['soc@global.io'],
                        created_at: new Date().toISOString(),
                        is_active: true
                    }
                ]);
                setIsLoading(false);
            }, 500);
            return;
        }

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setClients(data);
        if (error) console.error('Error fetching clients:', error);
        setIsLoading(false);
    };

    const handleSaveClient = async (clientData: NewClient | Client) => {
        if (!supabase) {
            if ('id' in clientData) {
                setClients(prev => prev.map(c => c.id === clientData.id ? { ...c, ...clientData } as Client : c));
            } else {
                const newC = { ...clientData, id: Math.random().toString(), created_at: new Date().toISOString(), is_active: (clientData as any).is_active ?? true } as Client;
                setClients(prev => [newC, ...prev]);
            }
            return;
        }

        if ('id' in clientData) {
            // Update
            const { error } = await supabase
                .from('clients')
                .update(clientData)
                .eq('id', clientData.id);
            if (error) throw error;
        } else {
            // Create
            const { error } = await supabase
                .from('clients')
                .insert([clientData]);
            if (error) throw error;
        }
        fetchClients();
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este cliente? Se perderán todos sus datos asociados.')) return;

        if (!supabase) {
            setClients(prev => prev.filter(c => c.id !== id));
            return;
        }

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            fetchClients();
        }
    };

    const filteredClients = clients.filter(c =>
        c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dominio?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Users className="text-primary sm:size-32" size={24} />
                        Gestión de Clientes
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Administra el inventario de activos y contactos por organización</p>
                </div>

                <button
                    onClick={() => {
                        setEditingClient(null);
                        setIsDialogOpen(true);
                    }}
                    className="bg-primary hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] text-[#0a0a0a] font-black px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                    <Plus size={20} />
                    Nuevo Cliente
                </button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Clientes', value: clients.length, icon: <Users className="text-info" />, sub: 'Activos en el portal' },
                    { label: 'Dominios Vigilados', value: clients.filter(c => c.dominio).length, icon: <Globe className="text-primary" />, sub: 'Superficie de ataque' },
                    { label: 'Activos Críticos', value: clients.reduce((acc, c) => acc + c.ips.length, 0), icon: <Shield className="text-danger" />, sub: 'Direcciones IP' },
                ].map((stat, i) => (
                    <GlassCard key={i} className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                            <p className="text-[10px] text-slate-600 font-medium">{stat.sub}</p>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Actions Bar */}
            <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por cliente, empresa, dominio..."
                        className="w-full bg-black/20 border border-white/5 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                    />
                </div>
            </GlassCard>

            {/* Clients Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : filteredClients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredClients.map((client, idx) => (
                            <motion.div
                                key={client.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <GlassCard className="p-6 h-full flex flex-col group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingClient(client);
                                                setIsDialogOpen(true);
                                            }}
                                            className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all text-slate-400"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClient(client.id)}
                                            className="p-2 bg-white/5 rounded-lg hover:bg-danger/20 hover:text-danger transition-all text-slate-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-info/20 border border-primary/20 flex items-center justify-center text-xl font-black text-primary group-hover:neon-glow transition-all">
                                            {client.empresa.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">{client.empresa}</h4>
                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                <Users size={12} className="text-slate-600" />
                                                {client.nombre}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        {client.dominio && (
                                            <div className="bg-black/20 rounded-xl p-3 border border-white/5 group-hover:border-primary/20 transition-all">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Dominio</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-mono text-slate-300">{client.dominio}</span>
                                                    <a href={`https://${client.dominio}`} target="_blank" rel="noreferrer" className="text-primary hover:text-white transition-colors">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Network size={10} /> IPs
                                                </p>
                                                <p className="text-lg font-black text-white">{client.ips.length}</p>
                                            </div>
                                            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Mail size={10} /> Emails
                                                </p>
                                                <p className="text-lg font-black text-white">{client.emails.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Activo</span>
                                        </div>
                                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                                            Historial Scans <Activity size={10} />
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <GlassCard className="p-20 flex flex-col items-center justify-center text-center border-dashed border-white/10">
                    <div className="p-6 bg-white/[0.02] rounded-full mb-4">
                        <Users size={48} className="text-slate-700" />
                    </div>
                    <h5 className="text-xl font-bold text-white mb-2">No se encontraron clientes</h5>
                    <p className="text-slate-500 max-w-sm mb-8">Empieza por registrar tu primer cliente para monitorear su superficie de ataque.</p>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-primary/10 text-primary border border-primary/20 font-black px-8 py-3 rounded-lg hover:bg-primary hover:text-[#0a0a0a] transition-all uppercase tracking-widest text-sm"
                    >
                        Añadir Primer Cliente
                    </button>
                </GlassCard>
            )}

            <ClientDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingClient(null);
                }}
                onSave={handleSaveClient}
                client={editingClient}
            />
        </div>
    );
}
