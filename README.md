# DAYSCHOLAR OS

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

**DAYSCHOLAR OS** is a comprehensive, all-in-one platform built specifically to streamline the everyday life of day scholars and university students. The application centralizes essential services—from commuting to campus and finding off-campus housing, to trading study materials and discovering quality local meals.

## 🌟 Key Features

- **Commute Matchmaker**: Real-time coordination for students to carpool or travel together to and from campus. Powered by WebSockets for live matching.
- **Tiffin Services & Dashboard**: Discover and review local tiffin (meal) providers. Vendors can manage their offerings through a dedicated dashboard.
- **Housing Reviews**: Authentic peer reviews of off-campus accommodations, helping students make informed living decisions.
- **Peer-to-Peer Marketplace**: Buy, sell, or exchange study materials, furniture, and other essentials with fellow students.
- **Shadow Campus**: A dedicated space for academic resources and campus-specific utilities.
- **Admin Panel**: Centralized management interface for platform administrators.

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite** for blazing fast performance
- **Tailwind CSS 4** for modern, responsive styling
- **React Router** for seamless navigation
- **Socket.io-client** for real-time updates

### Backend
- **Node.js & Express.js** for robust API development
- **MongoDB** (with Mongoose) for flexible data storage
- **Socket.io** for real-time bidirectional event-based communication
- **JWT** (JSON Web Tokens) for secure authentication
- **Multer & Sharp** for optimized image and file uploads
- **Web Push** for browser push notifications

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BeastDiorite/DAYSCHOLAROS.git
   cd DAYSCHOLAROS
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   - Copy `.env.example` to `.env` and fill in your private credentials (MongoDB URI, JWT secret, etc.).
   - Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   # Open a new terminal window
   cd frontend
   npm install
   npm run dev
   ```

4. **Open the Application:**
   Visit `http://localhost:5173` (or the port specified by Vite) in your browser.

## 🔐 Security & Privacy
This repository is configured to ensure sensitive information remains private. The `.env` files are explicitly ignored in `.gitignore`, ensuring that API keys, database URIs, and JWT secrets are never committed to version control. 

## 📄 License
This project is licensed under the ISC License.
