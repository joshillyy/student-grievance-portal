# 🎓 Student Grievance Redressal Portal

A full-stack web application that enables students to submit and track grievances online while allowing administrators to review complaints, update their status, and provide remarks.

The portal aims to make the grievance redressal process more accessible, organized, transparent, and efficient within an educational institution.

## 🌐 Live Demo

- **Frontend:** [Open Student Grievance Portal](https://jocular-fairy-e97e6c.netlify.app)
- **Backend API:** https://student-grievance-portal-api.onrender.com
- **GitHub Repository:** [View Source Code](https://github.com/joshillyy/student-grievance-portal)

> Replace `YOUR_NETLIFY_URL` and `YOUR_GITHUB_REPOSITORY_URL` with your actual URLs.

## ✨ Features

### 👨‍🎓 Student Module
- Student registration and login.
- Secure password hashing.
- Authentication using JSON Web Tokens (JWT).
- Submit grievances with category, subject, description, and priority.
- Receive a unique grievance reference ID.
- View previously submitted grievances.
- Track grievance status and updates.
- View recent grievances on the dashboard.

### 🛡️ Admin Module
- Secure administrator authentication.
- View grievances submitted by students.
- Access student details associated with grievances.
- Update grievance status.
- Add administrative remarks.
- Monitor grievance progress.

### ⚙️ General Features
- Responsive web interface.
- RESTful API architecture.
- MongoDB database integration.
- Protected routes based on authentication and user roles.
- Cloud deployment for online access.

## 🛠️ Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| API Communication | Fetch API, REST API |
| Frontend Hosting | Netlify |
| Backend Hosting | Render |
| Database Hosting | MongoDB Atlas |
| Version Control | Git and GitHub |

## 🏗️ Project Architecture

```text
Student Grievance Redressal Portal
             |
             v
    React + Vite Frontend
       (Netlify)
             |
             v
    Express REST API
        (Render)
             |
             v
      MongoDB Atlas
```

The frontend communicates with the Express backend through REST API endpoints. The backend validates requests, handles authentication and business logic, and interacts with MongoDB to store and retrieve data.

## 📁 Project Structure

```text
student-grievance-portal/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── api.js
│   │   └── App.css
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Grievance.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── grievances.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   └── package.json
│
├── netlify.toml
├── .gitignore
└── README.md
```

*The structure above reflects the main project files; additional files may exist in your repository.*

## 💻 Run the Project Locally

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas account.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd student-grievance-portal
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Set the following environment variables in your terminal before starting the backend:

- `MONGO_URI` — your MongoDB connection string.
- `JWT_SECRET` — a strong, randomly generated secret.

For a local MongoDB installation, the connection string can be:

```text
mongodb://127.0.0.1:27017/student_grievance_portal
```

**Windows PowerShell example:**

```powershell
$env:MONGO_URI = "mongodb://127.0.0.1:27017/student_grievance_portal"
$env:JWT_SECRET = "replace-with-a-strong-random-secret"
npm start
```

The backend should start on port `5000` by default.

### 3. Configure the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
```

The frontend API configuration supports an environment variable named `VITE_API_BASE_URL`.

For local development, the application falls back to:

```text
http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `PORT` | Backend port; defaults to `5000` |
| `VITE_API_BASE_URL` | Frontend API base URL, including `/api` |

Never commit real database credentials, JWT secrets, or other sensitive information to GitHub.

## 🚀 Deployment

### Frontend — Netlify

1. Connect the GitHub repository to Netlify.
2. Configure the base directory as `frontend`.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.
5. Configure `VITE_API_BASE_URL` as your deployed Render API URL followed by `/api`.
6. Deploy the site.

### Backend — Render

1. Connect the GitHub repository to Render.
2. Select a Node.js Web Service.
3. Set the root directory to `backend`.
4. Set the build command to `npm install`.
5. Set the start command to `npm start`.
6. Add `MONGO_URI` and `JWT_SECRET` under the service's environment variables.
7. Deploy the service.

### Database — MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with a strong password.
3. Configure network access for the backend service.
4. Add the Atlas connection string as `MONGO_URI` in Render.

Keep database credentials private. Restrict database network access wherever practical.

## 🔗 API Endpoints

The following endpoints are implemented in the backend:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a student |
| `POST` | `/api/auth/login` | Authenticate a user |
| `POST` | `/api/grievances` | Submit a grievance |
| `GET` | `/api/grievances/my` | Retrieve the logged-in student's grievances |
| `GET` | `/api/grievances` | Retrieve all grievances for an administrator |
| `PATCH` | `/api/grievances/:id/status` | Update grievance status and remarks |

Protected endpoints require authentication. Administrative endpoints additionally require the appropriate administrator role.

## 🔄 Grievance Statuses

Grievances can move through the following statuses:

- **Submitted** — The grievance has been received.
- **In Progress** — The grievance is being addressed.
- **Resolved** — The grievance has been resolved.
- **Rejected** — The grievance has been rejected.

## 🔒 Security Considerations

- Passwords are hashed using bcryptjs.
- JWTs are used for authentication.
- Protected API routes verify authentication and authorization.
- Environment variables are used for sensitive configuration.
- Database access should be restricted and credentials kept private.
- Production deployments should use HTTPS and strong administrator credentials.

## 🔮 Future Enhancements

- Email and in-app notifications.
- File attachments and supporting evidence.
- Grievance search, filtering, and pagination.
- Analytics and reports for administrators.
- Role-based dashboards for different institutional departments.
- Grievance feedback and satisfaction ratings.
- Audit logs for administrative actions.

## 🎯 Project Objective

The main objective of this project is to provide an accessible digital platform for students to report institutional issues and track their resolution, while helping administrators manage grievances efficiently.

## 👩‍💻 Author

**Student Grievance Redressal Portal**

Developed as an academic full-stack web development project using React, Node.js, Express.js, and MongoDB.

## 📄 License

This project is developed for educational purposes. A formal open-source license can be added if the project is intended for public reuse.
