# Complaint Management System

## Overview

A full-stack Complaint Management System designed to streamline complaint registration, assignment, tracking, and resolution processes. The application supports role-based access for Users, Technicians, and Administrators, incorporates AI-powered complaint categorization and troubleshooting suggestions, and provides real-time notifications and analytics dashboards.

---

## Key Features

### Authentication & Security

* JWT-based Authentication and Authorization
* Role-Based Access Control (User, Technician, Admin)
* BCrypt Password Encryption
* Protected APIs using Spring Security
* Axios Interceptors for Secure API Communication

### Complaint Management

* Create and Track Complaints
* Upload Complaint Attachments
* Complaint Status Management
* Complaint Timeline Tracking
* Complaint Details View
* Pagination Support
* Search and Filtering

### User Features

* Create Complaints
* View Complaint History
* Track Complaint Progress
* Manage Profile Information
* Change Password

### Technician Features

* View Assigned Complaints
* Update Complaint Status
* Add Work Notes and Comments
* Track Assigned Tasks

### Admin Features

* View and Manage All Complaints
* Assign Technicians
* Update Complaint Status
* Dashboard Analytics
* Technician Performance Analytics
* Export Reports to Excel

### AI Features

* AI-Based Complaint Categorization
* AI Troubleshooting Suggestions
* Powered by Groq API (Llama 3.3 70B Versatile)

### Notifications

* Email Notifications
* Real-Time WebSocket Notifications

### Analytics & Reporting

* Complaint Statistics Dashboard
* Resolution Time Analytics
* Complaint Status Distribution
* Technician Performance Metrics
* Export Reports to Excel

---

## Tech Stack

### Frontend

* React.js
* Material UI (MUI)
* Axios
* React Router
* Recharts

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* WebSocket (STOMP)
* Java Mail Sender

### Database

* MySQL

### AI Integration

* Groq API
* Llama-3.3-70B-Versatile

---

## System Architecture

```text
React Frontend
       │
       ▼
Spring Boot REST APIs
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
MySQL  AI   WebSocket
Database API Notifications
```

---

## Project Modules

### User Module

* Register/Login
* Create Complaint
* View My Complaints
* Complaint Details
* Comments & Timeline
* Profile Management

### Technician Module

* Assigned Complaints
* Status Updates
* Work Notes
* Complaint Resolution

### Admin Module

* Complaint Management
* Technician Assignment
* Dashboard Analytics
* Report Export
* Performance Monitoring

---

## Installation

### Backend Setup

```bash
git clone <repository-url>

cd backend

mvn clean install

mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

## Environment Variables

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```

### Backend (application.properties)

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

jwt.secret=

groq.api.key=

spring.mail.username=
spring.mail.password=
```

---

## API Highlights

### Authentication

* POST /api/v1/auth/register
* POST /api/v1/auth/login

### Complaints

* POST /api/v1/complaints
* GET /api/v1/complaints/my
* GET /api/v1/complaints/{id}

### Admin

* PUT /api/v1/admin/assign-technician
* PUT /api/v1/admin/update-status

### Technician

* GET /api/v1/technician/complaints
* PUT /api/v1/technician/update-status

### Analytics

* GET /api/v1/analytics/dashboard
* GET /api/v1/analytics/technician-performance

---

## Future Enhancements

* Docker Containerization
* Cloud Deployment
* Mobile Application
* Advanced Reporting
* Audit Logs
* Multi-Tenant Support

---

## Author

**Charan Yerramsetti**

Java Full Stack Developer

* Java
* Spring Boot
* React.js
* MySQL
* AI Integration
* REST APIs

---

## License

This project is developed for educational and portfolio purposes.
