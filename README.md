# 🚴 The Green Rides

**A Smart Cycle Rental Platform for Educational Institutions**

The Green Rides is a modern, eco-friendly cycle rental system designed specifically for students and educational institutions. The platform provides a comprehensive multi-platform solution with a **React web application for administrators**, a **React Native mobile app for students and guards**, and a robust **Node.js backend API**. The system enables seamless bike rentals through QR code scanning, making sustainable transportation accessible and convenient for campus life.

---

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🎯 User Roles](#-user-roles)
- [📱 Platform Screenshots](#-platform-screenshots)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🚀 Getting Started](#-getting-started)
- [📋 API Documentation](#-api-documentation)
- [🔐 Authentication & Security](#-authentication--security)
- [🌍 Environment Variables](#-environment-variables)
- [🧪 Testing](#-testing)
- [📈 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)

---

## 🌟 Overview

The Green Rides addresses the growing need for sustainable transportation solutions in educational institutions. By providing an easy-to-use digital platform for cycle rentals, we promote eco-friendly commuting while reducing traffic congestion on campus.

### 🎯 Problem Statement

- Limited transportation options for students within campus
- Need for eco-friendly transportation alternatives
- Manual cycle rental processes are time-consuming and inefficient
- Lack of real-time tracking for cycle availability and usage

### 💡 Solution

A comprehensive multi-platform digital ecosystem that enables:

- **📱 Mobile-First Experience**: React Native app for students and guards with QR code scanning
- **🖥️ Web Admin Portal**: React web application for administrators with complete system management
- **⚡ Unified Backend**: Node.js API serving both mobile and web applications
- **🔐 Multi-Role Access Control**: Different interfaces for students, guards, and administrators
- **📊 Real-time Synchronization**: Live updates across all platforms
- **🚀 Cross-Platform Compatibility**: Android mobile app with planned iOS support

---

## ✨ Key Features

### � **Mobile Application (React Native)**

_For Students & Guards_

- **QR Code Scanner**: Built-in camera integration for cycle rentals and returns
- **Real-time Cycle Browser**: View available cycles with location and status
- **Rental Tracking**: Track current rentals with duration and location
- **Profile Management**: Update personal information and change passwords
- **Push Notifications**: Get alerts for rental status and system updates
- **Offline Support**: Basic functionality available without internet connection

### �️ **Web Administration Portal (React)**

_For Administrators_

- **Comprehensive Dashboard**: System overview with analytics and key metrics
- **User Management**: Add, edit, disable students, guards, and finance admins
- **Cycle Fleet Management**: Monitor, add, and maintain cycle inventory
- **Financial Oversight**: Track fines, payments, and revenue analytics
- **System Reports**: Generate detailed usage and performance reports
- **Role-based Access**: Different permission levels for various admin roles

### ⚡ **Backend API (Node.js)**

_Powering Both Platforms_

- **RESTful Architecture**: Clean API design with standardized endpoints
- **Real-time Synchronization**: Live updates across all connected clients
- **Advanced Security**: JWT authentication, rate limiting, and data validation
- **Scalable Database**: MongoDB with optimized queries and indexing
- **Email Integration**: Automated notifications and OTP verification
- **Comprehensive Logging**: Detailed audit trails and error tracking

### � **Security & Authentication**

- **Multi-platform JWT**: Secure token-based authentication across web and mobile
- **Google OAuth Integration**: Quick login with Google accounts
- **Role-based Permissions**: Granular access control for different user types
- **Data Encryption**: Secure password hashing and sensitive data protection
- **Rate Limiting**: API protection against abuse and DDoS attacks
- **Input Validation**: Comprehensive data sanitization and validation

---

## 🎯 User Roles & Platforms

### 👨‍🎓 **Student** _(Mobile App)_

**Primary Users - React Native Mobile Application**

**Platform Access:** Android Mobile App _(iOS Coming Soon)_

**Capabilities:**

- Register using Google OAuth
- Rent available cycles by scanning QR codes
- View current rental status
- Update profile information
- Change password securely

**User Journey:**

1. Login with Google account
2. Navigate to rental page
3. Scan QR code on desired cycle
4. Confirm rental
5. Use cycle for transportation
6. Return to guard when done

---

### 🛡️ **Guard**

**Cycle Return Management**

**Capabilities:**

- Scan QR codes to process cycle returns
- Monitor cycle status in real-time
- Handle multiple return requests
- View return history

**User Journey:**

1. Login to guard dashboard
2. Navigate to return page
3. Scan returned cycle's QR code
4. Confirm cycle condition
5. Complete return process

---

### 👨‍💼 **Administrator**

**Complete System Management**

**Capabilities:**

- **User Management:**
  - Add new students and guards
  - Remove users from system
  - Monitor user activities
- **Cycle Management:**
  - Add new cycles to fleet
  - Remove damaged/old cycles
  - Monitor cycle status and location
- **System Oversight:**
  - View platform analytics
  - Manage system configurations
  - Handle support requests

---

## 📱 Platform Screenshots

### 🏠 **Landing & Authentication**

#### Login Screen

![alt text](./platform/loginScreen.png)

Features shown:

- Clean, intuitive login interface
- Google OAuth button
- reCAPTCHA integration
- Responsive design

---

#### Registration Process

![alt text](./platform/registerScreen.png)

Features shown:

- Google account information pre-fill
- Role selection
- Terms and conditions acceptance

---

### 👨‍🎓 **Student Dashboard**

#### Student Profile

_[Screenshot Placeholder: Student dashboard overview]_

Features shown:

- Current rental status
- Profile information
- Quick access to rental function
- Recent activity history

---

#### QR Code Scanner (Student)

_[Screenshot Placeholder: QR scanning interface for rentals]_

Features shown:

- Camera view for QR scanning
- Scan confirmation dialog
- Error handling for invalid codes
- Rental success confirmation

---

#### Rental Confirmation

_[Screenshot Placeholder: Successful rental confirmation screen]_

Features shown:

- Cycle details
- Rental timestamp
- Expected return instructions
- Contact information for support

---

### 🛡️ **Guard Interface**

#### Guard Dashboard

_[Screenshot Placeholder: Guard control panel]_

Features shown:

- Return processing interface
- Active rentals overview
- Quick scan functionality
- Daily activity summary

---

#### QR Code Scanner (Guard)

_[Screenshot Placeholder: Guard QR scanning interface for returns]_

Features shown:

- Return-specific scanning interface
- Cycle condition assessment
- Return confirmation process
- Batch return capabilities

---

### 👨‍💼 **Admin Panel**

#### Admin Dashboard

![alt text](./platform/adminDashboard.png)

Features shown:

- User statistics
- Cycle fleet status
- System health metrics
- Quick action buttons

---

#### User Management

![alt text](./platform/studentManagement.png)
![alt text](./platform/guardManagement.png)
![alt text](./platform/financeAdminManagement.png)

Features shown:

- User list with roles
- Add/remove user functionality
- User activity monitoring
- Role management tools

---

#### Cycle Management

![alt text](./platform/cycleManagement.png)

Features shown:

- Cycle inventory overview
- Add/remove cycle functionality
- Cycle status tracking
- Maintenance scheduling

---

## 🏗️ System Architecture

### **Multi-Platform Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE GREEN RIDES ECOSYSTEM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 MOBILE APP (React Native)          🖥️ WEB PORTAL (React)   │
│  ├── Student Interface                  ├── Admin Dashboard      │
│  ├── Guard Interface                    ├── User Management      │
│  ├── QR Scanner Integration             ├── Cycle Management     │
│  ├── Real-time Updates                  ├── Financial Reports    │
│  └── Offline Capabilities               └── System Analytics     │
│                                                                 │
│              ↕️ HTTPS/REST API ↕️                               │
│                                                                 │
│  🔧 BACKEND API (Node.js + Express)                            │
│  ├── JWT Authentication & Authorization                         │
│  ├── Role-based Access Control (RBAC)                          │
│  ├── RESTful API Endpoints (/auth, /cycles, /rentals, /users)  │
│  ├── Business Logic Services                                   │
│  ├── Email & Notification Services                             │
│  ├── QR Token Management                                       │
│  └── Security Middleware (Rate Limiting, CORS, Helmet)         │
│                                                                 │
│              ↕️ Mongoose ODM ↕️                                 │
│                                                                 │
│  🗄️ DATABASE (MongoDB)                                         │
│  ├── Users Collection (Students, Guards, Admins)               │
│  ├── Cycles Collection (Fleet Data, QR Codes, Status)          │
│  ├── Rentals Collection (Transaction Records, History)         │
│  ├── QRTokens Collection (Temporary Scan Tokens)               │
│  └── Audit Logs (System Events, Security Logs)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Mobile App Architecture (React Native)**

```
Mobile Frontend (React Native 0.81.0)
├── 🔐 Authentication Layer
│   ├── JWT Token Management (AsyncStorage)
│   ├── Google OAuth Integration
│   └── Biometric Authentication (Planned)
├── 🧭 Navigation System
│   ├── Stack Navigation (React Navigation 7.x)
│   ├── Bottom Tab Navigation
│   └── Role-based Route Protection
├── 📊 State Management
│   ├── Redux Toolkit Store
│   ├── Auth Slice (User State)
│   ├── Cycle Slice (Fleet State)
│   └── Rental Slice (Transaction State)
├── 📱 Core Features
│   ├── QR Code Scanner (react-native-camera)
│   ├── Real-time API Integration (Axios)
│   ├── Push Notifications (Planned)
│   └── Offline Data Persistence
└── 🎨 UI Components
    ├── Custom Button Components
    ├── Loading Spinners & Modals
    ├── Responsive Layouts
    └── Material Design Theme
```

### **Web Portal Architecture (React)**

```
Web Frontend (React 18.3.1 + Vite 5.4.8)
├── 🔐 Authentication Layer
│   ├── JWT Token Management
│   ├── Google OAuth (@react-oauth/google)
│   └── reCAPTCHA Protection
├── 🧭 Routing & Navigation
│   ├── React Router DOM (5.3.4)
│   ├── Protected Routes by Role
│   └── Admin-only Access Control
├── 📊 State Management
│   ├── React Context API
│   ├── AuthContext (User Sessions)
│   ├── ToastContext (Notifications)
│   └── ConfirmationContext (Modals)
├── 📈 Admin Features
│   ├── Dashboard Analytics (Recharts)
│   ├── Data Tables (Custom Components)
│   ├── User Management Interface
│   ├── Cycle Fleet Management
│   └── Financial Reporting
└── 🎨 UI/UX Components
    ├── Responsive Layout System
    ├── Modal Management System
    ├── Form Validation
    └── Custom CSS Styling
```

### **Backend API Architecture (Node.js)**

```
Backend API (Node.js + Express 4.18.2)
├── 🔒 Security Layer
│   ├── Helmet (Security Headers)
│   ├── CORS (Cross-Origin Requests)
│   ├── Rate Limiting (15min/100req)
│   └── Input Validation & Sanitization
├── 🔐 Authentication & Authorization
│   ├── JWT Middleware (jsonwebtoken 9.0.2)
│   ├── Password Hashing (bcryptjs 2.4.3)
│   ├── Role-based Access Control
│   └── Google OAuth Verification
├── 📡 API Endpoints
│   ├── /api/auth (Login, Register, Refresh)
│   ├── /api/users (CRUD, Profile Management)
│   ├── /api/cycles (Fleet Management, Status)
│   ├── /api/rentals (Rental Logic, History)
│   └── /api/qr (QR Token Generation/Validation)
├── 🏗️ Service Layer
│   ├── AuthService (User Management)
│   ├── CycleService (Fleet Operations)
│   ├── RentalService (Transaction Logic)
│   ├── QRTokenService (QR Management)
│   └── EmailService (Notifications)
└── 🗄️ Database Layer
    ├── MongoDB Connection (Mongoose 7.6.1)
    ├── Schema Validation
    ├── Index Optimization
    └── Transaction Support
```

### **Database Schema Design (MongoDB)**

```
MongoDB Collections & Relationships:

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│      Users      │    │      Cycles      │    │     Rentals     │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ _id (ObjectId)  │◄──┐│ _id (ObjectId)   │◄──┐│ _id (ObjectId)  │
│ name            │   ││ cycleId (String) │   ││ userId (Ref)    │
│ email (unique)  │   ││ qrCode (String)  │   ││ cycleId (Ref)   │
│ rollNo          │   ││ status (enum)    │   ││ startTime       │
│ phone           │   ││ location (enum)  │   ││ endTime         │
│ role (enum)     │   ││ condition        │   ││ duration        │
│ status (enum)   │   ││ batteryLevel     │   ││ fine            │
│ fine (Number)   │   ││ lastMaintenance  │   ││ status (enum)   │
│ location (enum) │   ││ totalRides       │   ││ guardId (Ref)   │
│ profilePicture  │   ││ avgRating        │   ││ rating          │
│ createdAt       │   ││ isAvailable      │   ││ feedback        │
│ updatedAt       │   ││ createdAt        │   ││ createdAt       │
└─────────────────┘   ││ updatedAt        │   ││ updatedAt       │
                      │└──────────────────┘   │└─────────────────┘
                      │                       │
┌─────────────────┐   │  ┌──────────────────┐│
│    QRTokens     │   │  │   System Logs    ││
├─────────────────┤   │  ├──────────────────┤│
│ _id (ObjectId)  │   │  │ _id (ObjectId)   ││
│ cycleId (Ref)   │───┘  │ userId (Ref)     ││
│ token (String)  │      │ action (String)  ││
│ guardId (Ref)   │──────┤ details (Object) ││
│ purpose (enum)  │      │ ipAddress        ││
│ isUsed (Boolean)│      │ userAgent        ││
│ expiresAt       │      │ timestamp        ││
│ createdAt       │      │ level (enum)     ││
└─────────────────┘      └──────────────────┘
```

---

## 🛠️ Technology Stack

### **📱 Mobile Application (React Native)**

| Technology                    | Purpose                 | Version |
| ----------------------------- | ----------------------- | ------- |
| **React Native**              | Mobile Framework        | 0.81.0  |
| **React**                     | UI Library              | 19.1.0  |
| **React Navigation**          | Navigation System       | 7.1.17  |
| **Redux Toolkit**             | State Management        | 2.8.2   |
| **React Redux**               | React-Redux Integration | 9.2.0   |
| **AsyncStorage**              | Local Storage           | 1.21.0  |
| **React Native Camera**       | QR Code Scanning        | 4.2.1   |
| **React Native Vector Icons** | Icon System             | 10.3.0  |
| **React Native SVG**          | SVG Support             | 15.12.1 |
| **React Native QRCode SVG**   | QR Code Generation      | 6.3.15  |
| **Axios**                     | HTTP Client             | 1.11.0  |
| **JWT Decode**                | Token Management        | 4.0.0   |

### **🖥️ Web Application (React)**

| Technology                 | Purpose                 | Version |
| -------------------------- | ----------------------- | ------- |
| **React**                  | UI Framework            | 18.3.1  |
| **Vite**                   | Build Tool & Dev Server | 5.4.8   |
| **React Router DOM**       | Client-side Routing     | 5.3.4   |
| **Axios**                  | HTTP Client             | 1.7.7   |
| **@zxing/library**         | QR Code Scanning        | 0.21.3  |
| **React Google reCAPTCHA** | Bot Protection          | 3.1.0   |
| **@react-oauth/google**    | Google Authentication   | 0.12.2  |
| **React Icons**            | Icon Library            | 5.5.0   |
| **Recharts**               | Data Visualization      | 3.1.2   |
| **JWT Decode**             | Token Management        | 3.1.2   |

### **⚡ Backend API (Node.js)**

| Technology             | Purpose               | Version |
| ---------------------- | --------------------- | ------- |
| **Node.js**            | Runtime Environment   | LTS     |
| **Express.js**         | Web Framework         | 4.18.2  |
| **MongoDB**            | NoSQL Database        | Latest  |
| **Mongoose**           | MongoDB ODM           | 7.6.1   |
| **JWT**                | Authentication Tokens | 9.0.2   |
| **bcryptjs**           | Password Hashing      | 2.4.3   |
| **CORS**               | Cross-Origin Requests | 2.8.5   |
| **Helmet**             | Security Headers      | 7.1.0   |
| **Express Rate Limit** | API Rate Limiting     | 7.1.5   |
| **Nodemailer**         | Email Service         | 6.9.7   |
| **dotenv**             | Environment Variables | 16.3.1  |

### **🗄️ Database & Storage**

| Technology       | Purpose              | Usage                      |
| ---------------- | -------------------- | -------------------------- |
| **MongoDB**      | Primary Database     | User data, cycles, rentals |
| **AsyncStorage** | Mobile Local Storage | JWT tokens, offline data   |
| **File System**  | File Storage         | Profile pictures, QR codes |

### **🔒 Security & Authentication**

| Technology           | Purpose                  | Implementation              |
| -------------------- | ------------------------ | --------------------------- |
| **JWT**              | Stateless Authentication | Bearer tokens               |
| **Google OAuth 2.0** | Social Login             | Web & Mobile authentication |
| **bcryptjs**         | Password Security        | Salted password hashing     |
| **Helmet**           | HTTP Security Headers    | XSS, CSRF protection        |
| **CORS**             | Cross-Origin Security    | Controlled resource sharing |
| **Rate Limiting**    | DDoS Protection          | 100 requests/15 minutes     |
| **reCAPTCHA**        | Bot Protection           | Human verification          |

### **🛠️ Development & DevOps**

| Tool/Technology    | Purpose              | Usage                    |
| ------------------ | -------------------- | ------------------------ |
| **Git**            | Version Control      | Source code management   |
| **VS Code**        | IDE                  | Development environment  |
| **ESLint**         | Code Linting         | Code quality enforcement |
| **Prettier**       | Code Formatting      | Consistent code style    |
| **Babel**          | JavaScript Compiler  | ES6+ to ES5 compilation  |
| **Metro**          | React Native Bundler | Mobile app bundling      |
| **Gradle**         | Android Build Tool   | Android app compilation  |
| **Android Studio** | Android Development  | Android SDK management   |
| **npm/yarn**       | Package Management   | Dependency management    |

### **📊 Analytics & Monitoring**

| Technology           | Purpose             | Implementation         |
| -------------------- | ------------------- | ---------------------- |
| **Recharts**         | Data Visualization  | Admin dashboard charts |
| **Console Logging**  | Debug Information   | Development debugging  |
| **Error Boundaries** | Error Handling      | React error catching   |
| **MongoDB Logs**     | Database Monitoring | Query performance logs |

### **🌐 Platform Support**

| Platform    | Status                  | Technology Stack           |
| ----------- | ----------------------- | -------------------------- |
| **Android** | ✅ **Production Ready** | React Native + Android SDK |
| **iOS**     | 🔄 **Planned**          | React Native + iOS SDK     |
| **Web**     | ✅ **Production Ready** | React + Vite               |
| **Desktop** | 📋 **Future Feature**   | Electron (Planned)         |

---

## ⚙️ Installation & Setup

### **🔧 Prerequisites**

#### **System Requirements**

- **Node.js** (v18+ LTS recommended)
- **MongoDB** (local installation or cloud instance)
- **Git** for version control
- **npm** or **yarn** package manager

#### **For Mobile Development (Android)**

- **Java JDK 17** (required for Android builds)
- **Android Studio** with Android SDK
- **Android SDK Build-Tools 33+**
- **Android Emulator** or physical Android device

#### **Development Environment**

- **VS Code** (recommended IDE)
- **MongoDB Compass** (database GUI, optional)
- **Postman** (API testing, optional)

---

### **📥 1. Clone Repository**

```bash
git clone https://github.com/harshitpandey-dev/The-Green-Rides.git
cd The-Green-Rides
```

---

### **🔧 2. Backend API Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Configure your environment variables (see Environment Variables section)
# Edit .env file with your MongoDB URI, JWT secret, etc.

# Start MongoDB service (if running locally)
# Windows: net start MongoDB
# macOS: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongod

# Start backend server in development mode
npm run dev

# Backend will be available at http://localhost:5000
```

#### **Backend Environment Variables (.env)**

```env
# Database
MONGO_URI=mongodb://localhost:27017/green-rides

# JWT Secret (generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URLs (for CORS)
FRONTEND_URLs=http://localhost:3000,http://localhost:5173,http://localhost:19006

# Email Configuration (for OTP and notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

### **🖥️ 3. Web Frontend Setup**

```bash
# Navigate to web frontend directory
cd web-frontend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Configure environment variables
# Edit .env file with your API endpoint and Google OAuth credentials

# Start development server
npm run dev

# Web application will be available at http://localhost:5173
```

#### **Web Frontend Environment Variables (.env)**

```env
# API Configuration
VITE_API_ENDPOINT=http://localhost:5000/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Google reCAPTCHA Configuration
VITE_GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

---

### **📱 4. Mobile App Setup (Android)**

#### **Step 1: Android Development Environment**

```powershell
# Install required tools (Windows - using Chocolatey)
choco install -y nodejs-lts microsoft-openjdk17

# Download and install Android Studio from:
# https://developer.android.com/studio

# Set environment variables (Windows)
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.x.x.x-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

#### **Step 2: Create Android Virtual Device**

1. Open Android Studio
2. Go to **Tools → AVD Manager**
3. Click **Create Virtual Device**
4. Select **Pixel 4** or similar device
5. Choose **API Level 33+** system image
6. Configure AVD settings and create

#### **Step 3: Mobile App Installation**

```bash
# Navigate to mobile frontend directory
cd mobile-frontend

# Install dependencies
npm install

# Create local.properties file for Android
echo "sdk.dir=C:\\Users\\{YourUsername}\\AppData\\Local\\Android\\Sdk" > android/local.properties

# Accept Android licenses
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager --licenses

# Start Metro bundler in one terminal
npx react-native start

# In a new terminal, run the Android app
npx react-native run-android

# Mobile app will install and launch on your Android emulator/device
```

**For detailed Android setup instructions, see:** [`mobile-frontend/ANDROID_SETUP.md`](mobile-frontend/ANDROID_SETUP.md)

---

### **🚀 5. Quick Start Guide**

#### **Option A: Full Development Setup**

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Web Frontend
cd web-frontend && npm run dev

# Terminal 3: Start Mobile App (optional)
cd mobile-frontend && npx react-native start

# Terminal 4: Run Android App (optional)
cd mobile-frontend && npx react-native run-android
```

#### **Option B: Backend + Web Only**

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Web Frontend
cd web-frontend && npm run dev

# Access at http://localhost:5173
```

#### **Option C: Backend + Mobile Only**

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Mobile App
cd mobile-frontend && npx react-native run-android

# Mobile app connects to backend at localhost:5000
```

---

### **🌍 6. Application Access Points**

| Platform              | URL/Access Method                | Default Port | Primary Users                  |
| --------------------- | -------------------------------- | ------------ | ------------------------------ |
| **Web Admin Portal**  | `http://localhost:5173`          | 5173         | Administrators, Finance Admins |
| **Mobile App**        | Android APK                      | N/A          | Students, Guards               |
| **Backend API**       | `http://localhost:5000`          | 5000         | Both platforms                 |
| **API Documentation** | `http://localhost:5000/api-docs` | 5000         | Developers                     |

---

### **📋 7. Verification Checklist**

Before proceeding with development, ensure:

- [ ] ✅ Backend server running on port 5000
- [ ] ✅ MongoDB connection established
- [ ] ✅ Web frontend accessible at localhost:5173
- [ ] ✅ Mobile app installs and launches (if developing mobile features)
- [ ] ✅ Environment variables configured correctly
- [ ] ✅ Google OAuth credentials set up (if using authentication)
- [ ] ✅ reCAPTCHA keys configured (if using web frontend)

---

### **🆘 Troubleshooting**

#### **Common Backend Issues**

```bash
# MongoDB connection issues
# Ensure MongoDB is running and connection string is correct

# Port already in use
netstat -ano | findstr :5000
# Kill process: taskkill /PID <process_id> /F

# Dependencies issues
rm -rf node_modules package-lock.json
npm install
```

#### **Common Frontend Issues**

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Port conflicts
# Change port in vite.config.mjs or package.json
```

#### **Common Mobile Issues**

```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Restart ADB
adb kill-server && adb start-server
```

For detailed mobile troubleshooting, see [`mobile-frontend/ANDROID_SETUP.md`](mobile-frontend/ANDROID_SETUP.md)

---

## 🚀 Getting Started

### **For Students**

1. **Registration**: Use your institutional Google account to register
2. **Find a Cycle**: Locate an available cycle on campus
3. **Scan QR Code**: Use the app to scan the cycle's QR code
4. **Enjoy Your Ride**: The cycle is now rented to you
5. **Return**: Find a guard to scan the QR code when returning

### **For Guards**

1. **Login**: Use provided credentials to access guard interface
2. **Return Processing**: Scan QR codes when students return cycles
3. **Monitor Status**: Keep track of cycle conditions and availability

### **For Administrators**

1. **System Access**: Login with admin credentials
2. **User Management**: Add/remove students and guards
3. **Fleet Management**: Add new cycles, remove damaged ones
4. **Monitor Analytics**: Track system usage and performance

---

## 📋 API Documentation

The Green Rides backend provides a comprehensive RESTful API that powers both the web and mobile applications. All endpoints are secured with JWT authentication and role-based access control.

### **🔐 Authentication Endpoints**

_Base URL: `/api/auth`_

| Method | Endpoint           | Description             | Access Level | Request Body                                             |
| ------ | ------------------ | ----------------------- | ------------ | -------------------------------------------------------- |
| `POST` | `/register`        | User registration       | Public       | `{name, email, rollNo, phone, password, role, location}` |
| `POST` | `/login`           | User login              | Public       | `{email, password}`                                      |
| `POST` | `/google-auth`     | Google OAuth login      | Public       | `{googleToken, role}`                                    |
| `POST` | `/forgot-password` | Request password reset  | Public       | `{email}`                                                |
| `POST` | `/reset-password`  | Reset password with OTP | Public       | `{email, otp, newPassword}`                              |
| `POST` | `/change-password` | Change password         | Protected    | `{currentPassword, newPassword}`                         |
| `PUT`  | `/update-profile`  | Update user profile     | Protected    | `{name, phone, profilePicture}`                          |

### **👥 User Management Endpoints**

_Base URL: `/api/users`_

| Method   | Endpoint           | Description              | Access Level | Roles         |
| -------- | ------------------ | ------------------------ | ------------ | ------------- |
| `GET`    | `/me`              | Get current user profile | Protected    | All           |
| `GET`    | `/`                | Get all users            | Protected    | `super_admin` |
| `POST`   | `/student`         | Create new student       | Protected    | `super_admin` |
| `POST`   | `/guard`           | Create new guard         | Protected    | `super_admin` |
| `POST`   | `/finance-admin`   | Create finance admin     | Protected    | `super_admin` |
| `PUT`    | `/:id`             | Update user              | Protected    | `super_admin` |
| `DELETE` | `/:id`             | Delete user              | Protected    | `super_admin` |
| `GET`    | `/dashboard/stats` | User statistics          | Protected    | `super_admin` |

### **🚲 Cycle Management Endpoints**

_Base URL: `/api/cycles`_

| Method   | Endpoint           | Description          | Access Level | Roles                  |
| -------- | ------------------ | -------------------- | ------------ | ---------------------- |
| `GET`    | `/`                | Get all cycles       | Public       | -                      |
| `GET`    | `/available`       | Get available cycles | Protected    | All                    |
| `GET`    | `/dashboard/stats` | Cycle statistics     | Protected    | `super_admin`, `guard` |
| `POST`   | `/`                | Create new cycle     | Protected    | `super_admin`          |
| `PUT`    | `/:id`             | Update cycle         | Protected    | `super_admin`, `guard` |
| `DELETE` | `/:id`             | Delete cycle         | Protected    | `super_admin`          |
| `PUT`    | `/:id/status`      | Update cycle status  | Protected    | `super_admin`, `guard` |
| `PUT`    | `/:id/maintenance` | Mark for maintenance | Protected    | `guard`                |

### **🚴 Rental Management Endpoints**

_Base URL: `/api/rentals`_

| Method | Endpoint     | Description              | Access Level | Roles                  |
| ------ | ------------ | ------------------------ | ------------ | ---------------------- |
| `GET`  | `/`          | Get all rentals          | Protected    | `super_admin`          |
| `GET`  | `/active`    | Get active rentals       | Protected    | `guard`, `super_admin` |
| `POST` | `/`          | Create new rental        | Protected    | `student`              |
| `PUT`  | `/`          | Complete rental (return) | Protected    | `student`, `guard`     |
| `GET`  | `/getByUser` | Get user's rentals       | Protected    | All                    |
| `GET`  | `/history`   | Get rental history       | Protected    | All                    |
| `POST` | `/rating`    | Add cycle rating         | Protected    | `student`              |
| `GET`  | `/stats`     | Get student statistics   | Protected    | `student`              |

### **📱 QR Code Management Endpoints**

_Base URL: `/api/qr`_

| Method | Endpoint           | Description          | Access Level | Roles              |
| ------ | ------------------ | -------------------- | ------------ | ------------------ |
| `POST` | `/generate`        | Generate QR token    | Protected    | `guard`            |
| `POST` | `/scan`            | Scan and validate QR | Protected    | `student`, `guard` |
| `GET`  | `/validate/:token` | Validate QR token    | Protected    | All                |

---

### **📝 Request/Response Examples**

#### **User Registration**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "rollNo": 2021001,
  "phone": "+1234567890",
  "password": "securePassword123",
  "role": "student",
  "location": "east_campus"
}

# Response
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "64f...",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### **Login**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}

# Response
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "64f...",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiJs..."
}
```

#### **Create Rental**

```bash
POST /api/rentals
Authorization: Bearer eyJhbGciOiJIUzI1NiJs...
Content-Type: application/json

{
  "cycleId": "64f7a1b2c3d4e5f6789a"
}

# Response
{
  "success": true,
  "message": "Rental created successfully",
  "rental": {
    "id": "64f...",
    "userId": "64f...",
    "cycleId": "64f...",
    "startTime": "2024-01-15T10:30:00Z",
    "status": "active"
  }
}
```

#### **Get Available Cycles**

```bash
GET /api/cycles/available
Authorization: Bearer eyJhbGciOiJIUzI1NiJs...

# Response
{
  "success": true,
  "cycles": [
    {
      "id": "64f...",
      "cycleId": "GR001",
      "qrCode": "GR001_QR_CODE",
      "status": "available",
      "location": "east_campus",
      "batteryLevel": 85,
      "condition": "good",
      "isAvailable": true
    }
  ],
  "total": 15
}
```

---

### **🔒 Authentication Headers**

All protected endpoints require JWT authentication:

```bash
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### **📊 Error Response Format**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400
}
```

### **📈 Rate Limiting**

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 10 requests per 5 minutes per IP
- **QR Operations**: 50 requests per 10 minutes per user

### **🔍 Status Codes**

| Code  | Description           |
| ----- | --------------------- |
| `200` | Success               |
| `201` | Created               |
| `400` | Bad Request           |
| `401` | Unauthorized          |
| `403` | Forbidden             |
| `404` | Not Found             |
| `409` | Conflict              |
| `429` | Too Many Requests     |
| `500` | Internal Server Error |

---

## 🔐 Authentication & Security

### **OAuth Integration**

- Google OAuth 2.0 for secure authentication
- No password storage for OAuth users
- Institutional email verification

### **JWT Security**

- Secure token-based authentication
- Automatic token expiration
- Refresh token mechanism

### **Data Protection**

- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting on API endpoints

### **Role-Based Access**

- Three-tier access control (Student/Guard/Admin)
- Protected routes based on user roles
- API endpoint authorization

---

## 🌍 Environment Variables

The Green Rides application requires environment variables for all three platforms. Create `.env` files in each directory based on the `.env.example` templates.

### **🔧 Backend Environment Variables**

_File: `backend/.env`_

```env
# ===============================
# DATABASE CONFIGURATION
# ===============================
# MongoDB connection string (local or cloud)
MONGO_URI=mongodb://localhost:27017/green-rides
# Alternative for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/green-rides

# ===============================
# AUTHENTICATION & SECURITY
# ===============================
# JWT secret key (generate a strong, random secret)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-32-chars-minimum

# Server configuration
PORT=5000
NODE_ENV=development

# ===============================
# CROSS-ORIGIN RESOURCE SHARING
# ===============================
# Frontend URLs allowed to access the API (comma-separated)
FRONTEND_URLs=http://localhost:3000,http://localhost:5173,http://localhost:19006

# ===============================
# EMAIL SERVICE CONFIGURATION
# ===============================
# Email service for OTP and notifications
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# ===============================
# GOOGLE OAUTH 2.0 CREDENTIALS
# ===============================
# Get these from Google Cloud Console
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console

# ===============================
# BUSINESS LOGIC CONFIGURATION
# ===============================
# Fine rate per minute (in currency units)
FINE_RATE_PER_MINUTE=1

# Maximum fine amount for students
STUDENT_FINE_LIMIT=500

# QR token expiry time in seconds
QR_TOKEN_EXPIRY_SECONDS=30

# Cycle maintenance thresholds
MAINTENANCE_RATING_THRESHOLD=2.5
MAINTENANCE_USAGE_THRESHOLD=50

# ===============================
# SECURITY SETTINGS
# ===============================
# Rate limiting configurations (optional - defaults in code)
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Max requests per window
```

### **🖥️ Web Frontend Environment Variables**

_File: `web-frontend/.env`_

```env
# ===============================
# API CONFIGURATION
# ===============================
# Backend API base URL
VITE_API_ENDPOINT=http://localhost:5000/api

# For production deployment:
# VITE_API_ENDPOINT=https://your-backend-domain.com/api

# ===============================
# GOOGLE SERVICES
# ===============================
# Google OAuth 2.0 Client ID (same as backend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Google reCAPTCHA site key
VITE_GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# ===============================
# APPLICATION SETTINGS
# ===============================
# App environment
VITE_NODE_ENV=development

# App title and branding (optional)
VITE_APP_TITLE=Green Rides Admin Portal
VITE_APP_VERSION=2.0.0

# ===============================
# DEVELOPMENT SETTINGS
# ===============================
# Enable debug mode (shows detailed error messages)
VITE_DEBUG_MODE=true

# Enable mock data (for development without backend)
VITE_ENABLE_MOCK_DATA=false
```

### **📱 Mobile App Configuration**

_File: `mobile-frontend/src/config/config.js`_

```javascript
// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: __DEV__
    ? "http://10.0.2.2:5000/api" // Android emulator
    : "https://your-backend-domain.com/api", // Production

  // Alternative for physical device testing:
  // BASE_URL: 'http://192.168.1.100:5000/api',  // Replace with your local IP

  TIMEOUT: 10000, // Request timeout in milliseconds

  // Google OAuth (if implementing)
  GOOGLE_CLIENT_ID: "your-google-client-id-here",
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: "Green Rides",
  VERSION: "1.0.0",

  // QR Scanner settings
  QR_SCANNER_TIMEOUT: 30000, // 30 seconds

  // Cache settings
  CACHE_DURATION: 300000, // 5 minutes

  // Notification settings
  ENABLE_PUSH_NOTIFICATIONS: true,
};
```

### **🔐 Obtaining Required Credentials**

#### **Google OAuth 2.0 Setup**

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create a new project** or select existing one
3. **Enable Google+ API** and **OAuth 2.0**
4. **Create OAuth 2.0 credentials**:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173/auth/callback`
5. **Copy Client ID and Secret** to your `.env` files

#### **Google reCAPTCHA Setup**

1. **Go to reCAPTCHA Admin**: https://www.google.com/recaptcha/admin
2. **Register a new site**:
   - reCAPTCHA type: v2 "I'm not a robot"
   - Domains: `localhost`, `your-domain.com`
3. **Copy site key** to `VITE_GOOGLE_RECAPTCHA_SITE_KEY`

#### **MongoDB Setup Options**

**Option 1: Local MongoDB**

```bash
# Install MongoDB locally and use:
MONGO_URI=mongodb://localhost:27017/green-rides
```

**Option 2: MongoDB Atlas (Cloud)**

```bash
# Create free cluster at https://cloud.mongodb.com
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/green-rides
```

#### **Email Service Setup (Gmail)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Google Account → Security → App Passwords
   - Select app: Mail, Select device: Other
   - Use generated password in `EMAIL_PASS`

### **🛡️ Security Best Practices**

#### **Environment Variable Security**

- ✅ **Never commit `.env` files** to version control
- ✅ **Use different secrets** for development and production
- ✅ **Generate strong JWT secrets** (minimum 32 characters)
- ✅ **Rotate secrets regularly** in production
- ✅ **Use environment-specific URLs** and configurations

#### **JWT Secret Generation**

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online tool: https://generate-secret.now.sh/32
```

#### **Production Environment Variables**

```env
# Production backend .env
NODE_ENV=production
MONGO_URI=mongodb+srv://prod-user:secure-password@prod-cluster.mongodb.net/green-rides
FRONTEND_URLs=https://admin.greenrides.com,https://app.greenrides.com
JWT_SECRET=your-production-jwt-secret-64-characters-long-random-string
```

### **📋 Environment Variables Checklist**

#### **Backend**

- [ ] ✅ `MONGO_URI` - MongoDB connection string
- [ ] ✅ `JWT_SECRET` - Strong, random secret key
- [ ] ✅ `PORT` - Server port (default: 5000)
- [ ] ✅ `NODE_ENV` - Environment (development/production)
- [ ] ✅ `EMAIL_USER` & `EMAIL_PASS` - Email service credentials
- [ ] ✅ `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials

#### **Web Frontend**

- [ ] ✅ `VITE_API_ENDPOINT` - Backend API URL
- [ ] ✅ `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] ✅ `VITE_GOOGLE_RECAPTCHA_SITE_KEY` - reCAPTCHA site key

#### **Mobile App**

- [ ] ✅ API base URL configured in config files
- [ ] ✅ Google OAuth client ID (if implementing)
- [ ] ✅ Network security configuration for HTTP (development only)

---

## 🧪 Testing

### **📱 Mobile App Testing**

```bash
# Navigate to mobile frontend
cd mobile-frontend

# Run Jest unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test files
npm test -- LoginScreen.test.js

# Run tests in watch mode (for development)
npm test -- --watch
```

### **🖥️ Web Frontend Testing**

```bash
# Navigate to web frontend
cd web-frontend

# Run test suite
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific component tests
npm test -- DataTable.test.js

# Run tests in watch mode
npm test -- --watch
```

### **⚡ Backend API Testing**

```bash
# Navigate to backend
cd backend

# Run all API tests
npm test

# Run specific test suites
npm test -- --grep "Auth Controller"
npm test -- --grep "Cycle Management"
npm test -- --grep "Rental System"

# Run tests with coverage
npm test -- --coverage

# Run integration tests
npm run test:integration
```

### **🔄 End-to-End Testing**

```bash
# Full system testing (all platforms)
npm run test:e2e

# Test specific user journeys
npm run test:student-journey
npm run test:admin-workflow
npm run test:guard-operations
```

### **📊 Manual Testing Scenarios**

#### **Student Workflow Testing**

1. Register new student account
2. Login via mobile app
3. Browse available cycles
4. Rent a cycle via QR scan
5. Complete rental process
6. View rental history

#### **Admin Workflow Testing**

1. Login to web portal
2. Add new cycles to fleet
3. Create student/guard accounts
4. View dashboard analytics
5. Generate system reports

#### **Guard Workflow Testing**

1. Login via mobile app
2. Process cycle returns
3. Update cycle conditions
4. Handle maintenance requests

---

## 📈 Future Enhancements

### **🎯 Immediate Roadmap (Next 3 Months)**

#### **Phase 1: iOS Support**

- [ ] **iOS App Development** - React Native iOS compatibility
- [ ] **App Store Submission** - iOS app store deployment
- [ ] **Cross-platform Testing** - Ensure feature parity

#### **Phase 2: Enhanced Features**

- [ ] **GPS Tracking Integration** - Real-time cycle location
- [ ] **Push Notifications** - Rental reminders and alerts
- [ ] **Offline Mode Enhancement** - Better offline capabilities
- [ ] **Biometric Authentication** - Fingerprint/Face ID login

### **🚀 Medium-term Goals (6 Months)**

#### **Smart Features**

- [ ] **AI-powered Cycle Assignment** - Optimal cycle suggestions
- [ ] **Predictive Maintenance** - AI-based maintenance scheduling
- [ ] **Usage Analytics Dashboard** - Advanced reporting and insights
- [ ] **Dynamic Pricing Model** - Demand-based pricing system

#### **Integration Enhancements**

- [ ] **Payment Gateway Integration** - Online payments and billing
- [ ] **University ERP Integration** - Student database sync
- [ ] **Campus Map Integration** - Interactive campus navigation
- [ ] **Weather API Integration** - Weather-based recommendations

### **🌟 Long-term Vision (12 Months)**

#### **Advanced Technology Integration**

- [ ] **IoT Smart Locks** - Automated locking/unlocking
- [ ] **Blockchain Tracking** - Immutable rental records
- [ ] **AR Navigation** - Augmented reality cycle finding
- [ ] **Voice Assistant Support** - Voice-controlled operations

#### **Sustainability Features**

- [ ] **Carbon Footprint Tracking** - Environmental impact monitoring
- [ ] **Green Rewards System** - Sustainability gamification
- [ ] **Solar Charging Stations** - Renewable energy integration
- [ ] **Route Optimization** - Eco-friendly route suggestions

### **📊 Business Expansion**

#### **Multi-Campus Support**

- [ ] **Multi-tenant Architecture** - Support multiple institutions
- [ ] **Campus-specific Customization** - Branded interfaces
- [ ] **Inter-campus Transfers** - Cross-campus cycle sharing
- [ ] **Franchise Management** - Scalable business model

#### **Advanced Analytics**

- [ ] **Machine Learning Insights** - Usage pattern analysis
- [ ] **Predictive Modeling** - Demand forecasting
- [ ] **Performance Optimization** - System efficiency improvements
- [ ] **Business Intelligence** - Advanced reporting suite

### **🛠️ Technical Improvements**

#### **Infrastructure Enhancements**

- [ ] **Microservices Architecture** - Scalable system design
- [ ] **Container Orchestration** - Docker/Kubernetes deployment
- [ ] **Auto-scaling Infrastructure** - Cloud-native architecture
- [ ] **Global CDN Implementation** - Worldwide performance optimization

#### **Security Enhancements**

- [ ] **Advanced Encryption** - End-to-end data encryption
- [ ] **Multi-factor Authentication** - Enhanced security layers
- [ ] **Audit Trail System** - Comprehensive activity logging
- [ ] **Penetration Testing** - Regular security assessments

#### **Performance Optimizations**

- [ ] **Progressive Web App** - Offline-first web experience
- [ ] **Advanced Caching** - Redis/Memcached integration
- [ ] **Database Optimization** - Query performance improvements
- [ ] **Real-time Synchronization** - WebSocket implementation

### **📱 Platform Expansion**

#### **Additional Platforms**

- [ ] **Desktop Application** - Electron-based desktop app
- [ ] **Smart Watch Integration** - Apple Watch/Wear OS support
- [ ] **Web3 Integration** - Cryptocurrency payment options
- [ ] **API Ecosystem** - Third-party developer platform

---

## 🤝 Contributing

We welcome contributions from the community! The Green Rides is an open-source project aimed at promoting sustainable transportation in educational institutions.

### **🚀 Getting Started**

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/The-Green-Rides.git
   cd The-Green-Rides
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Set up development environment** (see Installation & Setup)
5. **Make your changes** and test thoroughly
6. **Commit your changes**:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request** with detailed description

### **📋 Contribution Guidelines**

#### **Code Standards**

- **ESLint & Prettier**: Follow existing linting rules
- **TypeScript**: Use TypeScript for new React Native components
- **Comments**: Add JSDoc comments for functions and components
- **Testing**: Write unit tests for new features (min 80% coverage)
- **Naming**: Use descriptive names for variables and functions

#### **Commit Message Format**

```
type(scope): short description

Longer description if needed

Fixes #123
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

#### **Pull Request Process**

- Ensure all tests pass (`npm test`)
- Update documentation for new features
- Add screenshots for UI changes
- Reference issue numbers in PR description
- Request review from maintainers

### **🎯 Areas for Contribution**

#### **🐛 Bug Fixes**

- Fix authentication issues
- Resolve QR scanner problems
- Address performance bottlenecks
- Handle edge case scenarios

#### **✨ New Features**

- Implement push notifications
- Add dark mode support
- Create advanced analytics
- Build payment integration

#### **📚 Documentation**

- Improve setup instructions
- Add API documentation
- Create video tutorials
- Write developer guides

#### **🎨 UI/UX Enhancements**

- Improve mobile app design
- Enhance web dashboard
- Create better loading states
- Design responsive layouts

#### **⚡ Performance Optimizations**

- Optimize database queries
- Implement caching strategies
- Reduce bundle sizes
- Improve loading times

#### **🧪 Testing & Quality**

- Increase test coverage
- Add integration tests
- Create E2E test scenarios
- Implement accessibility testing

### **🏗️ Development Setup for Contributors**

#### **Frontend Development**

```bash
# Web frontend
cd web-frontend
npm install
npm run dev

# Mobile frontend
cd mobile-frontend
npm install
npx react-native run-android
```

#### **Backend Development**

```bash
cd backend
npm install
npm run dev

# Run with nodemon for auto-restart
npm run dev
```

#### **Full Stack Development**

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Web Frontend
cd web-frontend && npm run dev

# Terminal 3: Mobile App
cd mobile-frontend && npx react-native run-android
```

### **🐛 Reporting Issues**

When reporting bugs, please include:

- **Environment details** (OS, Node version, browser)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots or error logs**
- **Code samples** (if applicable)

### **� Feature Requests**

For new feature suggestions:

- **Check existing issues** first
- **Describe the problem** you're solving
- **Provide mockups** or examples
- **Consider implementation** complexity
- **Discuss with maintainers** before large changes

### **📞 Getting Help**

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Email**: harshitpandey.dev@gmail.com for urgent matters

---

## 🏆 Project Team

### **�👨‍💻 Core Development Team**

**Harshit Pandey** - _Lead Full Stack Developer & Project Founder_

- 🌐 GitHub: [@harshitpandey-dev](https://github.com/harshitpandey-dev)
- 💼 LinkedIn: [Harshit Pandey](https://linkedin.com/in/harshitpandey-dev)
- 📧 Email: harshitpandey.dev@gmail.com
- 🔧 Expertise: React, React Native, Node.js, MongoDB, Mobile Development

### **🤝 Contributors**

We appreciate all contributors who have helped make The Green Rides better!

[Contributor list will be automatically generated from GitHub contributions]

### **🙏 Acknowledgments**

- **Educational Institution Partners** - For testing and feedback
- **Open Source Community** - For amazing libraries and tools
- **Beta Testers** - For helping us improve the user experience
- **Design Community** - For UI/UX inspiration and assets

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **License Summary**

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 📊 Project Statistics

![GitHub Stars](https://img.shields.io/github/stars/harshitpandey-dev/The-Green-Rides?style=social)
![GitHub Forks](https://img.shields.io/github/forks/harshitpandey-dev/The-Green-Rides?style=social)
![GitHub Issues](https://img.shields.io/github/issues/harshitpandey-dev/The-Green-Rides)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/harshitpandey-dev/The-Green-Rides)

![License](https://img.shields.io/github/license/harshitpandey-dev/The-Green-Rides)
![Version](https://img.shields.io/github/package-json/v/harshitpandey-dev/The-Green-Rides)
![Last Commit](https://img.shields.io/github/last-commit/harshitpandey-dev/The-Green-Rides)

---

## 🌍 Join the Green Revolution

**The Green Rides** is more than just a cycle rental system - it's a movement towards sustainable transportation and a greener future for educational institutions worldwide.

### **Our Mission**

To make eco-friendly transportation accessible, convenient, and smart for students and educational communities globally.

### **Our Vision**

A world where every campus has a thriving, sustainable transportation ecosystem powered by technology and community engagement.

---

**🚴‍♂️ Ready to ride towards a sustainable future? [Get Started](#️-installation--setup) today!**

**Made with ❤️ for a greener tomorrow** 🌱

---

_Last Updated: September 29, 2025_
_Version: 2.0.0_
