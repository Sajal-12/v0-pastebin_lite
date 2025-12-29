# Pastebin Lite

A lightweight pastebin application for sharing text snippets with optional expiry and view limits.

## Features

- **Create Pastes**: Share text snippets with shareable URLs
- **Time-based Expiry**: Optional TTL (time-to-live) for automatic expiration
- **View Limits**: Optional max view count before paste becomes unavailable
- **Safe Rendering**: Content is safely rendered with XSS protection
- **Deterministic Testing**: Support for TEST_MODE for reliable automated testing

## Tech Stack

- **Frontend**: Next.js App Router, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Neon) for persistent paste storage
- **Cache/Session**: Upstash Redis for optional caching
- **Deployment**: Vercel

## Persistence Layer

This application uses **PostgreSQL via Neon** as the primary persistence layer. Pastes, their metadata (TTL, view counts), and constraints are stored in the database and survive across server restarts and deployments.

The database schema includes:
- `pastes` table with columns: `id`, `content`, `created_at`, `expires_at`, `max_views`, `view_count`
- Indexes for efficient lookups and expiry queries

## Local Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (or use Neon)
- Upstash Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pastebin-lite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
DATABASE_URL=postgresql://user:password@host:port/database
KV_URL=https://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
VERCEL_URL=localhost:3000
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns `{ "ok": true }` if the service is operational.

### Create Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "string",
  "ttl_seconds": 3600,        // optional
  "max_views": 5              // optional
}
```

Response (201):
```json
{
  "id": "abc123xyz",
  "url": "https://your-app.vercel.app/p/abc123xyz"
}
```

### Fetch Paste (API)
```
GET /api/pastes/:id
```

Response (200):
```json
{
  "content": "...",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

Returns 404 if paste is expired, view limit exceeded, or not found.

### View Paste (HTML)
```
GET /p/:id
```

Returns HTML page with the paste content. Returns 404 if paste is unavailable.

## Testing

The application supports deterministic time testing via the `TEST_MODE` environment variable:

```bash
TEST_MODE=1 npm run dev
```

When TEST_MODE is enabled, the `x-test-now-ms` header is used to set the current time for expiry logic:

```bash
curl -H "x-test-now-ms: 1672531200000" http://localhost:3000/api/pastes/abc123xyz
```

## Deployment

Deploy to Vercel with a single command:

```bash
vercel
```

Ensure all environment variables are set in your Vercel project:
- `DATABASE_URL` (Neon PostgreSQL connection string)
- `KV_REST_API_URL` (Upstash Redis REST API URL)
- `KV_REST_API_TOKEN` (Upstash Redis API token)

## Design Decisions

1. **PostgreSQL for Persistence**: Chosen for reliable, persistent storage of pastes and their metadata. Survives across Vercel deployments.

2. **Unique ID Generation**: Used nanoid for generating short, URL-safe paste IDs.

3. **View Count Tracking**: Stored in the database to ensure accuracy across requests.

4. **Content Sanitization**: HTML entities are escaped to prevent XSS attacks.

5. **Deterministic Testing**: Support for `x-test-now-ms` header enables reliable automated testing without flaky time-based tests.

6. **Efficient Expiry Checks**: Expiry is checked on-demand (not via background jobs) to keep the system simple and serverless-friendly.

## Error Handling

- Invalid input (missing content, invalid TTL/max_views) returns 400 Bad Request
- Expired or unavailable pastes return 404 Not Found
- Database errors return 500 Internal Server Error
- All error responses include JSON error messages

## License

MIT
