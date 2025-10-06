# 🏥 Smart Appointment Booking System

## 📘 Project Overview
The **Smart Appointment Booking System** is a web-based healthcare platform designed to streamline the process of booking, managing, and tracking medical appointments.  
It connects **patients**, **doctors**, and **admins** through an intuitive, secure, and role-based interface — ensuring smooth and efficient consultations.

---

## ⚙️ Key Features / Modules
- 🔐 **User Authentication (JWT-based)** – Secure login & registration system.
- 🩺 **Doctor Management** – Manage appointments, availability, and prescriptions.
- 👨‍🦱 **Patient Management** – Book appointments and access prescriptions.
- 🧑‍💼 **Admin Panel** – Oversee users, approve/suspend accounts, and manage data.
- 📅 **Appointment Lifecycle** – Tracks booking progress (Pending → Confirmed → Completed).
- 💊 **Prescription System** – Doctors can upload or write prescriptions; patients can view/download them.
- 📧 **Email / Notifications** – Confirmation and update alerts.

---

## 👥 User Roles

| Role | Description | Permissions |
|------|--------------|--------------|
| **Patient** | Books appointments and views prescriptions. | Book appointments, view doctors, access history. |
| **Doctor** | Manages appointments and prescriptions. | Manage slots, confirm appointments, upload prescriptions. |
| **Admin** | Controls system and user activities. | View users, manage roles, suspend accounts. |

---

## 🖥️ Page / Screen List (Frontend)

| Page / Component | Description |
|------------------|-------------|
| **Landing Page** | Entry page with overview and navigation. |
| **Login / Register** | User authentication pages. |
| **Patient Dashboard** | Displays available doctors, booking form, and history. |
| **Doctor Dashboard** | Shows daily appointments, patient details, and prescription tools. |
| **Admin Panel** | Admin view for user management and analytics. |
| **Appointment Page** | Tracks booking details and statuses. |
| **Prescription Page** | Shows downloadable prescriptions. |

---

## 🧩 Database Schema (Rough Draft)

### 🧾 User Table
| Field | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique user ID |
| name | VARCHAR | Full name |
| email | VARCHAR | Unique email |
| password | VARCHAR | Hashed password |
| role | ENUM('admin','doctor','patient') | Defines role |

### 🩺 Doctor Table
| Field | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Doctor ID |
| user_id | INT (FK) | Linked to User table |
| specialization | VARCHAR | Field of expertise |
| availability | JSON | Available time slots |

### 👤 Patient Table
| Field | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Patient ID |
| user_id | INT (FK) | Linked to User table |
| age | INT | Age |
| gender | VARCHAR | Gender |

### 📅 Appointment Table
| Field | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Appointment ID |
| doctor_id | INT (FK) | Linked to Doctor table |
| patient_id | INT (FK) | Linked to Patient table |
| date | DATE | Appointment date |
| time | TIME | Appointment time |
| status | ENUM('pending','confirmed','completed') | Appointment status |

### 💊 Prescription Table
| Field | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Prescription ID |
| appointment_id | INT (FK) | Linked to Appointment table |
| details | TEXT | Prescription text |
| file_url | VARCHAR | Optional uploaded file link |

---

## 💻 Tech Stack (Tentative)

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL with Prisma ORM |
| **Authentication** | JWT + Cookies |
| **Version Control** | Git & GitHub |
| **Deployment** | Render / Vercel / Railway (optional) |

---

## 🔄 Workflow (User Interaction Summary)

### 1️⃣ Registration & Login Flow
- User registers or logs in via `/api/auth/register` or `/api/auth/login`.
- Backend validates and hashes password using **bcrypt**.
- A **JWT token** is generated and stored in cookies.
- Redirects user to their respective dashboard (patient/doctor/admin).

### 2️⃣ Doctor Workflow
- Doctor logs in → Dashboard shows appointments and patients.  
- Can update availability, confirm appointments, and add prescriptions.  
- **Routes:**  
  - `GET /api/doctor/appointments`  
  - `POST /api/doctor/prescription`  
  - `PATCH /api/doctor/availability`

### 3️⃣ Patient Workflow
- Patient logs in → Sees doctor list and available slots.  
- Books appointment via `POST /api/appointments/book`.  
- Can view prescriptions and appointment history.  
- **Routes:**  
  - `GET /api/doctors`  
  - `GET /api/patient/appointments`  
  - `POST /api/appointments/book`

### 4️⃣ Admin Workflow
- Admin accesses panel to manage all users and system data.  
- **Routes:**  
  - `GET /api/admin/users`  
  - `PATCH /api/admin/update-user`  
  - `DELETE /api/admin/remove-user`

### 5️⃣ Appointment Lifecycle
1. Patient books → `status = pending`  
2. Doctor confirms → `status = confirmed`  
3. Consultation completes → `status = completed` (Prescription added)

### 6️⃣ Authentication Middleware Example
```js
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}
