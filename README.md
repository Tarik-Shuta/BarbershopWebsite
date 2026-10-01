# Urban Barbershop

A full-stack barbershop booking application built as a personal project to practice modern frontend and backend development.

The app allows customers to create an account, view available appointment times, book a barber and service, and track their bookings. Barbers have their own dashboard where they can review, accept, or decline appointment requests and manage their schedule.

## Features

- Responsive barbershop website
- Customer registration and login
- Appointment booking with available time slots
- Customer booking history and status tracking
- Barber dashboard for managing appointments
- Role-based access for customers and barbers
- Interactive Mapbox location section
- PostgreSQL database with Prisma ORM
- Backend validation and booking conflict protection

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Mapbox GL JS

**Backend**
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod

## Project Structure

```text
BarbershopWebsite/
├── frontend/   # React frontend
├── backend/    # Express API and Prisma database layer
└── README.md
```

## Running Locally

### Backend

```bash
cd backend
npm install
npm run db:generate
npm run db:deploy
npm run dev
```

Create a `.env` file with:

```env
DATABASE_URL=your_postgresql_connection_string
AUTH_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env.local` file with:

```env
VITE_API_URL=http://localhost:3000
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

## What I Practiced

This project gave me hands-on experience with building and connecting a complete web application, including responsive UI development, authentication, REST APIs, database design, role-based functionality, form validation, deployment configuration, and frontend/backend integration.
