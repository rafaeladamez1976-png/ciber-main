import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function GlassCard({ children, className, onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white/[0.03] backdrop-blur-[12px] border border-white/10 rounded-xl",
                onClick && "cursor-pointer hover:bg-white/[0.05] transition-all",
                className
            )}
        >
            {children}
        </div>
    );
}
