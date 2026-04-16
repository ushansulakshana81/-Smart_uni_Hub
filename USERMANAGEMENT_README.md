# Smart Campus Hub - User Management System

A comprehensive user management and authentication system built with **Spring Boot 3.2** (Java) backend and **React** frontend, featuring OAuth2.0 integration, JWT authentication, role-based access control (RBAC), and OTP-based password reset.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Frontend Components & Routes](#frontend-components--routes)
- [Configuration](#configuration)
- [Security Features](#security-features)
- [Development Guide](#development-guide)

---

## ✨ Features

### Authentication & Security
- ✅ **Email/Password Registration** with validation
- ✅ **OAuth2.0 Google Login** integration
- ✅ **JWT Token-based Authentication** with refresh tokens
- ✅ **Email OTP Password Reset** (2-minute expiry, 3 attempts limit)
- ✅ **Spring Security** with method-level authorization

### User Management
- ✅ **Role-Based Access Control (RBAC)**
  - USER: Can view/edit own profile only
  - ADMIN: Full user management capabilities
- ✅ **User Profiles** with editable fields
- ✅ **Account Status** (ACTIVE, INACTIVE, SUSPENDED)
- ✅ **User Account Suspension** by admins
- ✅ **User Account Deletion** by admins
- ✅ **Last Login Tracking**

### Admin Dashboard
- ✅ View all users with filtering
- ✅ Suspend/Unsuspend user accounts
- ✅ Delete user accounts
- ✅ User statistics and analytics
- ✅ Admin list viewing

### Frontend Features
- ✅ **Protected Routes** with access control
- ✅ **Professional Landing Page**
- ✅ **Responsive Design** (Mobile-friendly)
- ✅ **Error Handling & Validation**
- ✅ **Secure Token Storage**

---

## 🏗️ Architecture

### Layered Architecture

**Backend (Spring Boot):**
```
Controller → Service → Repository → Database (MongoDB)
↓
Security Layer (JWT, OAuth2)
↓
Exception Handling & Validation
```

**Frontend (React):**
```
Pages (Landing, Profile, Admin Dashboard) ↓
Components (Forms, Modals) ↓
Context (Auth) + Hooks (useAuth) ↓
API Services (Axios) ↓
Backend API
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Database**: MongoDB (Cloud)
- **Authentication**: JWT, OAuth2.0 (Google), Spring Security
- **Password Encoding**: BCrypt
- **Validation**: Spring Validation (Jakarta)
- **Email**: Spring Mail (SMTP)
- **Build Tool**: Maven
- **Logging**: SLF4J + Lombok

### Frontend
- **Framework**: React 18+ (Vite)
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: Context API
- **Package Manager**: npm/yarn

---

## 📁 Project Structure

### Backend Directory Structure

```
server/
├── src/main/java/com/sliit/paf/smart_campus_hub/
│   ├── usermanagement/
│   │   ├── controller/
│   │   │   ├── AuthController.java          # Auth endpoints
│   │   │   ├── UserController.java          # User profile endpoints
│   │   │   └── AdminController.java         # Admin-only endpoints
│   │   ├── service/
│   │   │   ├── AuthService.java             # Auth business logic
│   │   │   ├── AuthServiceImpl.java
│   │   │   ├── UserService.java             # User management logic
│   │   │   ├── UserServiceImpl.java
│   │   │   ├── OtpService.java              # OTP generation & validation
│   │   │   ├── OtpServiceImpl.java
│   │   │   ├── EmailService.java            # Email sending
│   │   │   └── EmailServiceImpl.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java          # User CRUD operations
│   │   │   └── OtpTokenRepository.java      # OTP token storage
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── UserDTO.java
│   │   │   ├── UserProfileUpdateRequest.java
│   │   │   ├── PasswordResetRequest.java
│   │   │   ├── ForgotPasswordRequest.java
│   │   │   ├── OtpVerificationRequest.java
│   │   │   └── ApiResponse.java
│   │   └── entity/
│   │       ├── User.java                    # Main User entity
│   │       ├── OtpToken.java                # OTP token entity
│   │       ├── Role.java                    # Enum: USER, ADMIN
│   │       └── UserStatus.java              # Enum: ACTIVE, INACTIVE, SUSPENDED
│   ├── security/
│   │   ├── JwtTokenProvider.java            # JWT interface
│   │   ├── JwtTokenProviderImpl.java         # JWT implementation
│   │   ├── JwtAuthenticationFilter.java     # JWT filter
│   │   └── CustomAuthenticationEntryPoint.java # Auth error handler
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java      # Global error handling
│   │   ├── ResourceNotFoundException.java
│   │   ├── UnauthorizedException.java
│   │   ├── InvalidOtpException.java
│   │   └── DuplicateEmailException.java
│   ├── config/
│   │   ├── SecurityConfig.java              # Spring Security configuration
│   │   └── systemCheckRunner.java           # System health check
│   └── util/
│       └── OtpGenerator.java                # OTP generation utility
├── src/main/resources/
│   └── application.yaml                     # Application configuration
└── pom.xml                                  # Maven dependencies

```

### Frontend Directory Structure

```
client/
├── src/
│   ├── features/user-management/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx              # Public landing page
│   │   │   ├── ProfilePage.jsx              # User profile page
│   │   │   ├── AdminDashboard.jsx           # Admin dashboard
│   │   │   └── ForgotPasswordPage.jsx       # Password reset page
│   │   ├── components/
│   │   │   ├── LoginForm.jsx                # Login form component
│   │   │   ├── RegisterForm.jsx             # Registration form component
│   │   │   ├── OTPModal.jsx                 # OTP verification modal
│   │   │   └── ProtectedRoute.jsx           # Route protection wrapper
│   │   ├── services/
│   │   │   ├── axiosInstance.js             # Axios configuration
│   │   │   └── apiService.js                # API service functions
│   │   ├── context/
│   │   │   └── AuthContext.jsx              # Auth context provider
│   │   ├── hooks/
│   │   │   └── useAuth.js                   # Custom auth hook
│   │   ├── utils/
│   │   │   └── (utility functions)
│   │   └── styles/
│   │       ├── AuthForms.css
│   │       ├── OTPModal.css
│   │       ├── LandingPage.css
│   │       ├── ProfilePage.css
│   │       ├── AdminDashboard.css
│   │       └── ForgotPasswordPage.css
│   ├── App.jsx                              # Main app with routing
│   └── main.jsx                             # Entry point
├── .env.local                               # Environment variables
├── .env.example                             # Example env file
├── package.json
└── vite.config.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Java 17+
- Node.js 16+ & npm/yarn
- MongoDB (Cloud Atlas or Local)
- Maven
- Git

### Backend Setup

#### 1. Clone the Repository
```bash
cd server
```

#### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```properties
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-campus-hub?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_specific_password

# JWT Configuration (optional, has defaults)
JWT_SECRET=your_secret_key_min_32_chars_recommended
JWT_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000
```

#### 3. Install Dependencies & Build
```bash
mvn clean install
```

#### 4. Run the Application
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 5. Verify Backend
```bash
curl http://localhost:8080/actuator
```

---

### Frontend Setup

#### 1. Navigate to Client Directory
```bash
cd client
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Configure Environment
Create `.env.local` file:
```properties
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

#### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/v1/auth/register` | User registration | No |
| POST | `/api/v1/auth/login` | Email/password login | No |
| POST | `/api/v1/auth/google-login` | Google OAuth login | No |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password with OTP | No |
| POST | `/api/v1/auth/verify-otp` | Verify OTP | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|----------------|------|
| GET | `/api/v1/users/{id}` | Get user by ID | Yes | USER, ADMIN |
| GET | `/api/v1/users/email/{email}` | Get user by email | Yes | USER, ADMIN |
| GET | `/api/v1/users/profile/me` | Get current user profile | Yes | USER, ADMIN |
| PUT | `/api/v1/users/{id}` | Update user profile | Yes | USER, ADMIN |

### Admin Endpoints (Admin Only)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|----------------|------|
| GET | `/api/v1/admin/users` | Get all users | Yes | ADMIN |
| POST | `/api/v1/admin/users/{userId}/suspend` | Suspend user | Yes | ADMIN |
| POST | `/api/v1/admin/users/{userId}/unsuspend` | Unsuspend user | Yes | ADMIN |
| DELETE | `/api/v1/admin/users/{userId}` | Delete user | Yes | ADMIN |
| GET | `/api/v1/admin/users/role/admin` | Get all admins | Yes | ADMIN |

### Request/Response Examples

#### Register
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "phoneNumber": "+1234567890",
  "department": "IT"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "ACTIVE",
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "expiresAt": "2024-04-15T08:36:55"
  }
}
```

---

## 🎨 Frontend Components & Routes

### Routes Structure

```
/                           → LandingPage (Public)
/login                      → LoginForm (Public)
/register                   → RegisterForm (Public)
/forgot-password            → ForgotPasswordPage (Public)
/profile                    → ProfilePage (Protected - USER)
/admin/dashboard            → AdminDashboard (Protected - ADMIN)
/unauthorized               → Unauthorized page (Protected)
```

### Component Hierarchy

```
App
├── AuthProvider
│   ├── Router
│   │   ├── LandingPage
│   │   ├── LoginForm
│   │   ├── RegisterForm
│   │   ├── ForgotPasswordPage
│   │   ├── ProfilePage (ProtectedRoute)
│   │   ├── AdminDashboard (ProtectedRoute)
│   │   └── ...
│   └── Global Exception Handler
│
├── AuthContext
│   ├── login()
│   ├── logout()
│   ├── register()
│   └── isAuthenticated
│
└── useAuth Hook
    └── All components use this
```

---

## ⚙️ Configuration

### Backend Configuration (`application.yaml`)

```yaml
server:
  port: 8080

spring:
  config:
    import:
      - optional:file:../.env[.properties]
  data:
    mongodb:
      uri: ${MONGODB_URI}
  mail:
    host: ${MAIL_HOST:smtp.gmail.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: profile, email

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:3600000}
  refresh:
    expiration: ${JWT_REFRESH_EXPIRATION:604800000}

application:
  name: smart-campus-hub
```

### Frontend Environment Variables

```properties
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 🔐 Security Features

### Backend Security

1. **JWT Token Authentication**
   - Access tokens valid for 1 hour
   - Refresh tokens valid for 7 days
   - Tokens sent via `Authorization: Bearer <token>` header

2. **OAuth2.0 Integration**
   - Google Login support
   - Automatic user creation on first Google login
   - Email verification through Google

3. **Spring Security**
   - Method-level authorization with `@PreAuthorize`
   - CORS configuration for frontend
   - CSRF protection disabled for API
   - Stateless session management

4. **Password Security**
   - BCrypt password encoding
   - Password validation (minimum 6 characters)
   - Password confirmation matching

5. **OTP Security**
   - 6-digit OTP generation
   - 2-minute expiry time
   - Maximum 3 verification attempts
   - Automatic OTP deletion after successful verification

6. **Email Validation**
   - Email uniqueness check
   - Email format validation
   - Email verification tracking

### Frontend Security

1. **Protected Routes**
   - Role-based route protection
   - Automatic redirection to login if unauthorized
   - Admin-only dashboard access control

2. **Token Management**
   - Tokens stored in `localStorage`
   - Automatic token refresh on API calls
   - Token cleanup on logout

3. **Request Interceptors**
   - Automatic token attachment to all requests
   - Automatic logout on 401 responses
   - Error handling and validation

4. **XSS Prevention**
   - React's built-in XSS protection
   - HTML encoding in templates
   - No use of `dangerouslySetInnerHTML`

---

## 👨‍💻 Development Guide

### Adding a New Endpoint

#### Backend
1. Create DTO if needed in `dto/` folder
2. Add repository method in `repository/` if needed
3. Add service method in `service/`
4. Add controller method with `@PreAuthorize` annotation
5. Add exception handling in `GlobalExceptionHandler`

#### Example Controller Method
```java
@PostMapping("/action")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse> action(@PathVariable String id) {
    // Implementation
}
```

### Adding a New React Page

1. Create component in `pages/` folder
2. Create corresponding CSS in `styles/` folder
3. Add route in `App.jsx`
4. Import necessary hooks and components
5. Use `useAuth()` hook for authentication status

### Environment-Specific Configuration

#### Production Build
```bash
# Backend
mvn clean package

# Frontend
npm run build
```

---

## 📚 Dependencies

### Backend (Maven)
- Spring Boot Starters (Web, Data MongoDB, Security, Mail, Validation)
- jjwt (JWT library)
- Lombok (Boilerplate reduction)
- Spring Security OAuth2

### Frontend (npm)
- react
- react-router-dom
- axios
- (No external UI library - custom CSS)

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Solution: Verify MONGODB_URI in .env file, check MongoDB Atlas IP whitelist
```

**JWT Token Validation Failed**
```
Solution: Check JWT_SECRET matches in application.yaml and SecurityConfig
```

**Email not sending**
```
Solution: Enable "Less secure app access" on Gmail or use App Password
```

### Frontend Issues

**CORS Error**
```
Solution: Verify VITE_API_BASE_URL is correct and backend CORS is configured
```

**Token not persisting**
```
Solution: Check localStorage is not disabled, check browser console for errors
```

**Routes not working**
```
Solution: Verify React Router is properly installed, check route paths match exactly
```

---

## 📞 Support & Documentation

- Backend API Documentation: Swagger (if added)
- Frontend Component Library: Check `src/features/user-management/components/`
- Security Details: See `src/main/java/com/sliit/paf/smart_campus_hub/config/`

---

## 📄 License

This project is part of the Smart Campus Operations Hub initiative.

---

## 👥 Contributors

- Development Team
- Architecture & Security Review

---

**Last Updated**: April 15, 2024

For questions or issues, please refer to the project documentation or contact the development team.
