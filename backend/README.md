# Backend

Express + TypeScript API server for Mediaggregator.

## Folder Structure

```
src/
├── controllers/    - Request handlers
├── routes/         - API route definitions
├── services/       - Business logic and external integrations
├── models/         - Database models (Prisma schema)
├── middleware/     - Express middleware
├── utils/          - Utility functions
└── config/         - Configuration files
```

## Getting Started

```bash
npm install
cp .env.example .env
# Update .env with your Supabase URL and API keys
npm run dev
```

## Supabase Setup

1. Create a project at https://supabase.com
2. Get your API URL and keys from Project Settings > API
3. Run the SQL schema in Supabase SQL Editor (see schema.sql)
4. Add credentials to .env

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled production build
- `npm run lint` - Run ESLint
