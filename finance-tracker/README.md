# Finance Tracker Web Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for tracking personal finances with authentication and OTP verification.

## Features

### 🔐 Authentication & Authorization
- User signup with OTP verification
- Secure signin with JWT tokens
- Forgot password with OTP verification
- Change password with OTP verification
- Protected routes

### 💰 Finance Management
- Add income and expense transactions
- View transaction history with filters
- Sort by date, amount, or type
- Server-side pagination
- Real-time balance calculation
- Transaction summary dashboard

### 👤 User Profile
- View user information
- Change password securely
- Logout functionality

### 📱 Responsive Design
- Mobile-friendly interface
- Clean and modern UI with Tailwind CSS
- Responsive navigation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service for OTP

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account for email service

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: For Gmail, you need to:
- Enable 2-factor authentication
- Generate an app password
- Use the app password in EMAIL_PASS

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### MongoDB Setup

#### Local MongoDB:
1. Install MongoDB on your system
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/finance-tracker`

#### MongoDB Atlas (Cloud):
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - Verify OTP after signup
- `POST /api/auth/signin` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/change-password` - Change password (authenticated)
- `POST /api/auth/verify-change-password` - Verify OTP for password change

### Transactions
- `GET /api/transactions` - Get transactions with filters and pagination
- `POST /api/transactions` - Add new transaction
- `GET /api/transactions/summary` - Get transaction summary

### User
- `GET /api/user/profile` - Get user profile

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Verify OTP**: Check your email for OTP and verify your account
3. **Sign In**: Login with your credentials
4. **Add Transactions**: Use the form to add income or expense transactions
5. **View History**: Browse your transaction history with filters and sorting
6. **Manage Profile**: Update your password or logout from the profile page

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- OTP verification for critical operations
- Protected API routes
- Input validation and sanitization
- CORS configuration

## Project Structure

```
finance-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── user.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── email.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Signup.js
    │   │   ├── Signin.js
    │   │   ├── ForgotPassword.js
    │   │   ├── Home.js
    │   │   └── Profile.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── utils/
    │   │   └── api.js
    │   └── App.js
    └── public/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.