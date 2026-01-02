# Mediaggregator - Quick Start Guide

Your French media aggregation platform is ready! Here's how to get it running.

## What's Been Built

✅ **Backend (Node.js + Express + TypeScript)**
- RSS fetcher service for 14 French media outlets
- Automatic background scheduler (fetches every 60 minutes)
- RESTful API with endpoints for publications, articles, and media sources
- Supabase integration for data storage
- Error handling and logging

✅ **Frontend (React + TypeScript + Vite + Tailwind CSS)**
- Responsive newsstand grid layout (like Cafeyn)
- Publication cards with cover images
- Filter by newspapers vs magazines
- Loading states and error handling
- Responsive design (mobile to desktop)

✅ **Database Schema**
- 5 tables: media_sources, rss_feeds, publications, articles, fetch_logs
- Seeded with 14 French media sources (Le Monde, Le Figaro, etc.)

## Setup Instructions

### 1. Database Setup (Supabase)

1. Go to https://supabase.com and create a new project
2. Once created, go to **SQL Editor**
3. Copy the entire content of `backend/schema.sql`
4. Paste and run it in the SQL Editor
5. Go to **Project Settings > API** to get your credentials

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Supabase credentials:
```
NODE_ENV=development
PORT=3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

FRONTEND_URL=http://localhost:5173
FEED_UPDATE_INTERVAL=60
```

**Frontend (`frontend/.env`):**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

VITE_ENV=development
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend will start on http://localhost:3000
- RSS scheduler will automatically start fetching news
- First fetch happens immediately, then every 60 minutes

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will start on http://localhost:5173

### 5. Initial Data Fetch

On first start, the backend will begin fetching RSS feeds automatically. You can also:

**Trigger Manual Fetch:**
```bash
curl -X POST http://localhost:3000/api/admin/fetch-now
```

**Check Fetch Logs:**
```bash
curl http://localhost:3000/api/admin/fetch-logs
```

## Verify Everything Works

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check Media Sources:**
   ```bash
   curl http://localhost:3000/api/media-sources
   ```

3. **Check Publications:**
   ```bash
   curl http://localhost:3000/api/publications
   ```

4. **Frontend:** Open http://localhost:5173 in your browser

## API Endpoints

### Publications
- `GET /api/publications` - Get today's publications (newsstand view)
- `GET /api/publications/:id` - Get single publication with articles
- `GET /api/publications/source/:sourceId` - Get publications by source
- `GET /api/publications/date/:date` - Get publications by date
- `GET /api/publications/stats` - Get statistics

### Media Sources
- `GET /api/media-sources` - Get all active media sources
- `GET /api/media-sources/:id` - Get single source

### Articles
- `GET /api/articles` - Get recent articles (paginated)
- `GET /api/articles/:id` - Get single article

### Admin
- `POST /api/admin/fetch-now` - Trigger immediate RSS fetch
- `GET /api/admin/fetch-logs` - Get fetch logs

## French Media Sources Included

**Newspapers (Quotidiens):**
1. Le Monde
2. Le Figaro
3. Libération
4. L'Humanité
5. Les Échos
6. France 24
7. 20 Minutes

**Magazines (Hebdomadaires):**
1. Le Point
2. L'Express
3. L'Obs
4. Marianne
5. Challenges
6. Paris Match
7. Courrier International

## Troubleshooting

### Backend won't start
- Check that Supabase credentials are correct in `.env`
- Verify database schema was created successfully
- Check logs for specific errors

### Frontend shows no publications
- Wait for initial RSS fetch to complete (can take 1-2 minutes)
- Trigger manual fetch: `POST /api/admin/fetch-now`
- Check backend logs
- Check fetch logs: `GET /api/admin/fetch-logs`

### Images not showing
- RSS feeds may not always have images
- System falls back to media source logos
- Some sources may have rate limiting

## Development

**Backend:**
- `npm run dev` - Start with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

**Frontend:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Next Steps

1. **Customize Styling:** Edit Tailwind classes in frontend components
2. **Add More Sources:** Insert new media sources and RSS feeds in database
3. **Add Features:**
   - Article detail pages
   - Search functionality
   - Save favorites
   - Email alerts
4. **Deploy:** Consider Vercel (frontend) + Render/Railway (backend)

## Files Structure

```
mediaggregator/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── rss-fetcher.service.ts
│   │   │   ├── publication.service.ts
│   │   │   └── scheduler.service.ts
│   │   ├── models/          # TypeScript types
│   │   ├── utils/           # Utilities
│   │   ├── config/          # Configuration
│   │   └── index.ts         # Entry point
│   ├── schema.sql           # Database schema
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/      # Reusable components
    │   │   └── newsstand/   # Newsstand specific
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom hooks
    │   ├── services/        # API services
    │   ├── types/           # TypeScript types
    │   └── App.tsx
    └── package.json
```

## Support

For issues or questions, check:
- `CLAUDE.md` - Implementation details
- Backend logs - Check console output
- Fetch logs API - `/api/admin/fetch-logs`

Happy aggregating!
