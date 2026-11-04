# Skillora – Online Course Application

<div align="center">

### Learn. Grow. Achieve.

A React-based online learning platform where users can discover courses, manage their learning journey, and access personalized learning features, while administrators manage the learning marketplace.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Skillora-172554?style=for-the-badge&logo=vercel&logoColor=white)](https://lms-ai-project.vercel.app/)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?style=flat&logo=reactrouter&logoColor=white)](https://reactrouter.com/)

**Live Website:** https://lms-ai-project.vercel.app/

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Project Objectives](#project-objectives)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Application Workflow](#application-workflow)
- [Authentication and Authorization](#authentication-and-authorization)
- [State Management](#state-management)
- [Project Architecture](#project-architecture)
- [API Integration](#api-integration)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Application Screenshots](#application-screenshots)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## About the Project

**Skillora – Online Course Application** is a web-based learning platform designed to make online education easier and more accessible.

The application provides a centralized platform where learners can explore courses, register for an account, activate their accounts, log in, access learning-related features, and manage their profiles.

It also provides administrative functionality to manage courses, users, orders, notifications, analytics, and other marketplace-related operations.

The frontend is developed using **React 19 and Vite**, with API integration for communication with the backend services.

The application follows a component-based architecture, uses React Context API for shared state management, and implements role-based frontend route protection.

### Live Application

Explore the deployed application:

**[Visit Skillora – Live Application](https://lms-ai-project.vercel.app/)**

---

## Project Objectives

The main objectives of this project are:

- Build a responsive and user-friendly online learning platform.
- Implement user registration, account activation, and login.
- Integrate frontend components with backend APIs.
- Manage authentication and user sessions.
- Implement role-based access for users and administrators.
- Provide course discovery and course management functionality.
- Use Context API to manage shared application data.
- Create reusable React components and maintain a structured codebase.

---

## Key Features

### 1. User Authentication

- User registration with name, email, and password.
- Account activation using a six-digit activation code.
- Secure login flow using authentication tokens.
- Session management using React Context API and browser local storage.
- Protected frontend routes for authenticated users.

### 2. Course Management

- Browse available courses.
- Search and filter courses.
- View individual course details.
- Access course curriculum and lecture pages.
- Create, edit, and delete courses through administrative functionality.

### 3. User Dashboard and Learning

- My Learning section.
- Course progress and learning-related information.
- Course and lecture navigation.
- Learning progress-related API integration.
- Wishlist and certificate-related functionality exposed through LMS services.

### 4. Admin Dashboard

- User management.
- Course management.
- Order management.
- Analytics and dashboard information.
- Notification management.
- Site layout management.
- LMS administration functionality.

### 5. Profile Management

- View profile information.
- Update user details.
- Select and upload a profile picture.
- Display the profile avatar in the navigation bar.
- Maintain profile information across application components through shared authentication state.

### 6. Instructor Functionality

- Instructor course management.
- Course creation and editing.
- Lecture management.
- Course submission for review.
- Student and revenue-related information.
- Instructor analytics.

### 7. Marketplace and Payment Integration

- Course marketplace functionality.
- Course search and category browsing.
- Wishlist and review-related features.
- Coupon validation.
- Stripe browser checkout integration when configured.

### 8. Responsive User Interface

- Responsive navigation.
- Consistent page layouts.
- Responsive course cards and images.
- Mobile, tablet, and desktop styling.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| JavaScript ES6+ | Application logic |
| React 19 | Component-based UI development |
| Vite 8 | Development server and build tool |
| React Router DOM 7 | Routing and navigation |
| Axios | API communication |
| React Context API | Global state management |
| React Hooks | Component state and lifecycle logic |
| CSS Modules | Component-level styling |
| React Hot Toast | User notifications |
| Stripe.js | Browser-side payment integration |
| ESLint | Code quality and linting |
| Git and GitHub | Version control and source management |
| Vercel | Application deployment |

---

## Application Workflow

The application follows this general workflow:

### Step 1: Registration

A new user enters their name, email address, and password.

The frontend validates the form and sends the registration information to the registration API.

### Step 2: Account Activation

After successful registration, activation details are passed to the activation page.

The user enters the six-digit activation code, which is submitted to the activation API.

### Step 3: Login

After account activation, the user can log in using their registered email and password.

When login is successful, the frontend stores the authentication information and updates the application login state.

### Step 4: User Access

Authenticated users can access the relevant learning and profile functionality.

They can browse courses, view course details, access learning-related pages, and manage their profile.

### Step 5: Admin Access

Users with an administrator role can access administrative pages.

Administrators can manage users, courses, orders, analytics, notifications, and marketplace-related information through the available admin functionality.

### Step 6: Course Management

Course-related operations communicate with the backend APIs through service modules.

The application supports course listing, course details, course content, and administrative course operations.

---

## Authentication and Authorization

Authentication is managed through a dedicated React Context.

The application uses:

- `AuthContext` to manage authentication state.
- `useAuth` custom hook to access authentication information.
- `localStorage` to persist authentication information in the browser.
- Axios interceptors to attach authentication information to API requests.
- `ProtectedRoute` to control access to protected frontend routes.
- `PublicRoute` to handle navigation for authenticated users.

### Role-Based Access

The frontend distinguishes between normal users and administrators.

Administrator roles include:

- `admin`
- `administrator`

The application uses these roles to control access to administrative routes.

**Note:** Frontend route protection is not a replacement for backend authorization. Protected API operations must also be validated by the backend.

---

## State Management

The project uses React Context API to share data across different components.

### Main Context Providers

| Context | Responsibility |
|---|---|
| `AuthContext` | Authentication state, user information, login, logout, and profile updates |
| `CourseContext` | Public courses, admin courses, course details, course content, and course operations |
| `LmsAdminContext` | LMS administration data, courses, orders, enrollments, instructors, categories, and analytics |

### React Hooks Used

- `useState` – Manage component and form state.
- `useEffect` – Handle side effects and data fetching.
- `useContext` – Access shared context data.
- `useCallback` – Memoize callback functions.
- `useMemo` – Memoize computed values.
- Custom hooks – Reuse application logic.

---

## Project Architecture

The project follows a modular folder structure to separate UI components, pages, API services, contexts, hooks, and application configuration.

### Main Folder Structure

```text
online-shop-application/
│
├── public/
│
├── src/
│   ├── api/
│   │   ├── axiosInstance.js
│   │   └── interceptors.js
│   │
│   ├── app/
│   │   ├── App.jsx
│   │   └── providers.jsx
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── common/
│   │   └── Navbar.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── LmsAdminContext.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── pages/
│   │   ├── Courses/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── marketplace/
│   │   └── profile/
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── services/
│   │   ├── authServices.js
│   │   ├── courseService.jsx
│   │   ├── adminService.jsx
│   │   ├── profileService.js
│   │   ├── analyticsService.js
│   │   ├── dashboardService.jsx
│   │   ├── lmsService.js
│   │   ├── lmsAdminService.js
│   │   ├── marketplaceService.js
│   │   ├── orderService.js
│   │   ├── notificationService.js
│   │   └── layoutService.js
│   │
│   ├── state-mgmt/
│   │   └── CourseContext.jsx
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── Spinner.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
└── README.md
```

### Important Directories

| Directory | Description |
|---|---|
| `components/` | Reusable UI components |
| `pages/` | Application pages and screens |
| `pages/auth/` | Registration, activation, and login |
| `pages/admin/` | Administrative dashboard and management pages |
| `pages/profile/` | User profile settings |
| `context/` | Global authentication and LMS state |
| `hooks/` | Reusable React hooks |
| `services/` | API service functions |
| `api/` | Axios configuration and interceptors |
| `routes/` | Application route definitions and route guards |
| `state-mgmt/` | Shared course state management |
| `styles/` | Global and shared styling |

---

## API Integration

The frontend communicates with backend services using Axios and selected direct `fetch()` requests.

### API Configuration

The shared Axios configuration is maintained in:

```text
src/api/axiosInstance.js
```

The application also uses:

```text
src/api/interceptors.js
```

These files help manage API requests and authentication information.

### Main API Service Modules

| Service File | Responsibility |
|---|---|
| `authServices.js` | Registration, activation, and login |
| `courseService.jsx` | Course-related API operations |
| `profileService.js` | Profile updates |
| `adminService.jsx` | User and admin operations |
| `dashboardService.jsx` | Dashboard data |
| `analyticsService.js` | Analytics information |
| `lmsService.js` | LMS and learner operations |
| `lmsAdminService.js` | LMS administration |
| `marketplaceService.js` | Marketplace operations |
| `orderService.js` | Order management |
| `notificationService.js` | Notification operations |
| `layoutService.js` | Site layout management |

### Main Authentication API Endpoints

| Method | Endpoint |
|---|---|
| POST | `/auth/register` |
| POST | `/auth/activate-user` |
| POST | `/auth/login` |
| PUT | `/auth/update-user-info` |

Other API operations include course management, user administration, LMS learning, instructor management, orders, analytics, notifications, and profile updates.

The exact endpoints and request formats are maintained in the respective service files.

---

## Installation and Setup

Follow these steps to run the project locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/kutcharlapatiprasanna-svg/lms-ai-project.git
```

### 2. Navigate to the Project Folder

```bash
cd lms-ai-project
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal. The current Vite configuration uses port `5177`.

### 5. Create a Production Build

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

---

## Environment Configuration

The project reads the following environment variable for browser-side Stripe checkout configuration:

| Variable | Purpose |
|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for the checkout interface |

Create a `.env` file in the project root if this integration is required:

```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Never place Stripe secret keys, passwords, or private API credentials in frontend environment variables.

The frontend API routing is configured through `vite.config.js` and `vercel.json`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production build |
| `npm run preview` | Previews the production build |
| `npm run lint` | Runs ESLint to check code quality |

---

## Application Screenshots

Screenshots can be added here to demonstrate the actual application interface.

Suggested screenshots:

### Home Page

_Add your home page screenshot here._

### Course Listing Page

_Add your course listing screenshot here._

### Registration and Login

_Add your authentication screenshots here._

### User Profile

_Add your profile settings screenshot here._

### Admin Dashboard

_Add your admin dashboard screenshot here._

---

## Future Enhancements

Possible improvements for future versions include:

- Add automated testing for important user workflows.
- Improve accessibility across the application.
- Add advanced course recommendations.
- Improve learning progress visualization.
- Enhance API error handling and validation.
- Add more detailed project and API documentation.
- Improve application performance and loading times.

---

## Author

**Prasanna**

Online Course Application – Skillora

Developed using React, Vite, JavaScript, and modern frontend technologies.

### Connect

- **GitHub:** [kutcharlapatiprasanna-svg](https://github.com/kutcharlapatiprasanna-svg)
- **Live Project:** [Skillora – Online Course Application](https://lms-ai-project.vercel.app/)

---

<div align="center">

### Thank you for visiting Skillora!

**Learn something new. Build something meaningful.**

[**Open Live Application →**](https://lms-ai-project.vercel.app/)

</div>
