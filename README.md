
<<<<<<< HEAD
│       Business Logic         │
=======
A full-stack feature that allows recruiters to record, manage, and review candidate screening decisions.

---

## Overview

The Screening Notes + Decision feature is designed for the candidate screening process.

Recruiters can review a candidate and record a screening decision together with a screening note.

The available screening decisions are:

* Pass
* Hold
* Reject

Each screening decision is associated with a dynamic `stageId`.

The `stageId` is received from the route and is used to retrieve and save the screening decision for the correct screening stage.

---

## Features

* Dynamic `stageId` support
* Pass, Hold, and Reject screening decisions
* Screening note management
* Create and update screening decisions
* Frontend validation
* Backend validation using Zod
* PostgreSQL data persistence
* API error handling
* Persistent data after page refresh
* Responsive user interface

---

## Architecture

The application follows a frontend-backend architecture.

```text
┌──────────────────────────────┐
│      React Frontend          │
│      TypeScript              │
│      TanStack Router         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       API Service Layer      │
│       Fetch Requests         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Hono Backend           │
│       API Routes             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Zod Validation         │
│       Request Validation     │
>>>>>>> 15632de (update README.md)
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Service Layer          │
│       Business Logic         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Drizzle ORM            │
│       Database Queries       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       PostgreSQL             │
│       screening_decisions    │
└──────────────────────────────┘
<<<<<<< HEAD
Project Structure
=======
```

---

## Project Structure

```text
>>>>>>> 15632de (update README.md)
screening-notes-decision/
│
├── apps/
│   │
│   ├── front-end/
│   │   └── workspace/
│   │       │
│   │       └── src/
│   │           │
│   │           ├── routes/
│   │           │   └── screening.$stageId.tsx
│   │           │
│   │           ├── services/
│   │           │   └── screening.service.ts
│   │           │
│   │           ├── styles/
│   │           │   └── screening.css
│   │           │
│   │           └── types/
│   │               └── screening.ts
│   │
│   └── back-end/
│       └── workspace-api/
│           │
│           └── src/
│               │
│               ├── db/
│               │   ├── index.ts
│               │   └── schema.ts
│               │
│               ├── routes/
│               │   └── screening.ts
│               │
│               ├── schemas/
│               │   └── screening.ts
│               │
│               ├── services/
│               │   └── screening.ts
│               │
│               └── server.ts
│
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
<<<<<<< HEAD
Technologies
Frontend
React
TypeScript
TanStack Router
CSS
Backend
Hono
TypeScript
Drizzle ORM
PostgreSQL
Zod
Package Manager
pnpm
How the Feature Works

The frontend receives the stageId dynamically from the URL.

Example:

/screening/stage-123

The route provides the stageId:

const { stageId } = Route.useParams();
=======
```

---

## Technologies

### Frontend

* React
* TypeScript
* TanStack Router
* CSS

### Backend

* Hono
* TypeScript
* Drizzle ORM
* PostgreSQL
* Zod

### Package Manager

* pnpm

---

## How the Feature Works

The frontend receives the `stageId` dynamically from the URL.

Example:

```text
/screening/stage-123
```

The route provides the `stageId`:

```tsx
const { stageId } = Route.useParams();
```
>>>>>>> 15632de (update README.md)

The frontend then uses this dynamic ID when communicating with the backend.

The feature does not use a hardcoded test ID such as:

<<<<<<< HEAD
getScreeningDecision("test");

Instead, the ID comes from the current screening route.

Data Flow
=======
```tsx
getScreeningDecision("test");
```

Instead, the ID comes from the current screening route.

---

## Data Flow

```text
>>>>>>> 15632de (update README.md)
User opens screening page
          │
          ▼
Dynamic stageId from URL
          │
          ▼
Frontend requests existing decision
          │
          ▼
Recruiter selects decision
          │
          ▼
Recruiter enters screening note
          │
          ▼
Frontend validation
          │
          ▼
POST request to backend
          │
          ▼
Backend validates request
          │
          ▼
Create or update database record
          │
          ▼
Return saved decision
          │
          ▼
Display updated data
<<<<<<< HEAD
API Documentation
Get Screening Decision
GET /hiring/application/screening/:stageId/decision

Example:

GET /hiring/application/screening/stage-123/decision
Successful Response
=======
```

---

## API Documentation

### Get Screening Decision

```http
GET /hiring/application/screening/:stageId/decision
```

Example:

```http
GET /hiring/application/screening/stage-123/decision
```

### Successful Response

```json
>>>>>>> 15632de (update README.md)
{
  "data": {
    "decision": "pass",
    "note": "Candidate has strong React and TypeScript skills.",
    "updatedAt": "2026-07-24T10:00:00.000Z"
  }
}
<<<<<<< HEAD
Empty Response

If no decision exists for the specified stageId:

{
  "data": null
}
Save Screening Decision
POST /hiring/application/screening/:stageId/decision

Example:

POST /hiring/application/screening/stage-123/decision
Request Body
=======
```

### Empty Response

If no decision exists for the specified `stageId`:

```json
{
  "data": null
}
```

### Save Screening Decision

```http
POST /hiring/application/screening/:stageId/decision
```

Example:

```http
POST /hiring/application/screening/stage-123/decision
```

### Request Body

```json
>>>>>>> 15632de (update README.md)
{
  "decision": "pass",
  "note": "Candidate has strong React and TypeScript skills."
}
<<<<<<< HEAD
Allowed Decisions
pass
hold
reject
Validation
=======
```

### Allowed Decisions

```text
pass
hold
reject
```

---

## Validation
>>>>>>> 15632de (update README.md)

The screening note is validated on both the frontend and backend.

The note:

<<<<<<< HEAD
Must not be empty
Must contain meaningful text
Must not contain numbers only
Must be at least 10 characters
Must not exceed 1000 characters

The backend also validates the request using Zod before saving data.

Database

Screening decisions are stored in the screening_decisions table.

Field	Description
id	Unique record identifier
stageId	Identifier of the screening stage
decision	pass, hold, or reject
note	Recruiter's screening note
updatedAt	Last update timestamp
Database Operations

When a screening decision is saved:

The backend receives the stageId.
The backend checks whether a decision already exists.
If a decision exists, it is updated.
If no decision exists, a new record is created.
The saved record is returned to the frontend.
Error Handling

The application handles:

Network errors
Failed API requests
HTTP errors
Backend validation errors
Invalid request data
Database request failures

The frontend displays meaningful error messages when a request fails.

Setup
Prerequisites

Make sure the following are installed:

Node.js
pnpm
PostgreSQL
Install Dependencies

From the project root:

pnpm install
Configure the Database
=======
* Must not be empty
* Must contain meaningful text
* Must not contain numbers only
* Must be at least 7 characters
* Must not exceed 1000 characters

Example of an invalid note:

```text
123456789
```

Example of a valid note:

```text
Candidate has strong React and TypeScript skills.
```

The backend also validates the request using Zod before saving data.

---

## Database

Screening decisions are stored in the `screening_decisions` table.

| Field       | Description                       |
| ----------- | --------------------------------- |
| `id`        | Unique record identifier          |
| `stageId`   | Identifier of the screening stage |
| `decision`  | `pass`, `hold`, or `reject`       |
| `note`      | Recruiter's screening note        |
| `updatedAt` | Last update timestamp             |

The screening decision is associated with a screening stage through the `stageId`.

---

## Database Operations

When a screening decision is saved:

1. The backend receives the `stageId`.
2. The backend checks whether a decision already exists.
3. If a decision exists, it is updated.
4. If no decision exists, a new record is created.
5. The saved record is returned to the frontend.

---

## Error Handling

The application handles:

* Network errors
* Failed API requests
* HTTP errors
* Backend validation errors
* Invalid request data
* Database request failures

The frontend displays meaningful error messages when a request fails.

---

## Setup

### Prerequisites

Make sure the following are installed:

* Node.js
* pnpm
* PostgreSQL

### Install Dependencies

From the project root:

```bash
pnpm install
```

### Configure the Database
>>>>>>> 15632de (update README.md)

Configure the PostgreSQL connection using the environment variables required by the backend database configuration.

Example:

<<<<<<< HEAD
DATABASE_URL=your_database_connection_string

Do not commit .env files or sensitive database credentials to the repository.

Run Database Migrations

From the backend project directory:

pnpm db:migrate
Running the Application
Start the Backend
cd apps/back-end/workspace-api
pnpm dev

The backend runs on:

http://localhost:3000
Start the Frontend

In a separate terminal:

cd apps/front-end/workspace
pnpm dev

The frontend runs on:

http://localhost:3001
Testing the Feature

Open the screening page:

http://localhost:3001/screening/stage-123

Then:

Select a screening decision.
Enter a screening note.
Click Save Decision.
Verify the success message.
Refresh the page.
Confirm that the saved decision and note are still displayed.
Development Workflow
Update the feature code.
Start the backend server.
Start the frontend server.
Test the screening workflow.
Verify frontend validation.
Verify API responses.
Verify database persistence.
Run git status.
Stage the changes.
Commit the changes.
Push the changes to the repository.
Repository Guidelines

The repository should not contain unnecessary generated or binary files.

Sensitive files such as .env should not be committed.

Temporary files such as ZIP archives and build output should also be excluded from version control.

License

This project is for educational and development purposes.
=======
```env
DATABASE_URL=your_database_connection_string
```

Do not commit `.env` files or sensitive database credentials to the repository.

### Run Database Migrations

From the backend project directory:

```bash
pnpm db:migrate
```

---

## Running the Application

### Start the Backend

Open a terminal and navigate to:

```bash
cd apps/back-end/workspace-api
```

Start the backend development server:

```bash
pnpm dev
```

The backend runs on:

```text
http://localhost:3000
```

### Start the Frontend

Open another terminal and navigate to:

```bash
cd apps/front-end/workspace
```

Start the frontend development server:

```bash
pnpm dev
```

The frontend runs on:

```text
http://localhost:3001
```

---

## Testing the Feature

Open the screening page:

```text
http://localhost:3001/screening/stage-123
```

Then:

1. Select a screening decision.
2. Enter a screening note.
3. Click **Save Decision**.
4. Verify the success message.
5. Refresh the page.
6. Confirm that the saved decision and note are still displayed.

---

## Development Workflow

A typical development workflow is:

1. Update the feature code.
2. Start the backend server.
3. Start the frontend server.
4. Test the screening workflow.
5. Verify frontend validation.
6. Verify API responses.
7. Verify database persistence.
8. Run:

```bash
git status
```

9. Stage the changes:

```bash
git add .
```

10. Commit the changes:

```bash
git commit -m "update screening feature"
```

11. Push the changes:

```bash
git push origin main
```

---

## Repository Guidelines

The repository should not contain unnecessary generated or binary files.

For example:

```text
*.zip
```

is ignored to prevent ZIP files from being accidentally committed.

Sensitive files such as `.env` should also not be committed.

---

## License

This project is for educational and development purposes.
>>>>>>> 15632de (update README.md)
