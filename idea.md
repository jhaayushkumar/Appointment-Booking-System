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

## 🗄️ Prisma Schema (Database Design)

Below is the **Prisma schema** defining the data models and their relationships:

```prisma
model Patient {
  id           Int           @id @default(autoincrement())
  name         String
  age          Int
  gender       String
  phone        String
  email        String        @unique
  appointments Appointment[]
}

model Doctor {
  id             Int           @id @default(autoincrement())
  name           String
  specialization String
  phone          String
  email          String        @unique
  appointments   Appointment[]
  slots          Slot[]
}

model Slot {
  id          Int          @id @default(autoincrement())
  startTime   DateTime
  endTime     DateTime
  doctorId    Int
  doctor      Doctor       @relation(fields: [doctorId], references: [id])
  appointment Appointment?
}

model Appointment {
  id           Int           @id @default(autoincrement())
  date         DateTime
  status       String        @default("Booked")
  patientId    Int
  doctorId     Int
  slotId       Int?          @unique
  patient      Patient       @relation(fields: [patientId], references: [id])
  doctor       Doctor        @relation(fields: [doctorId], references: [id])
  slot         Slot?         @relation(fields: [slotId], references: [id])
  payment      Payment?
  cancellation Cancellation?
}

model Payment {
  id            Int         @id @default(autoincrement())
  amount        Float
  method        String
  paymentDate   DateTime    @default(now())
  appointmentId Int         @unique
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
}

model Cancellation {
  id            Int         @id @default(autoincrement())
  reason        String
  cancelledAt   DateTime    @default(now())
  appointmentId Int         @unique
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
}
