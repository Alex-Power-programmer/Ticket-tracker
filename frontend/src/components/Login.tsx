import React, { useState } from 'react';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
    onLogout: () => void;
    isAdmin: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onLogout, isAdmin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
        setUsername('');
        setPassword('');
    };

    if (isAdmin) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'green' }}>✅ Админ вошел</span>
                <button onClick={onLogout}>Выйти</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button type="submit" style={{ padding: '5px 15px' }}>Войти как админ</button>
        </form>
    );
};

export default Login;