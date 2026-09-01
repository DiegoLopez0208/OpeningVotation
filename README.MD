# Opening Votation

A web app for voting on anime openings. Each opening is stored with the timestamps that
matter — where it starts and where the chorus drops — so playback can jump straight to the
part people actually vote on.

![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

---

## Data model

```
Opening   title, url, start, chorus, alphabeticalOrder
User      registration and login (bcrypt-hashed passwords)
Vote      links a user to an opening
```

The API is split into four handlers: `openings`, `users`, `votes` and `admin`.

## Stack

| Side | Stack |
|------|-------|
| Frontend | Next.js 15 (Turbopack), React 18, TypeScript, Tailwind CSS, MUI 6, Emotion, GSAP, react-icons |
| Backend | Express 4, Mongoose 8 (MongoDB), bcrypt, cors, dotenv |
| Dev | `concurrently` runs both apps from the repository root |

## Getting started

```bash
npm install

# both apps at once, from the root
npm run dev

# or separately
npm run dev:backend
npm run dev:frontend
```

The backend expects a `.env` with the MongoDB connection string.

## Layout

```
frontend-animation-votation/    Next.js 15 app (App Router)
backend-animation-votation/
  index.js                      Express entry point
  handler/                      adminHandler, openingsHandler, usersHandler, votesHandler
  schemas/                      openingSchema, userSchema, voteSchema
```
