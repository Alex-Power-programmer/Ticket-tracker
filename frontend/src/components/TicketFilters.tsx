import React from 'react';
import { Filters } from '../types/ticket';

interface TicketFiltersProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({ filters, onFilterChange }) => {
    const handleChange = (key: keyof Filters, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Поиск по названию или описанию"
                value={filters.search || ''}
                onChange={(e) => handleChange('search', e.target.value || undefined)}
                style={{ padding: '8px', flex: 1, minWidth: '200px', border: '1px solid #ddd', borderRadius: '4px' }}
            />

            <select
                value={filters.status || ''}
                onChange={(e) => handleChange('status', e.target.value || undefined)}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <option value="">Все статусы</option>
                <option value="new">Новая</option>
                <option value="in_progress">В работе</option>
                <option value="done">Готова</option>
            </select>

            <select
                value={filters.priority || ''}
                onChange={(e) => handleChange('priority', e.target.value || undefined)}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <option value="">Все приоритеты</option>
                <option value="low">Низкий</option>
                <option value="normal">Обычный</option>
                <option value="high">Высокий</option>
            </select>

            <select
                value={filters.sort_by || 'created_at'}
                onChange={(e) => handleChange('sort_by', e.target.value as 'created_at' | 'priority')}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <option value="created_at">По дате создания</option>
                <option value="priority">По приоритету</option>
            </select>

            <select
                value={filters.sort_order || 'desc'}
                onChange={(e) => handleChange('sort_order', e.target.value as 'asc' | 'desc')}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
            </select>

            <button onClick={() => onFilterChange({})} style={{ padding: '8px 16px' }}>
                Сбросить фильтры
            </button>
        </div>
    );
};

export default TicketFilters;