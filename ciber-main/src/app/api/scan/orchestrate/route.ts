import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runScan } from '@/lib/scanner/orchestrator';

export async function POST(req: Request) {
    try {
        const { target, clientId, emails } = await req.json();
        const supabase = await createClient();

        const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
        const targetType = isIp ? 'ip' : 'domain';

        if (!supabase) {
            console.warn('Supabase not configured. Running scan in ephemeral mode...');
            const scanId = 'ephemeral-' + Date.now();
            const result = await runScan(scanId, target, targetType, emails);
            return NextResponse.json({ scanId, scanResult: result, isEphemeral: true });
        }

        // 1. Create registration in Supabase
        const { data: scan, error } = await supabase
            .from('scans')
            .insert({
                client_id: clientId || null,
                target,
                target_type: targetType,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        // 2. Start orchestration background (don't await fully to return scanId quickly)
        // In some environments, this might be terminated if the request ends.
        // For local dev, it's usually fine. In Vercel, use background functions or a queue.
        runScan(scan.id, target, targetType, emails).catch(err => {
            console.error('Background scan error:', err);
        });

        return NextResponse.json({ scanId: scan.id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
