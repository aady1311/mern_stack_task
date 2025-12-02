# 📊 Finance Tracker Web Application (MERN Stack)

A full-stack Finance Tracker Web Application built using the MERN stack with complete authentication, OTP verification, and transaction management.  
This project was created as part of the Interview Assignment and demonstrates secure backend practices, responsive UI, and clean code structure.

---

## 🚀 Features

### ✅ 1. User Authentication & Authorization
- Signup with OTP verification (via Mailtrap)
- Signin with email + password
- Forgot Password with OTP verification
- Change Password (with validation)
- Protected routes using JWT tokens
- Secure password hashing with bcrypt
- Users cannot access Home or Profile pages without logging in

---

### ✅ 2. Finance Tracker (Home Page)
- Add Income / Expense transactions

**Fields:**
- Type (Income / Expense)
- Description
- Amount

**View recent transactions**

**Filters**
- Type filter  
- Date range filter  
- Amount range filter  

**Sorting**
- By Date  
- By Amount  
- By Type  

**Other Features**
- Pagination (server-side preferred)
- Clean and responsive UI

---

### ✅ 3. Profile Page
Displays and updates:
- Username  
- Email  
- Password (masked)

**Actions:**
- Update Profile  
- Change Password  
- Logout  

Data is fully synced with MongoDB.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- Axios  
- React Router  
- CSS / Tailwind / (your choice)

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Mailtrap for sending OTP emails  
- Bcrypt for secure password hashing  

### **Database**
- MongoDB Atlas / Local MongoDB

### **Email Service**
- Mailtrap (for OTP sending)
