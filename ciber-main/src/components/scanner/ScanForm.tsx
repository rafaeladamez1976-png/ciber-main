'use client';

import { useState, useEffect } from 'react';
import { Target, User, Plus, X, Rocket } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { createClient } from '@/lib/supabase/client';

interface Client {
    id: string;
    nombre: string;
    empresa: string;
}

interface ScanFormProps {
    onStart: (data: { target: string, clientId: string, emails: string[] }) => void;
    isLoading: boolean;
}

export default function ScanForm({ onStart, isLoading }: ScanFormProps) {
    const [target, setTarget] = useState('');
    const [clientId, setClientId] = useState('');
    const [emails, setEmails] = useState<string[]>(['admin@company.com']);
    const [newEmail, setNewEmail] = useState('');
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        async function fetchClients() {
            const supabase = createClient();
            if (!supabase) {
                // Mock clients for development if Supabase is not configured
                setClients([
                    { id: '1', nombre: 'Acme Corp', empresa: 'Acme' },
                    { id: '2', nombre: 'Global Logistics', empresa: 'Global' }
                ]);
                return;
            }

            const { data, error } = await supabase
                .from('clients')
                .select('id, nombre, empresa')
                .order('nombre');

            if (data) setClients(data);
            else if (error) console.error('Error fetching clients:', error);
        }
        fetchClients();
    }, []);

    const addEmail = () => {
        if (newEmail && !emails.includes(newEmail)) {
            setEmails([...emails, newEmail]);
            setNewEmail('');
        }
    };

    const removeEmail = (email: string) => {
        setEmails(emails.filter(e => e !== email));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!target) return;
        onStart({ target, clientId, emails });
    };

    return (
        <GlassCard className="p-4 sm:p-8 w-full max-w-[640px] shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 mb-6">
                <Plus className="text-primary" size={20} />
                <h3 className="text-xl font-bold">Nuevo Análisis</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Target Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-400">Objetivo (Dominio o IP)</label>
                    <div className="relative group">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="w-full bg-[#0a0a0a]/50 border border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg py-4 pl-12 pr-4 text-lg transition-all outline-none"
                            placeholder="Ej: google.com o 8.8.8.8"
                            type="text"
                            required
                        />
                    </div>
                </div>

                {/* Client Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-400">Asignar a Cliente</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full bg-[#0a0a0a]/80 border border-slate-700/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg py-3 pl-12 pr-4 text-white text-base transition-all outline-none cursor-pointer"
                        >
                            <option value="" className="bg-[#0a0a0a] text-white">Seleccionar Cliente (Modo Efímero)...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id} className="bg-[#0a0a0a] text-white">
                                    {client.nombre} ({client.empresa})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Email Chips */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-400">Notificar a</label>
                    <div className="flex flex-wrap gap-2 items-center min-h-[48px] p-2 bg-[#0a0a0a]/30 rounded-lg border border-slate-800/50">
                        {emails.map(email => (
                            <div key={email} className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-2 text-xs font-semibold">
                                <span>{email}</span>
                                <button type="button" onClick={() => removeEmail(email)} className="hover:text-white transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                            <input
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                                placeholder="Añadir email..."
                                className="bg-transparent border-none outline-none text-xs text-slate-300 w-full"
                            />
                            <button
                                type="button"
                                onClick={addEmail}
                                className="text-primary hover:text-white transition-colors p-1"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Start Scan Button */}
                <button
                    disabled={isLoading || !target}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0a] font-black text-lg py-5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-wider"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-4 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                    ) : (
                        <>
                            <Rocket size={20} />
                            INICIAR ANÁLISIS
                        </>
                    )}
                </button>
            </form>
        </GlassCard>
    );
}
