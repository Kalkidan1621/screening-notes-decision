
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
Project Structure
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

The frontend then uses this dynamic ID when communicating with the backend.

The feature does not use a hardcoded test ID such as:

getScreeningDecision("test");

Instead, the ID comes from the current screening route.

Data Flow
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
API Documentation
Get Screening Decision
GET /hiring/application/screening/:stageId/decision

Example:

GET /hiring/application/screening/stage-123/decision
Successful Response
{
  "data": {
    "decision": "pass",
    "note": "Candidate has strong React and TypeScript skills.",
    "updatedAt": "2026-07-24T10:00:00.000Z"
  }
}
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
{
  "decision": "pass",
  "note": "Candidate has strong React and TypeScript skills."
}
Allowed Decisions
pass
hold
reject
Validation

The screening note is validated on both the frontend and backend.

The note:

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

Configure the PostgreSQL connection using the environment variables required by the backend database configuration.

Example:

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