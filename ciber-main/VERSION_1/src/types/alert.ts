export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'investigating' | 'resolved' | 'closed';

export interface Alert {
    id: string;
    scan_id?: string;
    client_name?: string;
    title: string;
    description: string;
    severity: AlertSeverity;
    status: AlertStatus;
    type: 'vulnerability' | 'malware' | 'leak' | 'system';
    created_at: string;
}
