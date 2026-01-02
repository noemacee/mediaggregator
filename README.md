# Mediaggregator

A media aggregation platform that brings together French news sources and publications in one simple, elegant interface - inspired by [Cafeyn Newsstand](https://www.cafeyn.co/fr/newsstand).

## Features

- Aggregates content from multiple French media sources
- Clean, grid-based newsstand layout
- Real-time updates from RSS feeds and web sources
- Easy browsing of publications and articles

## Tech Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS
**Backend:** Node.js + Express + TypeScript
**Database:** Supabase (PostgreSQL with built-in auth and real-time)

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account (free tier available at https://supabase.com)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mediaggregator
```

2. Set up Supabase
- Create a new project at https://supabase.com
- Go to Project Settings > API to get your API keys and URL
- Go to SQL Editor to create your database tables (schema provided in backend/prisma/schema.sql)

3. Set up the backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase URL and API keys
npm run dev
```

4. Set up the frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. Open http://localhost:5173 in your browser

## Project Structure

```
/frontend          - React frontend application
/backend           - Express API server
```

For more detailed development guidance, see [CLAUDE.md](./CLAUDE.md).
