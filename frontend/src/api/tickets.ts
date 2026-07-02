import axios from 'axios';
import { Ticket, TicketCreate, TicketUpdate, TicketsResponse, Filters } from '../types/ticket';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const setAuth = (username: string, password: string) => {
    const token = btoa(`${username}:${password}`);
    api.defaults.headers.common['Authorization'] = `Basic ${token}`;
};

export const clearAuth = () => {
    delete api.defaults.headers.common['Authorization'];
};

export const getTickets = async (filters: Filters = {}, skip: number = 0, limit: number = 10) => {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());

    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    const response = await api.get<TicketsResponse>(`/tickets?${params.toString()}`);
    return response.data;
};

export const createTicket = async (ticket: TicketCreate) => {
     console.log('API createTicket вызван:', ticket);
    const response = await api.post<Ticket>('/tickets', ticket);
    return response.data;
};

export const updateTicket = async (id: number, ticket: TicketUpdate) => {
    const response = await api.put<Ticket>(`/tickets/${id}`, ticket);
    return response.data;
};

export const updateTicketStatus = async (id: number, status: string) => {
    const response = await api.patch<Ticket>(`/tickets/${id}/status`, { status });
    return response.data;
};

export const deleteTicket = async (id: number) => {
    const response = await api.delete(`/tickets/${id}`, {
        auth: {
            username: 'admin',
            password: 'admin'
        }
    });
    return response.data;
};