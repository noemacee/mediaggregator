# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mediaggregator is a project to aggregate French media sources into a single, simple website.

I want to create a website just like https://www.cafeyn.co/fr/newsstand

## Technology Stack

### Frontend (`/frontend`)
- React 18 with TypeScript
- Vite for build tooling and dev server
- Tailwind CSS for styling
- Axios for API communication

### Backend (`/backend`)
- Node.js with Express
- TypeScript
- Supabase (PostgreSQL database with built-in auth, storage, and real-time)
- Supabase JS client for database access
- RSS parsing libraries for media aggregation

## Project Structure

```
/frontend          - React frontend application
/backend           - Express API server
```

## Development Commands

### Frontend
```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start development server (typically http://localhost:5173)
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Backend
```bash
cd backend
npm install        # Install dependencies
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript
npm start          # Run compiled production build
npm run db:migrate # Run database migrations
npm run db:seed    # Seed database with initial data
```

## Architecture

### Data Flow
1. Backend fetches and aggregates media content from various French news sources via RSS feeds and web scraping
2. Data is stored in Supabase (PostgreSQL) with source metadata, articles, and publication information
3. Frontend fetches aggregated content via REST API or directly from Supabase
4. UI displays media sources in a grid layout similar to Cafeyn newsstand

### Supabase Setup
- Create a Supabase project at https://supabase.com
- Configure database tables for media sources and articles
- Obtain API keys and database URL from project settings
- Add credentials to backend/.env

### Key Components
- Media aggregation service: Periodically fetches content from configured sources
- API endpoints: Serve aggregated media data to frontend
- Frontend grid view: Displays media sources with logos, titles, and preview content
