import React, { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicketStatus, deleteTicket, setAuth, clearAuth } from './api/tickets';
import { Ticket, TicketCreate, Filters, TicketStatus } from './types/ticket';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketFilters from './components/TicketFilters';
import Login from './components/Login';
import './App.css';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 10;

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTickets(filters, page * limit, limit);
      setTickets(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки заявок');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filters, page]);

  const handleCreate = async (ticketData: TicketCreate) => {
    console.log('Создание заявки:', ticketData);
    try {
      await createTicket(ticketData);
      await loadTickets();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания заявки');
    }
  };

  const handleStatusChange = async (id: number, status: TicketStatus) => {
    try {
      await updateTicketStatus(id, status);
      await loadTickets();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка изменения статуса');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить заявку?')) return;
    try {
      await deleteTicket(id);
      await loadTickets();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка удаления заявки');
    }
  };

  const handleLogin = (username: string, password: string) => {
    try {
      setAuth(username, password);
      setIsAdmin(true);
      setError(null);
    } catch (err) {
      setError('Ошибка входа');
    }
  };

  const handleLogout = () => {
    clearAuth();
    setIsAdmin(false);
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>📋 Управление заявками</h1>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Login onLogin={handleLogin} onLogout={handleLogout} isAdmin={isAdmin} />
      </div>

      <TicketForm onSubmit={handleCreate} />

      <TicketFilters filters={filters} onFilterChange={setFilters} />

      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
          ❌ Ошибка: {error}
        </div>
      )}

      <TicketList
        tickets={tickets}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        isAdmin={isAdmin}
        loading={loading}
      />

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          Всего: {total} заявок, показано: {tickets.length}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            style={{ padding: '8px 16px' }}
          >
            ◀ Предыдущая
          </button>
          <span style={{ padding: '8px' }}>Страница {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={tickets.length < limit}
            style={{ padding: '8px 16px' }}
          >
            Следующая ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;