# Simple Text Saver (Vite + React + Node)

## Run Dev Servers

- Backend:
  1. `cd backend`
  2. `npm install`
  3. `npm run dev`

- Frontend:
  1. `cd frontend`
  2. `npm install`
  3. `npm run dev`

The frontend dev server proxies `/api` to `http://localhost:3000`.

## API Endpoints

- `GET /api/texts` → list all texts
- `POST /api/texts` → create a new text `{ text: string }`
- `DELETE /api/texts/:id` → delete by id 