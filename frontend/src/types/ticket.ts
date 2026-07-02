export type TicketStatus = 'new' | 'in_progress' | 'done';
export type TicketPriority = 'low' | 'normal' | 'high';

export interface Ticket {
    id: number;
    title: string;
    description: string | null;
    status: TicketStatus;
    priority: TicketPriority;
    created_at: string;
    updated_at: string | null;
}

export interface TicketCreate {
    title: string;
    description?: string;
    status: TicketStatus;
    priority: TicketPriority;
}

export interface TicketUpdate {
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
}

export interface TicketsResponse {
    items: Ticket[];
    total: number;
    skip: number;
    limit: number;
}

export interface Filters {
    status?: TicketStatus;
    priority?: TicketPriority;
    search?: string;
    sort_by?: 'created_at' | 'priority';
    sort_order?: 'asc' | 'desc';
}