# AROD

## Overview
AROD is a web application built using React.js (initialized with Vite) for the frontend and Node.js with Express for the backend. It is designed to manage various operations efficiently, leveraging modern web development best practices.

## Features
- CRUD operations for managing users
- RESTful API integration with React.js frontend
- State management using React Hooks
- Secure API calls with Axios
- Database management using MongoDB Atlas

## Technologies Used
### Frontend:
- React.js (initialized with Vite)
- Bootstrap for responsive design
- Axios for API requests

### Backend:
- Node.js with Express
- MongoDB Atlas for database management

## Installation
### Prerequisites:
Ensure you have the following installed:
- Node.js & npm
- Git

### Setup Steps:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/medinaveen9/AROD.git
   cd AROD
2. **Backend Setup:**
   ```bash
   cd server
   npm install
   npm start
3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
4. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### API Endpoints:
- Users:
   - GET / - Retrieve all users
      ![All Users](client/src/assets/users.png)

   - POST /createUser - Create a new user
      ![New user](client/src/assets/new_user.png)

   - PUT /updateUser/:id - Update a user
      ![Update user](client/src/assets/update_user.png)

   - DELETE /deleteUser/:id - Delete a user
      ![Delete user](client/src/assets/delete_user.png)
   
   - Mongo db Snapshot
      ![Mongo users snapshot](client/src/assets/Mongo.png)
