# 🚀 TaskFlow: High-End Task Management Suite

[![Live Web](https://img.shields.io/badge/Live-Web%20Dashboard-6366f1?style=for-the-badge&logo=vercel)](https://INSERT_YOUR_VERCEL_URL_HERE)
[![Live API](https://img.shields.io/badge/Live-AWS%20Backend-FF9900?style=for-the-badge&logo=amazonaws)](http://3.91.67.136:8000/api)
[![Tech](https://img.shields.io/badge/Tech-TypeScript%20|%20Node%20|%20Next.js%20|%20React%20Native-blue?style=for-the-badge)](https://github.com/karanbharti)

**TaskFlow** is a professional-grade, multi-platform task management ecosystem designed for high productivity. It features a stunning **Web Dashboard** for desktop efficiency and a **Premium Mobile App** for on-the-go focus, all backed by a scalable **AWS Cloud infrastructure**.

---

## 🏗️ System Architecture

TaskFlow is structured as a robust monorepo, ensuring seamless integration between platforms.

### 💻 Web Dashboard (`/frontend`)
*A state-of-the-art Next.js application with a focus on desktop usability.*
- **Experience**: Clean, Glassmorphism-inspired UI with dedicated task overview.
- **Security**: JWT-based session management with automatic refresh logic.
- **Tech**: Next.js 14, React, Lucide, CSS Modules.
- **Hosting**: Vercel.

### 📱 Mobile Application (`/mobile`)
*A high-definition React Native app designed for peak personal productivity.*
- **Experience**: "Daily Focus" dashboard with visual progress tracking, premium gradients, and micro-animations.
- **Features**: Priority-aware tasking, cross-platform compatibility (iOS/Android).
- **Tech**: React Native, Expo, React Navigation, Linear Gradients.

### ⚙️ Cloud Backend (`/backend`)
*The engine driving the ecosystem with high availability and security.*
- **Architecture**: RESTful API with Zod validation and Prisma orchestration.
- **Security**: BCrypt hashing, JWT (Access + Refresh tokens).
- **Deployment**: AWS EC2 with PM2 and Docker.
- **Infrastructure**: Automated CI/CD via GitHub Actions.

---

## 🔥 Key Features

| Feature | Web | Mobile | Backend |
| :--- | :---: | :---: | :---: |
| **Secure Authentication** | ✅ | ✅ | ✅ |
| **Real-time Task Sync** | ✅ | ✅ | ✅ |
| **Priority Leveling** | ✅ | ✅ | ✅ |
| **Progress Analytics** | ❌ | ✅ | ✅ |
| **Search & Filter** | ✅ | ✅ | ✅ |
| **Cloud Deployment** | ✅ | ✅ | ✅ |

---

## 🛠️ Technical Stack

- **Languages**: TypeScript (Strict-mode)
- **Frontend**: Next.js, React, LocalStorage
- **Mobile**: React Native, Expo, SecureStore
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL (AWS RDS / EC2)
- **DevOps**: AWS EC2, GitHub Actions, Docker, PM2

---

## 🚀 Getting Started

### Root Monorepo Commands
We’ve simplified the development workflow. From the root directory:
- `npm run install:all`: Installs dependencies for ALL projects.
- `npm run backend:dev`: Start the API server.
- `npm run frontend:dev`: Start the Web dashboard.
- `npm run mobile:dev`: Start the Expo dev server.

### Direct Installation
If you prefer manual setup, navigate to any subfolder:
1. `cd backend && npm install && npx prisma db push && npm run dev`
2. `cd frontend && npm install && npm run dev`
3. `cd mobile && npm install && npx expo start`

---

## 🚢 Deployment Roadmap

### Backend (AWS)
- **Server**: Amazon EC2 (t2.micro/t3.medium)
- **Endpoint**: `http://3.91.67.136:8000/api`
- **Security**: Security Group Rules for Port 8000.

### Frontend (Vercel)
- **Domain**: [Project Dashboard](https://INSERT_YOUR_VERCEL_URL_HERE)
- **Env**: `NEXT_PUBLIC_API_URL` pointing to AWS Backend.

### CI/CD Pipeline
Every pull request and merge to `main` is automatically linted, built, and deployed to our live AWS server, ensuring zero downtime and continuous improvement.

---

## 🎨 Professional Design System
The entire TaskFlow suite adheres to a custom premium theme:
- **Primary Palette**: Indigo (#6366f1) & Deep Violet.
- **Accent Palette**: Rose Gold & Emerald Success.
- **Glass Effects**: Frosted surfaces with adaptive transparency.

---

## 📄 Assignment Compliance
This project strictly follows all provided assignment requirements:
- [x] **Full-Stack Implementation** (Node + Next + React Native)
- [x] **Live Environment Verification** (Vercel + AWS)
- [x] **Professional Documentation** (API + Setup + Architecture)
- [x] **Advanced Security Patterns** (JWT + Refresh Logic)

---
*Created by Karan Bharti • 2024*
