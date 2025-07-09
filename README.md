# 🚀 Task Manager & Time Tracker

A **full-stack** application for creating and assigning tasks, tracking time logs, generating reports, and managing countdown events—all in one place.

*Main branch has been modified for deployment via Render, Testing branch is used for Local host testing.*

Live demo: https://productivity-management-frontend.onrender.com

Photos: https://drive.google.com/drive/folders/1SD_MQJfCSZZzGtCtuWWfpTM5xuw9a6x5

Video demo: https://youtu.be/mqxu3PjZ91g

---

## 🧰 Tech Stack

| Layer        | Tools & Libraries                                          |
| ------------ | ---------------------------------------------------------- |
| **Frontend** | React · Vite · React Router · Tailwind CSS                 |
|              | recharts · react-date-range · react-big-calendar            |
|              | axios · react-hot-toast                                     |
| **Backend**  | Node.js · Express · MongoDB · Mongoose                     |
|              | JWT Authentication · bcryptjs                              |
| **DevOps**   | ESLint · Render (deployment)            |

---

## ✨ Features

- **Task Management**  
  - Create / Update / Delete tasks  
  - Title, description, due date, priority  
  - TODO checklist, file attachments  
  - Assign to multiple users (excluding self)  

- **Time Tracking**  
  - Start / stop timer per task  
  - Persisted “time logs”  
  - Cumulative **timeTracked** on each task  

- **Reporting & Dashboards**  
  - Date-range picker for daily / weekly / monthly / all-time  
  - Bar & Pie charts (recharts)  
  - “Recent Tasks” list & distribution/priority charts  

- **Countdown Events**  
  - Create / edit countdowns with due dates  
  - Optional image upload & pin to dashboard  

- **Calendar View**  
  - Month-view (react-big-calendar)  
  - Tasks displayed on due-dates  

- **User System**  
  - JWT-based auth, admin vs. user roles  
  - “Assign to” picker, search by name / email  

- **Responsive UI**  
  - Tailwind CSS for mobile & desktop layouts
 
---

## 🔮 Areas for Improvement
Countdown Image Support: Preview on upload & reliable static serving
Enhanced Error Handling & Validation: User-friendly feedback on failures
Pagination & Advanced Filtering: Handle long task lists & logs
Automated Testing: Unit & integration tests for core flows
Performance Optimizations: Code-splitting, lazy-loading, virtualization
Recurring Tasks & Reminders: Automations for due-date alerts
Accessibility & Internationalization: ARIA support, multi-language
Fine-Grained Permissions: Improved role-based access control and team formation

---

## 🖥️ Installation

1. **Clone repository**  
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager

2. **Backend**

```bash
cd backend
npm install
# create .env file with:
#   MONGO_URI=<your-mongo-uri>
#   JWT_SECRET=<your-jwt-secret>
#   PORT=8000
npm start
```

---
