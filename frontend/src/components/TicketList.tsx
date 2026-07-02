import React from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types/ticket';

interface TicketListProps {
    tickets: Ticket[];
    onStatusChange: (id: number, status: TicketStatus) => void;
    onDelete: (id: number) => void;
    isAdmin: boolean;
    loading: boolean;
}

const TicketList: React.FC<TicketListProps> = ({
    tickets,
    onStatusChange,
    onDelete,
    isAdmin,
    loading
}) => {
    const getStatusColor = (status: TicketStatus) => {
        const colors = {
            new: '#007bff',
            in_progress: '#ffc107',
            done: '#28a745',
        };
        return colors[status];
    };

    const getPriorityLabel = (priority: TicketPriority) => {
        const labels = {
            low: 'Низкий',
            normal: 'Обычный',
            high: 'Высокий',
        };
        return labels[priority];
    };

    const getStatusLabel = (status: TicketStatus) => {
        const labels = {
            new: 'Новая',
            in_progress: 'В работе',
            done: 'Готова',
        };
        return labels[status];
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (tickets.length === 0) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Нет заявок</div>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Название</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Статус</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Приоритет</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Создана</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ticket.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ticket.title}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {ticket.description || '-'}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <span style={{
                                    backgroundColor: getStatusColor(ticket.status),
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                }}>
                                    {getStatusLabel(ticket.status)}
                                </span>
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {getPriorityLabel(ticket.priority)}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {new Date(ticket.created_at).toLocaleString()}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {ticket.status !== 'done' && (
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
                                            style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        >
                                            <option value="new">Новая</option>
                                            <option value="in_progress">В работе</option>
                                            <option value="done">Готова</option>
                                        </select>
                                    )}
                                    {isAdmin && ticket.status !== 'done' && (
                                        <button
                                            onClick={() => onDelete(ticket.id)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Удалить
                                        </button>
                                    )}
                                    {ticket.status === 'done' && (
                                        <span style={{ color: '#6c757d', fontSize: '12px' }}>Завершена</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketList;