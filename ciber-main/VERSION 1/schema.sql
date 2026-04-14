-- Clientes
create table clients (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text not null,
  dominio text,
  ips text[],
  emails text[],
  created_at timestamptz default now()
);

-- Escaneos
create table scans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  target text not null,           -- dominio o IP escaneada
  target_type text not null,      -- 'domain' | 'ip'
  status text default 'pending',  -- 'pending' | 'running' | 'completed' | 'error'
  score integer,                  -- 0-100
  risk_level text,                -- 'critical' | 'high' | 'medium' | 'low'
  findings jsonb default '[]',
  api_results jsonb default '{}', -- resultados crudos de cada API
  owasp_results jsonb default '{}',
  headers_results jsonb default '{}',
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Hallazgos individuales
create table findings (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid references scans(id) on delete cascade,
  source text not null,           -- 'virustotal' | 'ssllabs' | 'shodan' | etc.
  severity text not null,         -- 'critical' | 'high' | 'medium' | 'low' | 'info'
  title text not null,
  description text,
  recommendation text,
  owasp_category text,
  created_at timestamptz default now()
);

-- Informes
create table reports (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid references scans(id),
  client_id uuid references clients(id),
  pdf_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table clients enable row level security;
alter table scans enable row level security;
alter table findings enable row level security;
alter table reports enable row level security;

-- Policies (ajustar según auth de tu app)
create policy "allow all" on clients for all using (true);
create policy "allow all" on scans for all using (true);
create policy "allow all" on findings for all using (true);
create policy "allow all" on reports for all using (true);
