# LINKVERSE AI Coding Instructions

**Real-time messaging app** with React (Vite) frontend and Express backend. Uses Zustand for state management, Prisma for database, and integrates Resend (email), Cloudinary (images), and Arcjet (security).

## Architecture Overview

- **Frontend** (`FRONTEND/`): React 19 + Vite with Zustand stores, Tailwind CSS, React Router
- **Backend** (`BACKEND/`): Express with Prisma ORM, PostgreSQL (Supabase), async email/image handling
- **Database**: PostgreSQL via Supabase (pooled & direct connections in `.env`)
- **Key integrations**: Resend (welcome emails), Cloudinary (profile pics/message images), Arcjet (rate limiting + bot detection)

## Critical Developer Workflows

### Setup & Running
```bash
# Backend only
cd BACKEND && npm install && npm run dev

# Frontend only  
cd FRONTEND && npm run dev

# Full build (root)
npm run build
```

### Prisma Migrations
- **After schema.prisma changes**: `npx prisma migrate dev --name describe_change` (generates migration, updates client, seeds DB)
- **After merging from main**: `npx prisma generate` (syncs generated client)
- Always run from `BACKEND/` directory; uses `DATABASE_URL` for migrations, `DIRECT_URL` for local dev

### Database Inspection
```bash
cd BACKEND && npx prisma studio  # Web UI to browse/edit User, Message tables
```

## Project-Specific Patterns

### State Management (Zustand)
- Store per domain: `useAuthStore` (login, signup, logout, checkAuth) + `useChatStore` (contacts, messages, UI state)
- **ISSUE**: `useChatStore` exports wrong name (`useAuthStore` instead of `useChatStore`); uses `localStorage.setitem` (lowercase, should be `setItem`)
- **Pattern**: Zustand state functions should NOT be in dependency arrays (they change on each render); use `[]` or `[initialCheck]` flag instead
- Example: `useEffect(() => { checkAuth(); }, [])` NOT `[checkAuth]`

### Backend Route Middleware Order
- **Arcjet first, then auth**: routes apply `arcjetProtection` before `protectRoute` (see `message.route.js`)
- Rate limiting blocks requests early, saving DB queries on unauthenticated spam
- Protected routes: `/messages/*` routes require JWT cookie; `/auth/check` validates token and attaches `req.user`

### Async Operations (Performance)
- **Email on signup**: Uses `setImmediate` (fire-and-forget) so welcome email doesn't block response
- **Image uploads**: Cloudinary uploads run async; avoid awaiting in critical paths
- Message creation happens first (for instant response), image upload in background updates the record

### Error Handling Pattern
```javascript
// Backend controllers
try {
  // validation → DB operation → response
} catch (err) {
  console.error('Context:', err);
  return res.status(500).json({ message: 'Server Error' });
}

// Frontend stores
catch (err) {
  const msg = err.response?.data?.message || 'Operation failed';
  toast.error(msg);
  console.error('Context:', err);
}
```

### Authentication Flow
1. Signup: hash password (bcryptjs) → create user → generate JWT cookie → send welcome email async
2. Login: find user → compare password → generate JWT cookie
3. Protected routes: verify JWT from `req.cookies.jwt` → attach user to `req.user` → proceed
4. Logout: clear cookie (maxAge: 0)

## Integration Points & External Dependencies

| Service | Purpose | Config | Async |
|---------|---------|--------|-------|
| **Resend** | Welcome email | `.env`: `RESEND_API_KEY`, `EMAIL_FROM` | Yes (fire-and-forget) |
| **Cloudinary** | Profile pics, message images | `.env`: `CLOUDINARY_*` (3 vars) | Yes (background upload) |
| **Arcjet** | Rate limiting + bot detection | `.env`: `ARCJET_KEY`, `ARCJET_ENV` | Middleware blocks at ~100 req/60sec |
| **PostgreSQL** | User, Message tables | Supabase pooled + direct URLs | Prisma queries |

### Message Model Relations
```prisma
Message {
  senderId → User (sender)
  receiverId → User (receiver)
  text, image (optional)
  timestamps
}
```
Query pattern: find messages where `senderId=me AND receiverId=other` OR `senderId=other AND receiverId=me`

## Common Fixes & Known Issues

1. **useChatStore export bug**: Exports `useAuthStore` instead of `useChatStore`; has `localStorage.setitem` (not `setItem`); `toggleSound()` incomplete
2. **useEffect dependency warning**: `useAuthStore().checkAuth` changes per render; fix: `useEffect(() => { checkAuth(); }, [])`
3. **Image upload delays**: `sendMessage` now awaits Cloudinary; consider background queue for scale
4. **Missing null checks**: Always validate `req.body` fields before destructuring; use optional chaining in error handlers
5. **Type mismatch**: `req.params.id` is string; convert to `Number()` before Prisma queries

## File Organization
- `src/store/`: Zustand stores (state, async actions)
- `src/pages/`: Route components (LoginPage, SignUpPage, ChatPage)
- `src/components/`: Reusable UI (BorderAnimatedContainer, PageLoader)
- `src/lib/`: Utilities & configs (axios, env)
- `BACKEND/src/controllers/`: Request handlers (auth, messages)
- `BACKEND/src/middleware/`: Auth validation, Arcjet protection
- `BACKEND/src/lib/`: External clients (db, resend, cloudinary, arcjet)
- `BACKEND/prisma/`: Schema, migrations

## CSS & Styling
- **Tailwind** with custom utilities in `src/index.css` (`.input`, `.auth-btn`, `.auth-badge`, `.auth-link`)
- **DaisyUI** plugin for component presets
- **Border animation**: CSS `@property` for rotating gradient border (see `BorderAnimatedContainer`)

## Quick Debugging
- **Backend won't start**: Check `DIRECT_URL` env var for Prisma; run `npx prisma generate`
- **Frontend shows "All fields are required"**: `req.body` empty; ensure `Content-Type: application/json` in requests
- **No autocomplete on Zustand state**: Restart TS server (Cmd+Shift+P → "TypeScript: Restart TS Server")
- **Message images not uploading**: Check Cloudinary credentials; uploads are async, so images may appear later
