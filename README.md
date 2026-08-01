# Task API

A simple CRUD API for managing a to-do list, built with Node.js and Express.

## How to run

1. Clone this repo
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
4. Server runs at `http://localhost:3000`

## Endpoints

| Method | Path | Description |
|--------|------|--------------|
| GET | / | API info |
| GET | /health | Health check |
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get one task |
| POST | /tasks | Create a task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

## Optional extras

| Method | Path | Description |
|--------|------|--------------|
| GET | /tasks?done=true | Filter tasks by done status |
| GET | /tasks?search=milk | Search tasks by title |
| GET | /stats | Get task counts (total, done, open) |
| POST | /reset | Reset tasks to the original 3 |

## Example request

curl -i http://localhost:3000/tasks/1

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 40

{"id":1,"title":"Buy milk","done":false}

## Swagger UI

Interactive docs available at `http://localhost:3000/docs`

![Swagger UI screenshot](swagger-screenshot.png)

## Mortality experiment

When the server restarts, all tasks return to the original 3 seed tasks — anything created, updated, or deleted is lost. This happens because the task list lives only in the program's memory (a JavaScript array), which resets every time Node.js starts fresh; nothing was ever saved to disk.

## AI vs me

**My prompt:**
"Build a REST API in Node.js using Express, for managing a to-do list. Don't use a real database — just keep the tasks in memory in a JavaScript array while the server is running. I need 5 endpoints: one to get all tasks, one to get a single task by its id, one to create a new task, one to update a task, and one to delete a task. If someone tries to get, update, or delete a task that doesn't exist, the API should say so instead of pretending it worked. If someone tries to create a task without a title, it should also reject that and say what's wrong. Also add Swagger docs so I can test the API from a browser page."

**What the AI did well:**
It built all 5 endpoints correctly, validated missing titles with a 400, handled unknown ids with a 404, and added working Swagger docs at /docs — everything I explicitly asked for was delivered and works.

**What it got wrong or quietly decided on its own:**
- It started with an empty task list instead of the 3 seed tasks mine has, since I never said to pre-fill any.
- It named the status field `completed` instead of `done` — I never specified a field name.
- Its DELETE returns `200` with a JSON message body, instead of the more correct `204 No Content` with an empty body — I never specified a status code.
- Its error responses use `{"message": ...}` instead of `{"error": ...}`, and don't include the task id in the message, unlike mine.
- It doesn't reject a title that's just empty spaces (like `"   "`) — mine explicitly checks for that with `.trim()`, but I never mentioned that rule in my prompt.

**What my prompt forgot to specify:**
The exact status codes for each operation, the field name for the done/completed flag, whether to seed example data, and the exact shape of error messages. The AI made reasonable but different choices for all of these.

**One rematch:**
If I regenerated with an improved prompt, I'd add: "seed the array with 3 example tasks on startup, use a field called `done` (not `completed`), return `204` with no body on delete, and use `{"error": "..."}` for error responses including the task id." That single change would have closed most of the gaps.