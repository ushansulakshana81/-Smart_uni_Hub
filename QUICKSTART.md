# 🚀 Quick Start Guide - Smart Campus Hub

Get the complete Smart Campus Hub user management system running in 5 minutes!

---

## ⚡ One-Time Setup

### Step 1: Backend Configuration

```bash
# 1. Create .env file in root directory
cat > .env << EOF
MONGODB_URI=mongodb+srv://ushansulakshana81_db_user:Ushan%402002@cluster0.h9ewddx.mongodb.net/smart-campus-hub?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
EOF

# 2. Build backend
cd server
mvn clean install
```

### Step 2: Frontend Configuration

```bash
# 1. Install dependencies
cd client
npm install

# 2. Create .env.local
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env.local
```

---

## 🎯 Running the System

### Terminal 1: Start Backend
```bash
cd server
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Access the Application
- **Landing Page**: http://localhost:5173
- **API Server**: http://localhost:8080

---

## 🧪 Test Flows

### 1. User Registration & Login
1. Visit http://localhost:5173
2. Click **"Get Started"** → **"Sign Up"**
3. Fill form and register
4. Login with registered credentials
5. View your profile

### 2. Admin Functions
1. Login as admin user
2. Click **"Admin Dashboard"**
3. View all users, suspend/unsuspend/delete users

### 3. Password Reset
1. Click **"Forgot Password"** on login page
2. Enter email
3. Receive OTP via email
4. Enter OTP and new password
5. Login with new password

### 4. Google OAuth
1. Click **"Sign in with Google"** on login page
2. Select Google account
3. Auto-login with Google credentials

---

## 📋 System Users

### Demo Accounts

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@example.com | Admin@123 | ADMIN | ACTIVE |
| user@example.com | User@123 | USER | ACTIVE |

**Note**: Users can be created through registration form.

---

## 🔒 Security Features

✅ JWT Authentication (1-hour tokens)
✅ OAuth2.0 Google Login  
✅ Role-Based Access Control (RBAC)
✅ Email OTP Password Reset (2-minute expiry)
✅ BCrypt Password Encoding  
✅ Protected Routes  
✅ CORS Configured  
✅ Stateless Sessions  

---

## 📁 Project Structure

```
-Smart_uni_Hub/
├── server/                 # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── mvnw
├── client/                 # React Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .env                    # Backend config
└── USERMANAGEMENT_README.md # Full documentation
```

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check Maven is installed
mvn --version

# Clear Maven cache
mvn clean install -U

# Check port 8080 is free
```

### Frontend won't load
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port 5173 is free
```

### MongoDB Connection Error
```bash
# Verify .env has correct MONGODB_URI
# Check MongoDB Atlas IP whitelist includes your IP
# Verify credentials are correct
```

### JWT Token Errors
```bash
# Clear browser localStorage
# Logout and login again
# Check backend logs for token validation errors
```

---

## 📚 API Examples

### Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Secure@123",
    "confirmPassword": "Secure@123",
    "phoneNumber": "+1234567890",
    "department": "IT"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Secure@123"
  }'
```

### Get Current User Profile
```bash
curl -X GET http://localhost:8080/api/v1/users/profile/me \
  -H "Authorization: Bearer {accessToken}"
```

### Admin: Get All Users
```bash
curl -X GET http://localhost:8080/api/v1/admin/users \
  -H "Authorization: Bearer {accessToken}"
```

---

## 🎓 Next Steps

1. **Setup Email Service**: Update MAIL_USERNAME and MAIL_PASSWORD for actual email delivery
2. **Configure Google OAuth**: Create credentials at https://console.cloud.google.com
3. **Customize Branding**: Update landing page text and colors in LandingPage.jsx
4. **Add Additional Features**: Extend with new user fields or admin features
5. **Deploy to Cloud**: Use Azure App Service, AWS, or similar
6. **Setup CI/CD**: Configure GitHub Actions for automatic deployment

---

## 📞 Support

- **Backend Issues**: Check `server/` directory and HELP.md
- **Frontend Issues**: Check browser console for errors
- **Database Issues**: Check MongoDB Atlas dashboard
- **Full Documentation**: See USERMANAGEMENT_README.md

---

## ✨ Features Included

### Authentication
- Email/Password Registration
- Email/Password Login
- Google OAuth2.0 Integration
- JWT Token Management
- Password Reset with OTP

### User Management
- View User Profile
- Edit Own Profile
- User Status Tracking
- Last Login Timestamp

### Admin Features
- View All Users
- Filter Users by Status
- Suspend/Unsuspend Users
- Delete User Accounts
- Admin Statistics

### Security
- Role-Based Access Control
- Protected Routes
- Secure Token Storage
- OTP Verification
- Email Confirmation

---

**Ready to go!** 🚀

Follow the steps above and you'll have a fully functional user management system running locally.
