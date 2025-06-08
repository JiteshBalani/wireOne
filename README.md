# FareLogic

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

> FareLogic is a configurable ride fare calculator built with the MERN stack. It allows business users to define and manage pricing rules based on distance, duration, waiting time, and ride day.

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Configuration](#configuration)

## 🔍 Overview

FareLogic is a full-stack ride fare management application that allows users to configure pricing logic for transportation services. It supports defining multiple fare rules and calculating trip charges based on ride parameters like kilometers traveled, duration, and day of the week.

This is a single-page application (SPA) with no authentication, making it ideal for prototyping or internal tools.

## 💻 Technologies Used

### Frontend
- **React.js** (with Vite)
- **Ant Design** for UI components
- **Redux Toolkit** for state management
- **Axios** for HTTP communication

### Backend
- **Express.js** REST API
- **MongoDB** as the database
- **Mongoose** for object modeling
- **CORS** and **dotenv** for configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended) Get it here: https://nodejs.org/en/download
- Git
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/JiteshBalani/wireone.git
cd wireone
```

2. Install dependencies in both 'client' and 'server' directories.
# Client
```bash
cd client
npm install
```

# Server
```bash
cd ../server
npm install
```
### Environment Setup

1. **Client Environment (.env file in `client` directory)**
```
VITE_BACKEND_URL='http://localhost:3000'
```
2. **Server Environment (.env file in `server` directory)**
```
FRONTEND_URL=http://localhost:5173
DB_URL=your-mongodb-database-url
PORT=3000
```
## ▶️ Running the Application

### Start Frontend Server
```bash
cd client
npm run dev
```
Frontend will be available at: `http://localhost:5173`

### Start Backend Server
```bash
cd server
npm run dev
```
Backend API will be available at: `http://localhost:3000`

## 📁 Project Structure

```
eCom/
├── client/           # Frontend React application
│   ├── public/
│   ├── src/
│   ├── .env          # Frontend environment variables
│   └── package.json
│
└── server/           # Backend Express application 
    ├── models/
    ├── routes/
    ├── utils/
    ├── .env          # Backend environment variables
    └── package.json
```
## ✨ Features

- Create, update, and delete pricing configurations
- Set pricing based on:
    1. Per km charges
    2. Per minute charges
    3. Waiting time charges
    4. Day-specific charges
- Calculate ride fare dynamically based on input parameters
- SPA with clean UI using Ant Design
- Backend built with RESTful principles

## ⚙️ Configuration

### MongoDB

1. Create a MongoDB database (Atlas or local)
2. Get your connection string
3. Add the connection string to the `DB_URL` in your server `.env` file

---

Developed by [Jitesh Balani](https://github.com/JiteshBalani)