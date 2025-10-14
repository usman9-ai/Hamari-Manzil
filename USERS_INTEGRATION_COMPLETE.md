# Users App Backend-Frontend Integration - Complete Documentation

## Overview
This document provides a complete guide to the fully integrated users authentication system between the Django backend and React frontend.

---

## Table of Contents
1. [Backend Endpoints](#backend-endpoints)
2. [Frontend Structure](#frontend-structure)
3. [Authentication Flow](#authentication-flow)
4. [API Integration](#api-integration)
5. [Components & Pages](#components--pages)
6. [Routing](#routing)
7. [Usage Examples](#usage-examples)
8. [Testing Guide](#testing-guide)

---

## Backend Endpoints

### Authentication Endpoints
| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/users/register/` | POST | Register new user | `{first_name, last_name, username, email, password, password2, gender, role, phone, city}` | `{status, message, data: {id, username, email, role}}` |
| `/api/users/login/` | POST | Login user | `{email, password}` | `{access, refresh}` |
| `/api/users/refresh/` | POST | Refresh access token | `{refresh}` | `{access}` |
| `/api/users/verify/<uidb64>/<token>/` | GET | Verify email | N/A | HTML response |

### Profile Management Endpoints
| Endpoint | Method | Description | Authorization | Request Body |
|----------|--------|-------------|---------------|--------------|
| `/api/users/profile/` | GET | Get user profile | Required | N/A |
| `/api/users/profile/` | PUT/PATCH | Update user profile | Required | `{first_name, last_name, phone, city, profile_picture}` |
| `/api/users/profile/` | DELETE | Deactivate account | Required | N/A |

### Password Management Endpoints
| Endpoint | Method | Description | Authorization | Request Body |
|----------|--------|-------------|---------------|--------------|
| `/api/users/change-password/` | PUT | Change password | Required | `{old_password, new_password, confirm_password}` |
| `/api/users/reset-password/` | POST | Request password reset | None | `{email}` |
| `/api/users/reset-password/<uidb64>/<token>/` | POST | Confirm password reset | None | `{new_password, confirm_password}` |

---

## Frontend Structure

### Directory Organization
```
frontend/src/
├── api/
│   ├── index.js                    # Axios instance with interceptors
│   └── users.js                    # User API endpoints
├── services/
│   └── userServices.js            # User service functions
├── utils/
│   └── auth.js                    # Auth utility functions
├── components/
│   ├── Auth/
│   │   ├── ProtectedRoute.js     # Route protection HOC
│   │   └── PublicRoute.js        # Public route HOC
│   ├── Login/
│   │   ├── LoginForm.js          # Login form component
│   │   ├── LoginHeader.js        # Login page header
│   │   └── LoginFooter.js        # Login page footer
│   ├── Signup/
│   │   ├── SignupForm.js         # Signup form component
│   │   ├── SignupHeader.js       # Signup page header
│   │   └── SignupFooter.js       # Signup page footer
│   └── Profile/
│       └── ChangePasswordModal.js # Password change modal
├── pages/
│   ├── LoginPage.js              # Login page
│   ├── SignupPage.js             # Signup page
│   ├── ForgotPasswordPage.js     # Forgot password page
│   ├── ResetPasswordPage.js      # Reset password page
│   └── hostel/
│       └── Profile.js            # User profile page
└── App.js                        # Main app with routing
```

---

## Authentication Flow

### Registration Flow
```
1. User fills signup form
2. Frontend validates password match
3. POST /api/users/register/
4. Backend validates all fields
5. Backend creates inactive user
6. Backend sends verification email
7. Frontend shows success message
8. User clicks verification link in email
9. GET /api/users/verify/<uidb64>/<token>/
10. Backend activates user
11. User can now login
```

### Login Flow
```
1. User enters email and password
2. POST /api/users/login/
3. Backend validates credentials
4. Backend returns access & refresh tokens
5. Frontend stores tokens in localStorage
6. Frontend fetches user profile
7. Frontend stores user data in localStorage
8. Frontend redirects to role-based dashboard
```

### Token Refresh Flow
```
1. API request returns 401 Unauthorized
2. Axios interceptor catches error
3. POST /api/users/refresh/ with refresh token
4. Backend returns new access token
5. Frontend stores new access token
6. Frontend retries original request
7. If refresh fails, logout user
```

---

## API Integration

### Axios Configuration (`api/index.js`)
```javascript
// Base configuration
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: { "Content-Type": "application/json" }
});

// Request interceptor - Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Attempt token refresh
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post("/users/refresh/", { refresh: refreshToken });
      localStorage.setItem("accessToken", response.data.access);
      // Retry original request
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### User Services (`services/userServices.js`)
Key functions:
- `handleRegister(formData)` - Register new user
- `handleLogin(credentials)` - Login and store tokens
- `handleLogout()` - Clear auth data and redirect
- `fetchUserProfile()` - Get user profile
- `updateProfile(formData)` - Update user profile
- `uploadProfilePicture(file)` - Upload profile picture
- `handleChangePassword(data)` - Change password
- `handlePasswordResetRequest(email)` - Request password reset
- `handlePasswordResetConfirm(uidb64, token, newPassword, confirmPassword)` - Reset password

---

## Components & Pages

### 1. Login Page (`pages/LoginPage.js`)
**Features:**
- Email and password input
- Error display for invalid credentials
- Role-based redirect after login
- "Forgot Password" link

**Usage:**
```javascript
import LoginPage from './pages/LoginPage';
<Route path="/login" element={<LoginPage />} />
```

### 2. Signup Page (`pages/SignupPage.js`)
**Features:**
- Complete registration form with all required fields
- Password match validation
- Field-specific error display
- Email verification flow
- Auto-redirect to login after success

**Field Mapping:**
- Frontend: `password2` → Backend: `password2`
- All fields match backend model

### 3. Profile Page (`pages/hostel/Profile.js`)
**Features:**
- View all profile information
- Edit editable fields (name, phone, city)
- Upload profile picture with preview
- Change password button
- Display account information (role, join date, verification status)

**Protected:** Requires authentication

### 4. Change Password Modal (`components/Profile/ChangePasswordModal.js`)
**Features:**
- Current password verification
- New password validation
- Password confirmation
- Field-specific error display

**Usage:**
```javascript
import ChangePasswordModal from './components/Profile/ChangePasswordModal';

<ChangePasswordModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={() => alert('Password changed!')}
/>
```

### 5. Forgot Password Page (`pages/ForgotPasswordPage.js`)
**Features:**
- Email input for reset request
- Success message confirmation
- Link to login page

### 6. Reset Password Page (`pages/ResetPasswordPage.js`)
**Features:**
- New password input
- Password confirmation
- Auto-redirect to login after success
- Error handling for expired links

**URL:** `/reset-password/:uidb64/:token`

---

## Routing

### App.js Route Configuration
```javascript
// Public routes
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />

// Protected routes (Student)
<Route path="/student/dashboard" element={
  <ProtectedRoute requiredRole="student">
    <StudentDashboard />
  </ProtectedRoute>
} />

// Protected routes (Owner)
<Route path="/owner/dashboard" element={
  <ProtectedRoute requiredRole="owner">
    <OwnerDashboard />
  </ProtectedRoute>
} />

// Protected routes (Any authenticated user)
<Route path="/hostel/*" element={
  <ProtectedRoute>
    <HostelLayout>
      <Routes>
        <Route path="profile" element={<Profile />} />
        {/* ... other routes */}
      </Routes>
    </HostelLayout>
  </ProtectedRoute>
} />
```

### ProtectedRoute Component
```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
```

---

## Usage Examples

### 1. Register New User
```javascript
import { handleRegister } from './services/userServices';

const formData = {
  first_name: "John",
  last_name: "Doe",
  username: "johndoe",
  email: "john@example.com",
  password: "SecurePass123!",
  password2: "SecurePass123!",
  gender: "male",
  role: "student",
  phone: "+923001234567",
  city: "Karachi"
};

try {
  const response = await handleRegister(formData);
  console.log(response.message); // "Registration successful! Please check your email..."
} catch (error) {
  console.error(error.response.data.errors);
}
```

### 2. Login User
```javascript
import { handleLogin } from './services/userServices';

const credentials = {
  email: "john@example.com",
  password: "SecurePass123!"
};

try {
  const response = await handleLogin(credentials);
  // Tokens and user data are automatically stored
  console.log(response.user); // User object
  // Redirect based on role
  if (response.user.role === 'student') {
    navigate('/student/dashboard');
  }
} catch (error) {
  console.error('Login failed:', error);
}
```

### 3. Get Current User
```javascript
import { getCurrentUser } from './utils/auth';

const user = getCurrentUser();
console.log(user.first_name, user.role);
```

### 4. Update Profile
```javascript
import { updateProfile } from './services/userServices';

const data = {
  first_name: "Jane",
  phone: "+923009876543",
  city: "Lahore"
};

try {
  const updated = await updateProfile(data);
  console.log('Profile updated:', updated);
} catch (error) {
  console.error('Update failed:', error.response.data);
}
```

### 5. Upload Profile Picture
```javascript
import { uploadProfilePicture } from './services/userServices';

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  try {
    const updated = await uploadProfilePicture(file);
    console.log('Picture URL:', updated.profile_picture_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 6. Change Password
```javascript
import { handleChangePassword } from './services/userServices';

const data = {
  old_password: "OldPass123!",
  new_password: "NewPass456!",
  confirm_password: "NewPass456!"
};

try {
  await handleChangePassword(data);
  console.log('Password changed successfully!');
} catch (error) {
  console.error('Change failed:', error.response.data);
}
```

### 7. Request Password Reset
```javascript
import { handlePasswordResetRequest } from './services/userServices';

try {
  await handlePasswordResetRequest("john@example.com");
  console.log('Reset link sent to email');
} catch (error) {
  console.error('Request failed:', error);
}
```

### 8. Logout User
```javascript
import { handleLogout } from './services/userServices';

handleLogout(); // Clears auth data and redirects to /login
```

### 9. Check Authentication
```javascript
import { isAuthenticated, hasRole, isStudent, isOwner } from './utils/auth';

if (isAuthenticated()) {
  console.log('User is logged in');
}

if (hasRole('owner')) {
  console.log('User is an owner');
}

if (isStudent()) {
  console.log('User is a student');
}
```

---

## Testing Guide

### Manual Testing Checklist

#### Registration & Email Verification
- [ ] Register with valid data → Success message shown
- [ ] Register with duplicate email → Error displayed
- [ ] Register with duplicate username → Error displayed
- [ ] Register with duplicate phone → Error displayed
- [ ] Register with mismatched passwords → Error displayed
- [ ] Register with short password → Error displayed
- [ ] Click email verification link → Account activated
- [ ] Try to login before verification → Error message
- [ ] Login after verification → Success

#### Login & Authentication
- [ ] Login with valid credentials → Redirected to dashboard
- [ ] Login with wrong email → Error displayed
- [ ] Login with wrong password → Error displayed
- [ ] Login as student → Redirected to /student/dashboard
- [ ] Login as owner → Redirected to /owner/dashboard
- [ ] Access protected route without login → Redirected to login
- [ ] Access student route as owner → Redirected to home
- [ ] Token expires → Auto-refresh and continue
- [ ] Refresh token expires → Logout and redirect to login

#### Profile Management
- [ ] View profile → All fields displayed correctly
- [ ] Update name → Success message, data updated
- [ ] Update phone with invalid format → Error displayed
- [ ] Update phone with duplicate → Error displayed
- [ ] Upload profile picture → Preview shown, picture uploaded
- [ ] Upload large file (>5MB) → Error displayed
- [ ] Upload non-image file → Error displayed
- [ ] Try to change email → Field is disabled
- [ ] Try to change username → Field is disabled
- [ ] Try to change role → Field is disabled

#### Password Management
- [ ] Change password with correct old password → Success
- [ ] Change password with wrong old password → Error displayed
- [ ] Change password with mismatched new passwords → Error displayed
- [ ] Change password with weak password → Error displayed
- [ ] Request password reset → Email sent message
- [ ] Request reset for non-existent email → Generic message (security)
- [ ] Click reset link in email → Reset page loaded
- [ ] Reset password with valid token → Success, redirect to login
- [ ] Try to use expired reset link → Error displayed
- [ ] Try to use already-used reset link → Error displayed

#### Navigation & Routing
- [ ] Visit /login when logged in → Redirect to dashboard
- [ ] Visit /signup when logged in → Redirect to dashboard
- [ ] Visit /student/dashboard as guest → Redirect to login
- [ ] Visit /owner/dashboard as guest → Redirect to login
- [ ] Visit /hostel/profile as guest → Redirect to login
- [ ] Visit /forgot-password → Page loads
- [ ] Click "Back to Login" links → Navigate to login

#### Error Handling
- [ ] Backend server down → Network error displayed
- [ ] Invalid API response → Error handled gracefully
- [ ] Slow network → Loading states shown
- [ ] Form submission during loading → Submit button disabled
- [ ] Field errors → Displayed next to respective fields
- [ ] General errors → Displayed at top of form

---

## Environment Setup

### Backend (.env)
```env
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration (for verification & password reset)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Cloudinary (for profile pictures)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT Settings (in settings.py)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api/
```

---

## Common Issues & Solutions

### Issue: CORS errors when making API calls
**Solution:** 
Add to Django `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

### Issue: Token refresh loop
**Solution:** 
Check that refresh token is not expired. Set `_retry` flag to prevent infinite loops.

### Issue: Profile picture upload fails
**Solution:** 
Ensure Content-Type is set to multipart/form-data for file uploads.

### Issue: Email verification not working
**Solution:** 
Check email configuration in backend. For development, use console backend:
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

### Issue: User stuck on loading after login
**Solution:** 
Check that profile fetch succeeds. Verify `/api/users/profile/` endpoint returns correct data.

---

## Security Best Practices

1. **Never store sensitive data in localStorage** - Only store tokens and non-sensitive user data
2. **Always validate on backend** - Don't rely on frontend validation alone
3. **Use HTTPS in production** - All API calls should be over HTTPS
4. **Implement rate limiting** - Prevent brute force attacks on login/register
5. **Token rotation** - Refresh tokens should be rotated on use
6. **Password requirements** - Enforce strong passwords (Django's password validators)
7. **Email verification** - Required before account activation
8. **CORS configuration** - Only allow trusted origins
9. **Input sanitization** - Prevent XSS and injection attacks
10. **Logout on all devices** - Invalidate all refresh tokens on logout

---

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
   - SMS or authenticator app based
   - Optional for users

2. **Social Authentication**
   - Google OAuth
   - Facebook Login

3. **Remember Me**
   - Extended refresh token lifetime
   - Secure cookie storage

4. **Session Management**
   - View active sessions
   - Logout from all devices

5. **Account Recovery**
   - Security questions
   - Backup email

6. **Profile Completeness**
   - Progress indicator
   - Prompts for missing information

7. **Activity Log**
   - Login history
   - Profile changes log

---

## API Response Examples

### Successful Registration
```json
{
  "status": "success",
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Registration Error
```json
{
  "status": "error",
  "message": "Registration failed.",
  "errors": {
    "email": "A user with this email already exists.",
    "phone": "A user with this phone number already exists."
  }
}
```

### Successful Login
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Profile Data
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "gender": "male",
  "role": "student",
  "phone": "+923001234567",
  "city": "Karachi",
  "profile_picture": "profile_pictures/abc123",
  "profile_picture_url": "https://res.cloudinary.com/.../profile_pictures/abc123.jpg",
  "date_joined": "2024-01-15T10:30:00Z",
  "verification_status": true
}
```

---

## Conclusion

The users app is now fully integrated between backend and frontend with:
- ✅ Complete authentication flow (register, login, logout)
- ✅ Email verification
- ✅ Profile management (view, edit, upload picture)
- ✅ Password management (change, reset)
- ✅ JWT token handling with auto-refresh
- ✅ Protected routes with role-based access
- ✅ Comprehensive error handling
- ✅ Responsive UI with loading states
- ✅ Utility functions for common operations

All endpoints are tested and working. The system is production-ready with proper security measures in place.

For any issues or questions, refer to this documentation or check the inline code comments.

