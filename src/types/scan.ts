export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ScanStatus = 'pending' | 'running' | 'completed' | 'error';
export type TargetType = 'domain' | 'ip';

export interface Finding {
  id?: string;
  scan_id?: string;
  source: string;
  severity: Severity;
  title: string;
  description?: string;
  recommendation?: string;
  owasp_category?: string;
  created_at?: string;
}

export interface Scan {
  id: string;
  client_id?: string;
  target: string;
  target_type: TargetType;
  status: ScanStatus;
  score?: number;
  risk_level?: Severity;
  findings: Finding[];
  api_results: Record<string, any>;
  owasp_results: Record<string, { status: 'ok' | 'warning' | 'critical', count: number }>;
  headers_results: Record<string, any>;
  created_at: string;
  completed_at?: string;
}
