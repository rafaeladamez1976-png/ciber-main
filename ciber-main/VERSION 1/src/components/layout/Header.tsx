'use client';

import { Search, Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
    onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <Menu size={24} />
                </button>

                <div className="w-full max-w-96 hidden sm:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            className="w-full bg-white/5 border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-[#00ff88] focus:border-[#00ff88] text-slate-200 outline-none"
                            placeholder="Search clients, scans..."
                            type="text"
                        />
                    </div>
                </div>
                {/* Mobile search icon only */}
                <button className="sm:hidden p-2 text-slate-400 hover:text-white">
                    <Search size={20} />
                </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <button className="relative text-slate-400 hover:text-white transition-colors p-2">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff4d4d] rounded-full border-2 border-[#0a0a0a]"></span>
                </button>

                <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-white/10">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-[10px] text-[#00ff88] font-semibold uppercase">Cybersecurity Specialist</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/20">
                        <User size={18} className="sm:size-[20px] text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}
