import React, { useState } from 'react';
import { TicketCreate } from '../types/ticket';

interface TicketFormProps {
    onSubmit: (ticket: TicketCreate) => void;
    onCancel?: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<TicketCreate>({
        title: '',
        description: '',
        status: 'new',
        priority: 'normal',
    });
    const [errors, setErrors] = useState<{ title?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.title.length < 3 || formData.title.length > 120) {
            setErrors({ title: 'Название должно быть от 3 до 120 символов' });
            return;
        }

        setErrors({});
        onSubmit(formData);
        setFormData({
            title: '',
            description: '',
            status: 'new',
            priority: 'normal',
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Создать новую заявку</h3>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    name="title"
                    placeholder="Название (от 3 до 120 символов)"
                    value={formData.title}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                {errors.title && <span style={{ color: 'red', fontSize: '14px' }}>{errors.title}</span>}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <textarea
                    name="description"
                    placeholder="Описание (до 1000 символов)"
                    value={formData.description || ''}
                    onChange={handleChange}
                    maxLength={1000}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="done">Готова</option>
                </select>

                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                    <option value="low">Низкий</option>
                    <option value="normal">Обычный</option>
                    <option value="high">Высокий</option>
                </select>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '8px 16px' }}>Создать</button>
                {onCancel && <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>Отмена</button>}
            </div>
        </form>
    );
};

export default TicketForm;