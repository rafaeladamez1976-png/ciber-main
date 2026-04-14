'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Users, Building2, Globe, Mail, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { Client, NewClient } from '@/types/client';

interface ClientDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: NewClient | Client) => Promise<void>;
    client?: Client | null;
}

export default function ClientDialog({ isOpen, onClose, onSave, client }: ClientDialogProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'assets' | 'contact'>('info');
    const [formData, setFormData] = useState<NewClient>({
        nombre: '',
        empresa: '',
        telefono: '',
        sector: '',
        notas: '',
        dominio: '',
        ips: [],
        emails: [],
        is_active: true
    });

    const [newEmail, setNewEmail] = useState('');
    const [newIp, setNewIp] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (client) {
            setFormData({
                nombre: client.nombre || '',
                empresa: client.empresa || '',
                telefono: client.telefono || '',
                sector: client.sector || '',
                notas: client.notas || '',
                dominio: client.dominio || '',
                ips: client.ips || [],
                emails: client.emails || [],
                is_active: client.is_active ?? true
            });
        } else {
            setFormData({
                nombre: '',
                empresa: '',
                telefono: '',
                sector: '',
                notas: '',
                dominio: '',
                ips: [],
                emails: [],
                is_active: true
            });
        }
    }, [client, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(client ? { ...formData, id: client.id, created_at: client.created_at } as Client : formData);
            onClose();
        } catch (error) {
            console.error('Error saving client:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const addEmail = () => {
        if (newEmail && !formData.emails.includes(newEmail)) {
            setFormData({ ...formData, emails: [...formData.emails, newEmail] });
            setNewEmail('');
        }
    };

    const addIp = () => {
        if (newIp && !formData.ips.includes(newIp)) {
            setFormData({ ...formData, ips: [...formData.ips, newIp] });
            setNewIp('');
        }
    };

    const removeItem = (type: 'emails' | 'ips', value: string) => {
        setFormData({ ...formData, [type]: formData[type].filter(i => i !== value) });
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'info', label: 'General', icon: <Building2 size={16} /> },
        { id: 'assets', label: 'Activos', icon: <Network size={16} /> },
        { id: 'contact', label: 'Contacto', icon: <Mail size={16} /> },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-3xl"
                >
                    <GlassCard className="p-0 border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        {/* Status Bar */}
                        <div className="h-1.5 w-full bg-slate-800">
                            <motion.div
                                layoutId="progress"
                                className="h-full bg-primary neon-glow"
                                initial={{ width: "33.33%" }}
                                animate={{ width: activeTab === 'info' ? '33.33%' : activeTab === 'assets' ? '66.66%' : '100%' }}
                            />
                        </div>

                        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                                    <Users size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                        {client ? 'Perfil Cliente' : 'Alta Cliente'}
                                    </h2>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{client ? 'Actualizar registros' : 'Registro de nueva entidad'}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="px-8 flex gap-2 border-b border-white/5">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative ${activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#00ff88]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="min-h-[340px]">
                                <AnimatePresence mode='wait'>
                                    {activeTab === 'info' && (
                                        <motion.div
                                            key="info"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre Empresa</label>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                                        <input
                                                            required
                                                            value={formData.empresa}
                                                            onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-700"
                                                            placeholder="Ej: Cyberdyne Systems"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector Industrial</label>
                                                    <select
                                                        value={formData.sector}
                                                        onChange={e => setFormData({ ...formData, sector: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                                    >
                                                        <option value="">Seleccionar sector...</option>
                                                        <option value="tecnologia">Tecnología</option>
                                                        <option value="finanzas">Finanzas / Banca</option>
                                                        <option value="salud">Salud / Pharma</option>
                                                        <option value="energia">Energía / Oil & Gas</option>
                                                        <option value="gobierno">Gobierno / Defensa</option>
                                                        <option value="retail">Retail / eCommerce</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas Internas / Inteligencia</label>
                                                <textarea
                                                    value={formData.notas}
                                                    onChange={e => setFormData({ ...formData, notas: e.target.value })}
                                                    rows={4}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-700 resize-none"
                                                    placeholder="Información relevante sobre el cliente, criticidad, SLA de respuesta o perfil de riesgo..."
                                                />
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white uppercase">Estado de Monitoreo</p>
                                                    <p className="text-[10px] text-slate-500">Determina si el cliente está sujeto a escaneos automáticos</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                                    className={`w-14 h-7 rounded-full transition-all relative p-1 ${formData.is_active ? 'bg-primary' : 'bg-slate-700'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow-sm ${formData.is_active ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'assets' && (
                                        <motion.div
                                            key="assets"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-primary/30 underline-offset-4">Superficie de Ataque Dominio</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                                    <input
                                                        value={formData.dominio}
                                                        onChange={e => setFormData({ ...formData, dominio: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-primary outline-none transition-all font-mono"
                                                        placeholder="domain.tld"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Activos de Red (IPs / Subnets)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={newIp}
                                                        onChange={e => setNewIp(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIp())}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all font-mono"
                                                        placeholder="0.0.0.0"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addIp}
                                                        className="px-6 bg-primary text-[#0a0a0a] rounded-xl font-black hover:neon-glow transition-all uppercase text-[10px]"
                                                    >
                                                        Añadir
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 py-2">
                                                    <AnimatePresence>
                                                        {formData.ips.map(ip => (
                                                            <motion.span
                                                                key={ip}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                className="bg-white/5 border border-white/10 text-slate-300 px-4 py-1.5 rounded-lg text-xs font-mono flex items-center gap-3 group hover:border-primary/30 transition-all"
                                                            >
                                                                {ip}
                                                                <button type="button" onClick={() => removeItem('ips', ip)} className="text-slate-600 hover:text-danger">
                                                                    <X size={12} />
                                                                </button>
                                                            </motion.span>
                                                        ))}
                                                    </AnimatePresence>
                                                    {formData.ips.length === 0 && <p className="text-[10px] text-slate-700 italic">No hay direcciones IP registradas.</p>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'contact' && (
                                        <motion.div
                                            key="contact"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Persona de Contacto</label>
                                                    <input
                                                        required
                                                        value={formData.nombre}
                                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                                        placeholder="Responsable IT / CISO"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teléfono Directo</label>
                                                    <input
                                                        value={formData.telefono}
                                                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                                        placeholder="+34 600 000 000"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Canales de Alerta (Emails)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={newEmail}
                                                        onChange={e => setNewEmail(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                                        placeholder="soc@organization.com"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addEmail}
                                                        className="px-6 bg-primary text-[#0a0a0a] rounded-xl font-black hover:neon-glow transition-all uppercase text-[10px]"
                                                    >
                                                        Añadir
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 py-2">
                                                    <AnimatePresence>
                                                        {formData.emails.map(email => (
                                                            <motion.span
                                                                key={email}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                className="bg-white/5 border border-white/10 text-slate-300 px-4 py-1.5 rounded-lg text-xs flex items-center gap-3 group hover:border-primary/30 transition-all"
                                                            >
                                                                <Mail size={12} className="text-slate-600" />
                                                                {email}
                                                                <button type="button" onClick={() => removeItem('emails', email)} className="text-slate-600 hover:text-danger">
                                                                    <X size={12} />
                                                                </button>
                                                            </motion.span>
                                                        ))}
                                                    </AnimatePresence>
                                                    {formData.emails.length === 0 && <p className="text-[10px] text-slate-700 italic">No hay emails registrados para alertas.</p>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-xl font-black bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300 transition-all uppercase tracking-widest text-xs border border-white/5"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-[2] px-6 py-4 rounded-xl font-black bg-primary text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Cpu className="animate-spin" size={18} /> : <Save size={18} />}
                                    {client ? 'Actualizar Registro System' : 'Confirmar Nuevo ingreso'}
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function Cpu(props: any) {
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
            <rect width="16" height="16" x="4" y="4" rx="2" />
            <rect width="6" height="6" x="9" y="9" rx="1" />
            <path d="M15 2v2" />
            <path d="M15 20v2" />
            <path d="M2 15h2" />
            <path d="M2 9h2" />
            <path d="M20 15h2" />
            <path d="M20 9h2" />
            <path d="M9 2v2" />
            <path d="M9 20v2" />
        </svg>
    )
}
