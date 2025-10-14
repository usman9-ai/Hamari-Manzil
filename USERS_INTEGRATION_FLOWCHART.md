# Users Integration - Visual Flow Diagrams

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

User                    Frontend                    Backend              Email
  │                        │                          │                   │
  ├──(1)Fill Form────────>│                          │                   │
  │                        │                          │                   │
  │                        ├──(2)Validate Form        │                   │
  │                        │   (password2 match)      │                   │
  │                        │                          │                   │
  │                        ├──(3)POST /register/────>│                   │
  │                        │   {form data}            │                   │
  │                        │                          │                   │
  │                        │                          ├──(4)Validate     │
  │                        │                          │   Fields          │
  │                        │                          │                   │
  │                        │                          ├──(5)Create User  │
  │                        │                          │   (is_active=F)   │
  │                        │                          │                   │
  │                        │                          ├──(6)Send Email──>│
  │                        │                          │                   │
  │                        │<─(7)Success Response────┤                   │
  │                        │   {status, message}      │                   │
  │                        │                          │                   │
  │<─(8)Show Success──────┤                          │                   │
  │   Message & Redirect   │                          │                   │
  │   to Login (3s)        │                          │                   │
  │                        │                          │                   │
  │<────────────────────(9)Email Received────────────────────────────────┤
  │   "Click to verify"    │                          │                   │
  │                        │                          │                   │
  ├──(10)Click Link──────────────────────────────────>│                   │
  │   /verify/:uid/:token  │                          │                   │
  │                        │                          │                   │
  │                        │                          ├──(11)Verify      │
  │                        │                          │   Token           │
  │                        │                          │                   │
  │                        │                          ├──(12)Activate    │
  │                        │                          │   (is_active=T)   │
  │                        │                          │                   │
  │<──(13)"Email Verified!"───────────────────────────┤                   │
  │                        │                          │                   │
  │                        │                          │                   │

┌─────────────────────────────────────────────────────────────────────┐
│                            LOGIN FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

User                    Frontend                    Backend          
  │                        │                          │               
  ├──(1)Enter Credentials>│                          │               
  │   email, password      │                          │               
  │                        │                          │               
  │                        ├──(2)POST /login/───────>│               
  │                        │   {email, password}      │               
  │                        │                          │               
  │                        │                          ├──(3)Validate 
  │                        │                          │   Credentials 
  │                        │                          │               
  │                        │                          ├──(4)Generate 
  │                        │                          │   JWT Tokens  
  │                        │                          │               
  │                        │<─(5)Return Tokens───────┤               
  │                        │   {access, refresh}      │               
  │                        │                          │               
  │                        ├──(6)Store Tokens        │               
  │                        │   localStorage           │               
  │                        │                          │               
  │                        ├──(7)GET /profile/──────>│               
  │                        │   (with access token)    │               
  │                        │                          │               
  │                        │<─(8)User Data───────────┤               
  │                        │   {id, name, role...}    │               
  │                        │                          │               
  │                        ├──(9)Store User Data     │               
  │                        │   localStorage           │               
  │                        │                          │               
  │<─(10)Redirect─────────┤                          │               
  │   Based on Role        │                          │               
  │   /student/dashboard   │                          │               
  │   or /owner/dashboard  │                          │               
  │                        │                          │               


┌─────────────────────────────────────────────────────────────────────┐
│                      TOKEN REFRESH FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

User Action            Frontend (Axios)              Backend          
     │                        │                          │               
     ├──(1)Make API Call────>│                          │               
     │                        │                          │               
     │                        ├──(2)Add Access Token    │               
     │                        │   in Header              │               
     │                        │                          │               
     │                        ├──(3)Send Request───────>│               
     │                        │                          │               
     │                        │                          ├──(4)Validate 
     │                        │                          │   Token       
     │                        │                          │               
     │                        │<─(5)401 Unauthorized────┤               
     │                        │   (Token Expired)        │               
     │                        │                          │               
     │                        ├──(6)Interceptor Catches │               
     │                        │   Error                  │               
     │                        │                          │               
     │                        ├──(7)POST /refresh/─────>│               
     │                        │   {refresh: token}       │               
     │                        │                          │               
     │                        │                          ├──(8)Validate 
     │                        │                          │   Refresh     
     │                        │                          │               
     │                        │<─(9)New Access Token────┤               
     │                        │   {access}               │               
     │                        │                          │               
     │                        ├──(10)Store New Token    │               
     │                        │   localStorage           │               
     │                        │                          │               
     │                        ├──(11)Retry Original─────>│               
     │                        │   Request with New Token │               
     │                        │                          │               
     │                        │<─(12)Success Response───┤               
     │<─(13)Data Received────┤                          │               
     │                        │                          │               
                                                                        
  IF Refresh Fails:                                                    
     │                        │                          │               
     │                        │<─X Error ────────────────┤               
     │                        │                          │               
     │                        ├──Clear All Tokens       │               
     │                        │   & User Data            │               
     │                        │                          │               
     │<─Redirect to Login────┤                          │               
     │                        │                          │               


┌─────────────────────────────────────────────────────────────────────┐
│                     PASSWORD RESET FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

User                    Frontend                    Backend            Email
  │                        │                          │                   │
  ├──(1)Click Forgot──────>│                          │                   │
  │   Password Link        │                          │                   │
  │                        │                          │                   │
  │                        ├──Navigate to            │                   │
  │                        │  /forgot-password        │                   │
  │                        │                          │                   │
  ├──(2)Enter Email───────>│                          │                   │
  │                        │                          │                   │
  │                        ├──(3)POST /reset-pwd/───>│                   │
  │                        │   {email}                │                   │
  │                        │                          │                   │
  │                        │                          ├──(4)Find User    │
  │                        │                          │                   │
  │                        │                          ├──(5)Generate     │
  │                        │                          │   Reset Token     │
  │                        │                          │                   │
  │                        │                          ├──(6)Send Email──>│
  │                        │                          │   with Link       │
  │                        │                          │                   │
  │                        │<─(7)Success Message─────┤                   │
  │<─(8)Show Success──────┤                          │                   │
  │   "Check your email"   │                          │                   │
  │                        │                          │                   │
  │<────────────────────(9)Email Received────────────────────────────────┤
  │   "Click to reset"     │                          │                   │
  │                        │                          │                   │
  ├──(10)Click Link──────────────────────────────────>│                   │
  │   /reset-pwd/:uid/:tkn │                          │                   │
  │                        │                          │                   │
  │                        ├──Page Loads with        │                   │
  │                        │  uid & token             │                   │
  │                        │                          │                   │
  ├──(11)Enter New────────>│                          │                   │
  │   Password             │                          │                   │
  │                        │                          │                   │
  │                        ├──(12)POST Reset────────>│                   │
  │                        │   {new_pwd, confirm,     │                   │
  │                        │    token, uid}           │                   │
  │                        │                          │                   │
  │                        │                          ├──(13)Validate    │
  │                        │                          │   Token           │
  │                        │                          │                   │
  │                        │                          ├──(14)Update      │
  │                        │                          │   Password        │
  │                        │                          │                   │
  │                        │<─(15)Success────────────┤                   │
  │<─(16)Show Success─────┤                          │                   │
  │   & Redirect to Login  │                          │                   │
  │   (3s)                 │                          │                   │
  │                        │                          │                   │
```

## 🏗️ Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          APP STRUCTURE                           │
└─────────────────────────────────────────────────────────────────┘

                            App.js
                               │
                ┌──────────────┼──────────────┐
                │              │              │
           HomePage        LoginPage      SignupPage
                │              │              │
                │              ├──LoginForm   ├──SignupForm
                │              ├──LoginHeader ├──SignupHeader
                │              └──LoginFooter └──SignupFooter
                │
                ├──────────────────────────────┐
                │                              │
         ProtectedRoute              ProtectedRoute
         (Student)                   (Owner)
                │                              │
         ┌──────┴────────┐            ┌───────┴────────┐
         │               │            │                │
  StudentDashboard  Bookings  OwnerDashboard  ManageHostels
                                               
                ├───────────────────────────────┐
                │                               │
         ProtectedRoute                  ForgotPasswordPage
         (Any User)                              │
                │                      ResetPasswordPage
         HostelLayout
                │
         ┌──────┴──────┬──────┬──────┬──────┐
         │             │      │      │      │
    Dashboard    Hostels Rooms Profile Reviews
                                │
                                ├──ChangePasswordModal
                                └──ProfilePictureUpload


┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER STRUCTURE                       │
└─────────────────────────────────────────────────────────────────┘

                         api/index.js
                        (Axios Instance)
                               │
                    ┌──────────┴──────────┐
                    │                     │
            Request Interceptor   Response Interceptor
                    │                     │
              Add JWT Token      Handle 401 & Refresh
                    │                     │
                    └──────────┬──────────┘
                               │
                          api/users.js
                      (Endpoint Functions)
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    registerUser         loginUser          getUserProfile
    refreshToken      updateUserProfile    changePassword
                     requestPasswordReset
                               │
                               │
                    services/userServices.js
                    (Business Logic Layer)
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    handleRegister      handleLogin         fetchUserProfile
    handleLogout       updateProfile       handleChangePassword
                    uploadProfilePicture
                               │
                               │
                          Components
                      (Use userServices)
```

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROFILE UPDATE FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Profile Component                                              Backend
       │                                                          │
       ├──(1) componentDidMount                                  │
       │                                                          │
       ├──(2) Call fetchUserProfile()                            │
       │          │                                               │
       │          └──GET /api/users/profile/──────────────────>  │
       │                                                          │
       │                                     (3) Return User Data │
       │          ┌──{profile data}────────────────────────────  │
       │          │                                               │
       ├──(4) setFormData(profile)                               │
       │     Show in Form                                         │
       │                                                          │
       │                                                          │
User Edits Name & Phone                                          │
       │                                                          │
       ├──(5) User clicks "Save"                                 │
       │                                                          │
       ├──(6) handleSubmit()                                     │
       │          │                                               │
       │          └──PUT /api/users/profile/──────────────────>  │
       │             {first_name, last_name, phone, city}        │
       │                                                          │
       │                                          (7) Validate    │
       │                                          (8) Update DB   │
       │                                          (9) Return Data │
       │          ┌──{updated profile}──────────────────────────  │
       │          │                                               │
       ├──(10) Update localStorage("user", data)                 │
       │                                                          │
       ├──(11) setMessage("Success!")                            │
       │                                                          │
       └──(12) User sees success message                         │


┌─────────────────────────────────────────────────────────────────┐
│                  PROFILE PICTURE UPLOAD FLOW                     │
└─────────────────────────────────────────────────────────────────┘

Profile Component                Backend              Cloudinary
       │                            │                      │
       ├──(1) User selects file     │                      │
       │                            │                      │
       ├──(2) Validate file         │                      │
       │     (size, type)           │                      │
       │                            │                      │
       ├──(3) uploadProfilePicture()│                      │
       │          │                 │                      │
       │          └──FormData────>  │                      │
       │             {profile_pic}  │                      │
       │                            │                      │
       │                            ├──(4) Upload──────>   │
       │                            │                      │
       │                            │   (5) Store Image    │
       │                            │   (6) Return URL     │
       │                            │<─────────────────    │
       │                            │                      │
       │                            ├──(7) Save public_id  │
       │                            │   to DB              │
       │                            │                      │
       │          ┌──{profile_pic   │                      │
       │          │   _url}─────────┤                      │
       │          │                 │                      │
       ├──(8) Update state          │                      │
       │     with new URL           │                      │
       │                            │                      │
       └──(9) Display new image     │                      │
```

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      JWT TOKEN SECURITY                          │
└─────────────────────────────────────────────────────────────────┘

                        User Logs In
                             │
                             ▼
                    Backend Generates:
                    ┌─────────────────┐
                    │  Access Token   │  (60 min lifetime)
                    │  Refresh Token  │  (7 days lifetime)
                    └─────────────────┘
                             │
                             ▼
                    Frontend Stores:
                    ┌─────────────────────────┐
                    │ localStorage:           │
                    │  - accessToken          │
                    │  - refreshToken         │
                    │  - user (non-sensitive) │
                    └─────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   API Request 1        API Request 2        API Request 3
        │                    │                    │
    Add Token            Add Token            Add Token
    in Header            in Header            in Header
        │                    │                    │
        ▼                    ▼                    ▼
  ✅ Valid            ❌ Expired             ✅ Valid
  Return Data         Auto Refresh          Return Data
                      & Retry


┌─────────────────────────────────────────────────────────────────┐
│                    ROUTE PROTECTION                              │
└─────────────────────────────────────────────────────────────────┘

        User tries to access /student/dashboard
                      │
                      ▼
              ProtectedRoute Checks:
              ┌──────────────────┐
              │ 1. Has Token?    │──No──> Redirect to /login
              └──────────────────┘
                      │ Yes
                      ▼
              ┌──────────────────┐
              │ 2. Correct Role? │──No──> Redirect to /
              └──────────────────┘
                      │ Yes
                      ▼
              ┌──────────────────┐
              │ Render Component │
              └──────────────────┘
```

## 📱 User Journey Map

```
NEW USER JOURNEY
═════════════════

Start → /signup → Fill Form → Register → Check Email → Verify → /login → Login → Dashboard


RETURNING USER JOURNEY
══════════════════════

Start → /login → Enter Creds → Login → Dashboard → Profile → Edit → Save → Success


FORGOT PASSWORD JOURNEY
═══════════════════════

Start → /login → "Forgot?" → /forgot-password → Enter Email → Check Email
                                   ↓
           /reset-password/:uid/:token ← Click Link ← Email
                                   ↓
                              New Password
                                   ↓
                               /login (redirect)
                                   ↓
                              Login → Dashboard


ROLE-BASED NAVIGATION
═════════════════════

Student Login → /student/dashboard
              → /student/bookings
              → /hostel/profile

Owner Login   → /owner/dashboard
              → /owner/hostels
              → /hostel/profile
```

## 🎯 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING CASCADE                       │
└─────────────────────────────────────────────────────────────────┘

                    API Request Made
                           │
                ┌──────────┴──────────┐
                │                     │
             Success               Error
                │                     │
        Return Data          Check Error Type
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              Network Error    Validation Error   Auth Error
                    │                │                │
             Show Generic    Show Field Errors   Check if 401
             "Network          Next to Fields         │
              Error"                              ┌───┴───┐
                                                  │       │
                                             First   Retry After
                                              Try    Refresh
                                                  │       │
                                              Refresh  Logout
                                               Token  & Redirect
                                                  │   to /login
                                           Try Original
                                            Request
                                              Again
```

This visual documentation should help you understand how all the pieces fit together! 📊✨

