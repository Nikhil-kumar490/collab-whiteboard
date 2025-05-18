# Collaborative Whiteboard — Docker Setup

## Run full stack (server + client + MongoDB)

`ash
docker-compose up --build
`

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Create a room

`ash
curl -X POST http://localhost:3001/api/rooms -H "Content-Type: application/json" -d '{"name":"My Room","createdBy":"nikhil"}'
`
