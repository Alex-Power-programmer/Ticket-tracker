# Ticket Tracker

Fullstack-приложение для учёта внутренних заявок.

## 📋 Описание

Приложение позволяет создавать, просматривать, фильтровать, сортировать и удалять заявки. Реализована пагинация, поиск, фильтрация по статусу и приоритету, а также админ-доступ для удаления заявок.

## 🛠 Стек технологий

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

### Frontend
- React 18
- TypeScript
- Vite
- Axios

## 🚀 Запуск проекта

### 1. Клонирование репозитория

```bash
git clone https://github.com/Alex-Power-programmer/Ticket-tracker>
cd ticket-tracker.git
```

### 2. Установка зависимостей
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Запуск сервера
```bash
uvicorn app.main:app --reload
```
Сервер будет доступен по адресу: http://127.0.0.1:8000

### 4. Frontend
Установка зависимостей

```bash
cd frontend
npm install
npm run dev
```
Приложение будет доступно по адресу: http://localhost:5173

