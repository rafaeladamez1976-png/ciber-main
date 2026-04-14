export interface Client {
    id: string;
    nombre: string;
    empresa: string;
    telefono?: string;
    sector?: string;
    notas?: string;
    dominio?: string;
    ips: string[];
    emails: string[];
    created_at: string;
    is_active: boolean;
}

export type NewClient = Omit<Client, 'id' | 'created_at' | 'is_active'> & {
    is_active?: boolean;
};
