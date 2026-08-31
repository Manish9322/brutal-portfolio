# BRUTALIST - Senior Portfolio

A raw, unapologetically modern brutalist portfolio for a high-end software engineer —
high contrast, thick borders, oversized typography. Built with **Next.js (App Router)**,
React 19, TypeScript, Tailwind CSS, MongoDB/Mongoose and RTK Query.

## Run locally

**Prerequisites:** Node.js 18.18+ and a MongoDB instance (local or Atlas)

1. Install dependencies:
   ```
   npm install
   ```
2. Create `.env` (see `.env.local.example`):
   ```
   MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/brutal_portfolio
   GEMINI_API_KEY=
   ```

   **Always end the URI with an explicit database name.** With no name the driver
   connects to `test`, and on a shared Atlas cluster that database may already
   contain another project's data — `projects`, `blogs`, `profiles` and `skills`
   are all names this app would claim and overwrite.
3. Start the dev server:
   ```
   npm run dev
   ```
4. Seed the database with the starter content (safe to re-run — it only fills
   empty collections):
   ```
   curl -X POST http://localhost:3001/api/seed
   ```
   Use `POST /api/seed?force=1` to wipe and re-seed everything.

The app runs on http://localhost:3001

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server on port 3001    |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | Next.js lint               |

## Structure

```
app/
  layout.tsx                 root layout; metadata is read from the SEO document
  page.tsx                   portfolio, composed from components/home
  not-found.tsx              404 view
  globals.css                Tailwind directives + brutalist base styles
  journal/                   blog index and /journal/[slug]
  admin/                     CMS, one route per section, gated by admin/layout.tsx
  api/<resource>/route.ts    REST endpoints (GET/POST/PUT/PATCH/DELETE)
components/
  home/                      portfolio sections + index.ts barrel
  journal/                   blog list and post views
  admin/                     admin shell and login
config/config.ts             environment variables
hooks/                       shared client hooks
lib/
  crud.ts                    handler factory shared by the API routes
  admin-auth.tsx             client-side admin session
  seed-data.ts               starter content
  utils.ts                   cn() helper
models/*.model.ts            Mongoose schemas
services/
  api.ts                     RTK Query endpoints (single createApi)
  geminiService.ts           client wrapper around /api/ai/manifesto
utils/
  db.ts                      Mongoose connection singleton
  store.ts                   Redux store
  providers.tsx              Redux + admin auth providers
```

## Projects

The homepage renders the first `HOMEPAGE_PROJECT_COUNT` projects (4) and links to
`/work` for the rest. Ordering is shared by both listings via `lib/projects.ts`:
`featured` first, then the manual `order` field.

Each project carries case-study content used only by `/work/<id>` —
`longDescription`, `challenges[]`, `solutions[]`, `screenshots[]`, `role`, `team`,
`timeline`, `githubUrl`, `liveUrl`. All of it is editable at `/admin/projects`.

## Image uploads

Admin image inputs upload straight to Cloudinary through `POST /api/upload`.
Assets are filed by the module that owns them, so the media library stays sorted:

```
brutal-portfolio/projects/              project cover images
brutal-portfolio/projects/screenshots/  case-study captures
brutal-portfolio/gallery/               behind-the-scenes frames
brutal-portfolio/blogs/                 post covers
brutal-portfolio/media/                 the media vault
brutal-portfolio/profile/               avatar and OG image
brutal-portfolio/misc/                  anything unmapped
```

| Piece | What it does |
| --- | --- |
| `lib/cloudinary.ts` | SDK config, the module -> folder map, upload/delete, URL -> publicId |
| `app/api/upload/route.ts` | `POST` a file, `DELETE` by `?publicId=` or `?url=` |
| `hooks/use-image-upload.ts` | Client hook: `uploadImage`, `deleteImage`, `isUploading`, `error` |
| `components/admin/ImageField.tsx` | Single image: drag-drop, browse, replace, remove, URL fallback |
| `components/admin/ImageListField.tsx` | Image arrays (project screenshots): add many, caption, reorder, replace, remove |

Uploads are capped at 10MB and rejected unless the MIME type is `image/*`.
Replacing or removing an image also deletes the old asset from Cloudinary — but
only when it lives under `brutal-portfolio/`, so images pasted in from elsewhere
are simply detached from the record.

Requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
in `.env`.

## Data layer

Every resource is a Mongoose model exposed through one REST route and consumed
in the browser through RTK Query (`services/api.ts`), which handles caching and
cache invalidation after mutations.

The nine collection routes share `lib/crud.ts`, so they all expose the same verbs:

| Verb     | Behaviour                                     |
| -------- | --------------------------------------------- |
| `GET`    | all documents, sorted by `order`               |
| `POST`   | create one (auto-assigns the next `order`)     |
| `PUT`    | update one by `_id` in the body                |
| `PATCH`  | reorder via `{ orderedIds: string[] }`         |
| `DELETE` | remove one by `?id=`                           |

`profile`, `about`, `seo` and `settings` are single-document resources and expose
only `GET` and `PUT`.

## Routes

| Path                | Description                              |
| ------------------- | ---------------------------------------- |
| `/`                 | portfolio (4 featured projects)           |
| `/work`             | every project, filterable by category     |
| `/work/<id>`        | project case study                        |
| `/journal`          | blog index                               |
| `/journal/<slug>`   | single post                              |
| `/admin`            | redirects to `/admin/dashboard`          |
| `/admin/<section>`  | CMS section (password: `admin123`)       |

The admin password comes from `ADMIN_PASSWORD` and is compared on the server
(`app/api/admin/login`), so it is never included in the client bundle. There is
no fallback: without that variable set, sign-in fails.

The session itself is still just a localStorage flag and the API routes are
unauthenticated, so this gates the UI only. Replace it with a real session
before putting this on a public host.
