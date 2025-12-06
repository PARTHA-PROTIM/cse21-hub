# 🎓 CSE21 Hub - Smart Web Portal for CSE Students

A comprehensive web-based platform designed for Computer Science & Engineering students at Shahjalal University of Science & Technology (SUST) to manage academic activities, track performance, and stay connected.

![License](https://img.shields.io/badge/license-Educational-blue)
![Status](https://img.shields.io/badge/status-Active-success)

---

## 📋 Table of Contents
- [Project Information](#project-information)
- [Team Members](#team-members)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 📚 Project Information

**Course:** Web Technologies  
**Department:** Computer Science & Engineering (CSE)  
**Institution:** Shahjalal University of Science & Technology (SUST)  
**Academic Year:** 2024-2025  
**Instructor:** Md. Mehedi Hasan (Lecturer, Department of CSE, SUST)

---

## 👥 Team Members

| Name | Registration No. | Role | Contributions |
|------|-----------------|------|---------------|
| **Partha Protim Biswas** | 2021331015 | Backend Developer & Project Lead | Database design, API development, Authentication system |
| **Hridoy Kumar Biswas** | 2021331097 | Frontend Developer & UI/UX Designer | Interface design, Client-side logic, Responsive layouts |

---

## 🎯 Project Overview

CSE21 Hub is a centralized digital platform that addresses the challenges faced by CSE students at SUST. Currently, information about courses, marks, bus schedules, and events is scattered across multiple sources. Our solution consolidates everything into one unified, easy-to-use web portal.

### Problem Statement
- Students struggle to track academic performance across multiple courses
- No centralized system for departmental announcements and events
- Difficulty in accessing bus schedules and contest information
- Lack of platform for student collaboration and discussion

### Our Solution
A complete web portal with role-based access control, real-time updates, and comprehensive academic management features.

---

## ✨ Features

### 🎓 For Students:
- ✅ **Performance Tracking:** View marks and rankings in course-wise leaderboards
- ✅ **Course Management:** Access all enrolled courses and academic materials
- ✅ **Bus Schedules:** Check real-time campus bus timings and routes
- ✅ **Contest Alerts:** Get notifications about upcoming programming contests
- ✅ **News Feed:** Stay updated with departmental announcements and events
- ✅ **Group Chat:** Participate in real-time discussions with classmates
- ✅ **Profile Management:** View personal academic progress and statistics

### 👨‍🏫 For Class Representative (CR):
- ✅ **User Management:** Approve/reject student registration requests
- ✅ **Course Administration:** Create, update, and delete courses
- ✅ **Marks Entry:** Add and update student marks for all courses
- ✅ **Leaderboard Generation:** Automatic ranking based on performance
- ✅ **Schedule Management:** Manage bus schedules and timings
- ✅ **Event Posting:** Announce contests and important events
- ✅ **News Publishing:** Post departmental news and updates
- ✅ **User Control:** View and remove users (students can re-register)

---

## 🛠️ Technology Stack

### Frontend:
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Client-side logic and interactivity
- **Socket.io Client** - Real-time communication

### Backend:
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication

### Security & Authentication:
- **JWT (JSON Web Tokens)** - Secure authentication
- **bcrypt** - Password hashing and encryption
- **CORS** - Cross-Origin Resource Sharing

### Development Tools:
- **Git & GitHub** - Version control and collaboration
- **Nodemon** - Development server auto-restart
- **dotenv** - Environment variable management

---

## 📁 Project Structure
```
cse21-hub/
│
├── backend/                     
│   ├── config/                  
│   │   ├── db.js                
│   │   └── config.js            
│   │
│   ├── models/                  
│   │   ├── User.js              
│   │   ├── Course.js            
│   │   ├── Mark.js              
│   │   ├── BusSchedule.js       
│   │   ├── Contest.js         
│   │   ├── News.js              
│   │   ├── Message.js         
│   │   └── RegistrationRequest.js
│   │
│   ├── controllers/              
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── markController.js
│   │   ├── busController.js
│   │   ├── contestController.js
│   │   ├── newsController.js
│   │   ├── chatController.js
│   │   ├── userController.js
│   │   └── registrationController.js
│   │
│   ├── routes/                  
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── marks.js
│   │   ├── bus.js
│   │   ├── contests.js
│   │   ├── news.js
│   │   ├── chat.js
│   │   ├── users.js
│   │   └── registrationRequests.js
│   │
│   ├── middleware/               
│   │   ├── auth.js              
│   │   └── checkRole.js         
│   │
│   ├── utils/                    
│   │   └── generateToken.js     
│   │
│   ├── server.js                 
│   ├── fixCR.js                 
│   ├── package.json            
│   └── .env.example             
│
└── frontend/                     
    ├── css/                   
    │   ├── style.css            
    │   ├── dashboard.css        
    │   ├── admin.css            
    │   └── chat.css            
    │
    ├── js/                       
    │   ├── api.js               
    │   ├── utils.js             
    │   ├── auth.js              
    │   ├── dashboard.js         
    │   ├── courses.js          
    │   ├── leaderboard.js       
    │   ├── admin.js             
    │   └── chat.js              
    │
    ├── pages/                    
    │   ├── index.html           
    │   ├── login.html           
    │   ├── register.html        
    │   ├── dashboard.html       
    │   ├── admin.html           
    │   ├── courses.html         
    │   ├── leaderboard.html     
    │   ├── bus-schedule.html    
    │   ├── contests.html        
    │   ├── news.html            
    │   └── chat.html            
    │
    └    
```

---

## 🚀 Installation Guide

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v14.x or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Text Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### Step-by-Step Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/cse21-hub.git
cd cse21-hub
```

#### 2️⃣ Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

#### 3️⃣ Configure Environment Variables

Create a `.env` file in the `backend` folder:
```bash
cp .env.example .env
nano .env
```

Add these values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cse21hub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**⚠️ Important:** Change `JWT_SECRET` to a random secure string in production!

#### 4️⃣ Start MongoDB

**Ubuntu/Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

#### 5️⃣ Create Initial CR Account
```bash
# From backend directory
node fixCR.js
```

**Output:**
```
✅ CR account created successfully!
Email: cr@cse21.sust.edu
Password: admin123
```

#### 6️⃣ Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

#### 7️⃣ Start Frontend (New Terminal)
```bash
# Navigate to frontend directory
cd ../frontend

# Option 1: Using Python
python3 -m http.server 8000

# Option 2: Using Node http-server
npx http-server -p 8000
```

#### 8️⃣ Access the Application

- **Frontend:** http://localhost:8000/pages/index.html
- **Backend API:** http://localhost:5000/api/health

---

## 🎮 Usage

### Initial Login Credentials

**CR (Class Representative) Account:**
- **Email:** cr@cse21.sust.edu
- **Password:** admin123
- **Access:** Full administrative control

### Student Registration Flow

1. Visit registration page
2. Fill in details (name, email, reg number, password)
3. Submit registration request
4. Wait for CR approval
5. Login after approval with registered credentials

### CR Workflow

1. **Login** as CR
2. **Approve** pending student registrations
3. **Create** courses with mark distribution
4. **Add marks** for students using registration numbers
5. **Manage** bus schedules, contests, and news
6. **Monitor** all users and system activity

### Student Workflow

1. **Login** with approved account
2. **View** dashboard with quick stats
3. **Check** marks and leaderboard rankings
4. **Access** bus schedules and contest information
5. **Read** departmental news and announcements
6. **Chat** with other students in real-time

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register Request
```http
POST /auth/register-request
Content-Type: application/json

{
  "name": "Student Name",
  "email": "student@example.com",
  "regNo": "2021331XXX",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer {token}
```

### Course Endpoints
```http
GET /courses                    # Get all courses
GET /courses/:id                # Get specific course
POST /courses                   # Create course (CR only)
PUT /courses/:id                # Update course (CR only)
DELETE /courses/:id             # Delete course (CR only)
```

### Marks Endpoints
```http
GET /marks/my-marks             # Get student's marks
GET /marks/leaderboard/:courseId # Get course leaderboard
POST /marks                     # Add/update marks (CR only)
```

### User Management Endpoints
```http
GET /users                      # Get all users (CR only)
DELETE /users/:id               # Delete user (CR only)
```

For complete API documentation with examples, see [API.md](./API.md)

---

## 🔐 Security Features

- ✅ **Password Hashing:** bcrypt with salt rounds
- ✅ **JWT Authentication:** Secure token-based auth
- ✅ **Role-Based Access:** CR vs Student permissions
- ✅ **Input Validation:** Server-side validation
- ✅ **CORS Protection:** Controlled cross-origin requests
- ✅ **Environment Variables:** Sensitive data protection
- ✅ **Approval Workflow:** CR verification for new users

---

## 🐛 Known Issues

Currently, there are no known critical issues. Minor enhancements are planned for future versions.

---

## 🚀 Future Enhancements

- [ ] File upload for assignments and submissions
- [ ] Email notifications for important updates
- [ ] Mobile responsive application
- [ ] Advanced analytics dashboard
- [ ] Exam schedule and calendar integration
- [ ] Student profile customization
- [ ] Private messaging between users
- [ ] Export data to PDF/Excel
- [ ] Multi-language support

---

## 👨‍💻 Development & Contribution

### Development Workflow

This project follows a structured Git workflow:
- **Person A:** Backend development, database, APIs
- **Person B:** Frontend development, UI/UX, styling
- **Collaboration:** Integration testing, bug fixes, documentation


### Code Standards
- Use meaningful variable names
- Add comments for complex logic
- Follow consistent indentation (2 spaces)
- Test before committing
- Update documentation for new features

---

## 📄 License

This project is developed for educational purposes as part of the Web Technologies course at SUST. All rights reserved by the development team.

---

## 🙏 Acknowledgments

- **Md. Mehedi Hasan** - Course Instructor & Project Supervisor
- **Open Source Community** - Tools and libraries used

---

## 📞 Contact Information

### Project Maintainers

**Partha Protim Biswas**
- Email: parthaprotim583@gmail.com
- Reg: 2021331015
- Role: Backend Developer

**Hridoy Kumar Biswas**
- Email: hridoybiswass@gmail.com
- Reg: 2021331097
- Role: Frontend Developer

---

## 📊 Project Statistics

- **Total Files:** 50+
- **Lines of Code:** ~4000+
- **Development Time:** 4 days (intensive)
- **Technologies Used:** 10+
- **Features Implemented:** 15+



**Submitted to:** Md. Mehedi Hasan  
**Department:** Computer Science & Engineering  
**Institution:** Shahjalal University of Science & Technology (SUST)  
**Date:** 7-12-2025
