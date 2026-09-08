# Bug Tracker Mobile App

A full-stack bug/issue tracker: React Native (Expo) mobile client backed by an
Express + MongoDB REST API, with JWT auth, project/issue relationships,
comments, full issue history, screenshot uploads, and server-side search/filtering.

```
React Native (Expo) → REST API → Express/Node.js → MongoDB Atlas
                                        │
                                   Cloudinary (images)
```

## Features

- Email/password auth with JWT (bcrypt-hashed passwords)
- Projects with an owner + members list, member management
- Issues with priority (`low`/`medium`/`high`/`critical`) and status
  (`open`/`in_progress`/`resolved`/`closed`/`reopened`)
- Threaded comments per issue
- Full issue history/audit log (status, priority, assignee, title, description changes)
- Screenshot uploads (multipart → Cloudinary → URL stored in MongoDB)
- Server-side search, filtering (project/status/priority/assignee), and pagination
- Loading / empty / error states throughout the mobile UI

## Tech Stack

**Mobile:** Expo, React Native, TypeScript, React Navigation, Axios,
TanStack Query, React Hook Form-ready structure, Expo SecureStore, Expo Image Picker

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, Multer +
Cloudinary, express-validator, helmet, express-rate-limit

## Project Structure

```
bug-tracker-app/
├── mobile/     # Expo React Native app
└── backend/    # Express REST API
```

See inline comments and the route files for full API surface.

## Prerequisites

- Node.js 18+
- A MongoDB connection string (MongoDB Atlas free tier works well)
- A Cloudinary account (free tier) for screenshot uploads
- Expo Go app on your phone, or an iOS/Android simulator, for running the mobile app

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, CLOUDINARY_* values
npm run dev
```

The API starts on `http://localhost:5000` by default. Check `http://localhost:5000/health`.

### Mobile

```bash
cd mobile
npm install
```

Create a `.env` (or use `app.json`/`eas.json` extra config) with:

```
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000/api
```

Use your machine's LAN IP (not `localhost`) if testing on a physical device via
Expo Go, since the phone can't resolve your laptop's `localhost`.

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `i` / `a`
to launch a simulator.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for screenshot uploads |
| `CORS_ORIGIN` | Allowed origin(s), comma-separated, or `*` |

### Mobile

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL of the backend API, e.g. `https://your-api.onrender.com/api` |

## API Documentation

Base path: `/api`

### Auth
```
POST /auth/signup        { name, email, password }
POST /auth/login         { email, password }
GET  /auth/me            (auth required)
```

### Projects
```
GET    /projects
POST   /projects                       { name, description }
GET    /projects/:id
PUT    /projects/:id                   (owner only)
DELETE /projects/:id                   (owner only)
GET    /projects/:id/members
POST   /projects/:id/members           { userId }  (owner only)
DELETE /projects/:id/members/:userId   (owner only)
```

### Issues
```
GET    /issues?project=&status=&priority=&assignedTo=&search=&page=&limit=
POST   /issues                         { project, title, description, priority?, assignedTo? }
GET    /issues/:id
PUT    /issues/:id
DELETE /issues/:id
PATCH  /issues/:id/status              { status }
PATCH  /issues/:id/priority            { priority }
PATCH  /issues/:id/assign              { assignedTo }
GET    /issues/:id/history
POST   /issues/:id/screenshots         multipart/form-data, field name "screenshots"
```

### Comments
```
GET    /issues/:id/comments
POST   /issues/:id/comments            { text }
PUT    /comments/:id                   (author only)
DELETE /comments/:id                   (author only)
```

### Users
```
GET /users?search=       (name/email search, used for adding project members)
GET /users/:id
PUT /users/me            { name?, avatar? }
```

All routes except `/auth/signup` and `/auth/login` require:
```
Authorization: Bearer <JWT_TOKEN>
```

## Authentication

Signup and login return a JWT. The mobile app stores it in Expo SecureStore and
attaches it as a Bearer token on every request via an Axios interceptor
(`mobile/src/services/api/client.ts`).

## Database Schema

- **User** — name, email (unique), hashed password, avatar
- **Project** — name, description, owner (User ref), members (User refs)
- **Issue** — project ref, title, description, screenshots[], priority enum,
  status enum, createdBy ref, assignedTo ref
- **Comment** — issue ref, user ref, text
- **IssueHistory** — issue ref, user ref, action enum, oldValue, newValue

Comments and history are separate collections (not embedded) so issue documents
stay small and history reads/writes don't require rewriting the whole issue.

## Image Upload

Screenshots are sent from the mobile app as `multipart/form-data`, handled by
Multer with `multer-storage-cloudinary`, and stored in Cloudinary. Only the
resulting URL is saved on the Issue document — no binary data touches MongoDB.

## Permissions

- **Project owner**: edit/delete project, assign members to the team (add/remove/change role)
- **Project manager** (a member promoted by the owner): open/close issues (change status), assign issues to team members
- **Project member**: view issues, create issues, comment, update priority — cannot change issue status or assignment
- **Comment author**: edit/delete their own comments only

> **Upgrading an existing database?** The `members` field on `Project`
> changed shape from a flat list of user ids to `{ user, role }` entries.
> Run the one-time migration before starting the API against an existing
> database, or you'll see `undefined` member data in the app:
> ```
> cd backend
> npm run migrate:members
> ```
> It's safe to run more than once — already-migrated projects are skipped.

## Deployment

1. Push `backend/` to a Node-friendly host (Render, Railway, Fly.io, etc.) with
   the environment variables above configured.
2. Point `EXPO_PUBLIC_API_URL` in the mobile app at the deployed API's `/api` path.
3. Build with `eas build` (or `expo run:android` / `expo run:ios` locally) once
   the API URL is production-ready.

**Production API:** _add your deployed URL here once live, e.g._
`https://your-api-url.onrender.com/api`

## Future Improvements

- Push notifications on assignment / comment
- Offline support / optimistic updates
- Role-based permissions beyond owner/member
- File attachments beyond images (logs, PDFs)
- Web dashboard alongside the mobile app
