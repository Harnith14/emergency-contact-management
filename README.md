# Emergency Contact Management System

A web-based application to manage emergency contacts easily and quickly.

## Features

- Add new emergency contacts
- Edit existing contact details
- Delete contacts with confirmation
- Search contacts
- Dashboard with contact statistics
- Call contacts directly from the application
- SOS emergency call option (112)
- Store contacts in MongoDB

## Technologies Used

**Frontend**
- React.js
- HTML
- CSS
- Vite

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
emergency-contact-system/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── index.html
├── server/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Harnith14/emergency-contact-management.git
cd emergency-contact-management
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal in the project root and run:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder. Add your own MongoDB connection string and a strong JWT secret:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
```

Never upload your real `.env` file or credentials to GitHub.

### 5. Start the backend

From the `server` folder, run:

```bash
node server.js
```

### 6. Start the frontend

From the `frontend` folder, run:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Purpose

This project demonstrates contact management, REST API integration, database storage, and a responsive web interface.

## Author

**Harnith14**

## Repository

https://github.com/Harnith14/emergency-contact-management