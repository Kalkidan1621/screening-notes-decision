# Screening Notes + Decision

A full-stack feature that allows recruiters to record and manage candidate screening decisions.

## Overview

The Screening Notes + Decision feature allows a recruiter to:

- Add a screening note for a candidate
- Select a screening decision
- Save the decision and note
- View the saved decision after refreshing the page

Available decisions:

- Pass
- Hold
- Reject

The screening decision is associated with a dynamic `stageId` received from the URL.

---

## Project Structure

```text
apps/
├── front-end/
│   └── workspace/
│       └── src/
│           ├── routes/
│           │   └── screening.$stageId.tsx
│           ├── services/
│           │   └── screening.service.ts
│           ├── styles/
│           │   └── screening.css
│           └── types/
│               └── screening.ts
│
└── back-end/
    └── workspace-api/
        └── src/
            ├── db/
            │   ├── index.ts
            │   └── schema.ts
            ├── routes/
            │   └── screening.ts
            ├── schemas/
            │   └── screening.ts
            ├── services/
            │   └── screening.ts
            └── server.ts
            

#Technologies
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


How It Works

The frontend receives the stageId dynamically from the URL.

For example:
  /screening/stage-123
The route provides:
  const { stageId } = Route.useParams();
  
The frontend then uses this ID when communicating with the backend.

Get a Decision

  GET /hiring/application/screening/:stageId/decision

  Example:

GET /hiring/application/screening/stage-123/decision

Save a Decision

POST /hiring/application/screening/:stageId/decision

Example request:

 {
  "decision": "pass",
  "note": "Candidate has strong React and TypeScript skills."
}

Allowed decision values:

pass
hold
reject

API Response

A successful response returns the saved screening decision:

{
  "data": {
    "decision": "pass",
    "note": "Candidate has strong React and TypeScript skills.",
    "updatedAt": "2026-07-24T10:00:00.000Z"
  }
}

If no decision exists for the requested stageId, the API returns:

{
  "data": null
}

Validation

The screening note is validated on the frontend before the request is sent to the backend.

The note:

  Must not be empty
  Must contain meaningful text
  Must not contain numbers only
  Must be at least 10 characters
  Must not exceed 1000 characters

The backend also validates the request using Zod.

Database

Screening decisions are stored in the screening_decisions table.

The table stores:
| Field       | Description                 |
| ----------- | --------------------------- |
| `id`        | Unique record identifier    |
| `stageId`   | ID of the screening stage   |
| `decision`  | `pass`, `hold`, or `reject` |
| `note`      | Recruiter's screening note  |
| `updatedAt` | Last update timestamp    
   |
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

Configure the PostgreSQL connection using the environment variables required by the backend database configuration.

Then run the database migrations:

pnpm db:migrate

Running the Application

Start the Backend

From the backend directory:

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

Testing

Open the screening page using a stage ID:

http://localhost:3001/screening/stage-123

Then:

1.Select a screening decision.
2.Enter a screening note.
3.Click Save Decision.
4.Refresh the page.
5.Verify that the saved decision and note are displayed.

Development Notes

The frontend uses a dynamic stageId from the route instead of a hardcoded test value.

Example:

const { stageId } = Route.useParams();

This allows the feature to work with different screening stages:

/screening/stage-123
/screening/stage-456
/screening/stage-789

Temporary ZIP files and other unnecessary binary files should not be committed to the repository.

License

This project is for educational and development purposes.
