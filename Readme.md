# 🚀 Void Walkers — Project Management App

A Jira-inspired, full-stack project management application built with **Laravel 12** and **React 19**, featuring workspaces, projects, Kanban boards, task assignments, and threaded comments.

---

## 📋 Brief Description

**Void Walkers** is a collaborative project management tool that lets teams organize work across multiple **Workspaces** → **Projects** → **Tasks**. Users can create or join workspaces via invite codes, manage projects with deadlines and process models, and track task progress on a drag-and-drop Kanban board with three columns: **Todo**, **In Progress**, and **Done**. Tasks support multi-user assignment and threaded comments for in-context collaboration.

---

## 🛠️ Technical Details

### Backend

| Technology | Version | Purpose |
|---|---|---|
| PHP | ^8.2 | Server-side language |
| Laravel | ^12.0 | Web framework |
| Inertia.js (Laravel adapter) | ^2.0 | Server-driven SPA routing |
| Laravel Fortify | ^1.30 | Authentication (login, register, 2FA columns) |
| Laravel Wayfinder | ^0.1.9 | Type-safe route generation |
| Ziggy | ^2.6 | Named Laravel routes in JS |
| SQLite | — | Default database (swap to MySQL/PgSQL via .env) |
| Pest | ^4.1 | Testing framework |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2 | UI library |
| TypeScript | ^5.7 | Type safety |
| Vite | ^7.0 | Build tool & dev server |
| Tailwind CSS | ^4.0 | Utility-first styling |
| Inertia.js (React adapter) | ^2.1 | SPA without a separate API |
| Redux Toolkit + React-Redux | ^2.11 / ^9.2 | Global state (search, etc.) |
| Zustand | ^5.0 | Lightweight local state |
| @dnd-kit | ^6.x / ^9.x / ^10.x | Drag-and-drop Kanban |
| MUI (Material UI) | ^7.3 | Component library (DataGrid, DatePickers, TreeView) |
| Radix UI | various | Accessible headless components |
| Framer Motion | ^12 | Animations |
| React Select | ^5 | Multi-select assignee picker |
| Lucide React + Heroicons + MUI Icons | — | Icon sets |
| Day.js | ^1.11 | Date utilities |

---

## 📸 Screenshots

### Login / Sign-Up
![Login page](./screenshots/Screenshot%202026-08-27%20011356.png)

### Workspace Dashboard
![Workspace dashboard showing all workspaces with owner, worker, and project counts](./screenshots/Screenshot%202026-08-27%20011423.png)

### Create Workspace
![Modal dialog for creating a new workspace with name and invite code fields](./screenshots/Screenshot%202026-08-27%20011438.png)

### Create Project
![Modal dialog for creating a new project with name, deadline, and process model fields](./screenshots/Screenshot%202026-08-27%20011501.png)

### Projects View (with Sidebar)
![Project card showing deadline, process model, and progress bar with collapsible workspace sidebar](./screenshots/Screenshot%202026-08-27%20011529.png)

### Add Task Modal
![New task form with name, deadline, assignee multi-select, and description fields](./screenshots/Screenshot%202026-08-27%20011552.png)

### Kanban Board
![Kanban board with Todo, In Progress, and Done columns and a task card](./screenshots/Screenshot%202026-08-27%20011623.png)

### Task Detail & Comments
![Task detail page showing description and comments thread with input field](./screenshots/Screenshot%202026-08-27%20011636.png)

---

## 🏗️ App Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                        │
│   React 19 + TypeScript  ←→  Inertia.js  ←→  Laravel 12    │
└──────────────────────┬──────────────────────────────────────┘
                       │  Inertia page props (server-rendered)
┌──────────────────────▼──────────────────────────────────────┐
│                    Laravel Backend                           │
│                                                             │
│  routes/web.php                                             │
│    ├── GET  /                  → SignUp/page (public)       │
│    ├── POST /register          → AuthController             │
│    ├── POST /login             → AuthController             │
│    └── (auth middleware)                                    │
│         ├── /workspace         → WorkspaceController        │
│         ├── /project           → ProjectController          │
│         ├── /task              → TaskController             │
│         ├── /comment           → CommentController          │
│         └── PATCH /task/{id}/status/{status}                │
│                                                             │
│  App\Models                                                 │
│    User ──< user_workspace >── Workspace ──< Project        │
│    User ──< user_task     >── Task ──< Comment              │
│    Project ──< Task                                         │
│                                                             │
│  Database: SQLite (default) / MySQL / PostgreSQL            │
└─────────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Frontend Structure                        │
│                                                             │
│  resources/js/                                              │
│    ├── pages/                                               │
│    │   ├── SignUp/        ← Login & Register                │
│    │   ├── Workspace/     ← Workspace list & management     │
│    │   ├── Projects/      ← Project list per workspace      │
│    │   ├── KanbanBoard/   ← Task board (dnd-kit)            │
│    │   ├── Comments/      ← Task detail & comments          │
│    │   └── settings/      ← User settings                  │
│    ├── components/        ← Shared UI components            │
│    ├── layouts/           ← App shell & nav layouts         │
│    ├── store/             ← Redux store                     │
│    ├── hooks/             ← Custom React hooks              │
│    ├── types/             ← TypeScript types                │
│    └── actions/           ← Server action helpers           │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

```
User ──────────── user_workspace ──────────── Workspace
 │                                                │
 │                                                │ hasMany
 └──── user_task ──── Task ◄──────────── Project
                        │
                        └──── Comment
```

---

## ⏭️ Where to Next

Planned improvements and features for future iterations:

- [ ] **Real-time updates** — WebSocket / Laravel Reverb for live Kanban changes across team members
- [ ] **File attachments** — Attach files to tasks (images, documents)
- [ ] **Notifications** — In-app and email notifications for task assignments and comments
- [ ] **Activity log** — Audit trail per project and workspace
- [ ] **Role-based access** — Admin, Member, and Viewer roles per workspace
- [ ] **Sprint / Board planning** — Sprints, backlogs, and velocity tracking
- [ ] **Project analytics** — Burndown charts, progress dashboards
- [ ] **Task editing** — Full edit support for tasks (currently create/delete only)
- [ ] **Mobile responsiveness** — Full mobile layout polish
- [ ] **OAuth login** — Google / GitHub social auth via Fortify Socialite

---

## ⚠️ Known Problems

| # | Problem | Impact |
|---|---|---|
| 1 | Task `update()` endpoint is commented out in `TaskController` | Tasks cannot be edited after creation |
| 2 | `statusupdate` returns no response body; Inertia relies on redirect for re-render | Kanban status may need a page refresh if Inertia does not patch state optimistically |
| 3 | Project progress calculation variable is named `$undone` despite counting done tasks | Minor naming confusion; logic is correct |
| 4 | `workspace.join` POST route declared before the resource group can cause 405 on some server configurations | Join workspace may silently fail |
| 5 | No server-side pagination on workspace/project listings | Performance degrades with large datasets |

## ✅ Solutions

| # | Solution |
|---|---|
| 1 | Uncomment and complete the `update()` method in `TaskController`, add a route for it, and add an edit form on the Kanban card |
| 2 | Use Inertia `router.patch()` with `preserveScroll` and update local state optimistically via Zustand or Redux on success |
| 3 | Rename `$undone` to `$done` in `Project::getprogress()` for clarity |
| 4 | Move `workspace.join` route declaration after the resource group, or use an explicit `Route::post` with a unique URI |
| 5 | Add Laravel pagination (`->paginate()`) to index methods and use Inertia pagination components on the frontend |

---

## ⚙️ Installation & Running

### Prerequisites

- **PHP** 8.2+
- **Composer** 2+
- **Node.js** 18+ & **npm** 9+
- **SQLite** (included with PHP) or MySQL/PostgreSQL

### 1. Clone the repository

```bash
git clone <repository-url>
cd jira
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` if you want to use MySQL or PostgreSQL instead of the default SQLite:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### 4. Database setup

```bash
# Create SQLite database file (SQLite only)
touch database/database.sqlite

# Run migrations
php artisan migrate
```

### 5. Run the application

**Option A — All-in-one (recommended):**

```bash
composer run dev
```

This concurrently starts:
- `php artisan serve` — Laravel dev server at http://localhost:8000
- `php artisan queue:listen` — Queue worker
- `npm run dev` — Vite HMR dev server

**Option B — Manual:**

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev

# Terminal 3 (optional)
php artisan queue:listen --tries=1
```

### 6. Full automated setup

```bash
composer run setup
```

Runs: `composer install` → copy `.env` → `key:generate` → `migrate` → `npm install` → `npm run build`

### 7. Production build

```bash
npm run build
php artisan optimize
```

---

## 🧪 Running Tests

```bash
composer run test
# or
php artisan test
```

---

## 📁 Project Structure

```
jira/
├── app/
│   ├── Actions/             # Business logic actions
│   ├── Http/
│   │   ├── Controllers/     # AuthController, WorkspaceController, ProjectController, TaskController, CommentController
│   │   ├── Middleware/
│   │   └── Requests/        # Form request validation
│   └── Models/              # User, Workspace, Project, Task, Comment
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
├── resources/
│   └── js/                  # React + TypeScript frontend
├── routes/
│   ├── web.php
│   └── settings.php
├── screenshots/             # UI screenshots
├── .env.example
├── composer.json
├── package.json
└── vite.config.ts
```
