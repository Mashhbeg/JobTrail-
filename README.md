# JobTrail – Job Application Tracker

JobTrail is a full-stack web application designed to help users organize, manage, and track their job applications throughout the recruitment process.

It provides a centralized platform to manage applications, monitor application progress, schedule interviews, maintain notes, and manage professional profile information.

## Key Features

### 1. Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing.
- Protected application routes.

### 2. Dashboard
- Overview of job applications.
- Application statistics.
- Weekly application activity.
- Recent applications.
- Upcoming interviews.

### 3. Application Management
- Create new job applications.
- View application details.
- Edit existing applications.
- Delete applications.
- Track application status.

### 4. Kanban Board
- Visual application management.
- Drag-and-drop status updates.
- Track applications across different recruitment stages.

### 5. Notes and History
- Maintain notes for applications.
- Track application status changes.
- View application history.

### 6. Interview Management
- Schedule interviews.
- Maintain interview details.
- Track interview progress.

### 7. User Profile
- Manage personal information.
- Add professional headline and summary.
- Maintain technical skills.
- Add education details.
- Add work experience.
- Maintain a master resume URL.
- Monitor profile completion percentage.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS, Material UI |
| Routing | React Router |
| State Management | Redux Toolkit |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcrypt / bcryptjs |
| Validation | Zod |
| Development | VS Code, Postman, Git, GitHub |

## Project Structure

```text
JobTrail/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── Pages/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── db.json
├── .gitignore
└── README.md
```

## Prerequisites

Before running the project, install:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Mashhbeg/JobTrail-.git
```

### 2. Navigate to the Project

```bash
cd JobTrail-
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

## Environment Configuration

Create a `.env` file inside the `server` directory.

Configure the following variables:

```env
PORT=5000
JWT_SECRET=your_secure_random_secret
CLIENT_ORIGIN=http://localhost:5173
AUTH_REQUIRED=true
MONGODB_URI=your_mongodb_connection_string
DB_TYPE=mongodb
```

**Important:** Replace the placeholder values with your actual configuration. Never upload your `.env` file, database credentials, or JWT secrets to GitHub.

## Running the Application

### Start the Backend

From the `server` directory:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API Overview

The backend exposes the following main API groups:

| API Endpoint | Purpose |
|---|---|
| `/health` | Backend health check |
| `/api/auth` | Registration, login and authentication |
| `/api/applications` | Job application management |
| `/api/profile` | User profile management |

Protected endpoints require a valid JWT Bearer token.

## Database

JobTrail uses MongoDB with Mongoose for data management.

The application stores user information, authentication details, job applications, application status history, notes, interview information, and professional profile details.

## Production Build

To generate the frontend production build:

```bash
cd client
npm run build
```

The generated production files are stored in:

```text
client/dist/
```

## Future Improvements

Potential enhancements include:

- Direct resume document uploads.
- Email notifications.
- Advanced application analytics.
- Additional reporting features.
- Production deployment and monitoring.

## Repository

GitHub: https://github.com/Mashhbeg/JobTrail-

## Author

**Mirza Mashhood Beg**

GitHub: https://github.com/Mashhbeg

---

JobTrail – Organize your job search. Track your progress. Move towards your career goals.