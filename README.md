# 🏫 Springfield Academy — Student Management System

A modern, full-featured **School Student Management System** built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Manage students, track attendance, update marks, and visualize performance — all from a beautiful, responsive dashboard.

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Pages & Modules](#-pages--modules)
  - [Dashboard](#-dashboard)
  - [Students](#-students)
  - [Attendance](#-attendance)
  - [Marks & Grades](#-marks--grades)
- [Screenshots](#-screenshots)
- [Configuration](#-configuration)
- [Build & Deployment](#-build--deployment)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- ✅ **Student CRUD** — Add, view, edit, and delete student records
- ✅ **Attendance Tracking** — Mark and manage daily attendance with status options (Present, Absent, Late, Excused)
- ✅ **Marks Management** — Add, update, and view marks per subject per exam type
- ✅ **Interactive Dashboard** — Real-time statistics, charts, and performance analytics

### User Experience
- 🎨 **Modern UI** — Clean, gradient-rich design with rounded cards, shadows, and smooth transitions
- 📱 **Fully Responsive** — Desktop table views convert to card layouts on mobile
- 🗂️ **Collapsible Sidebar** — Full sidebar navigation with expand/collapse and tooltips
- 🔍 **Search & Filter** — Real-time search with multi-criteria filtering on every page
- 🧭 **Breadcrumb Navigation** — Clear navigation context in the top header
- 🔔 **Notification Bell** — UI-ready notification indicator

### Data & Analytics
- 📊 **Attendance Trend Chart** — Visual bar chart showing last 7 days of attendance
- 🏆 **Top Performers** — Ranked list of top 5 students by GPA
- 📈 **Subject Performance** — Horizontal progress bars with color-coded averages
- 📉 **Grade Distribution** — Cards showing student count per grade level
- 🎯 **Status Distribution** — Progress bars for Active/Inactive/Graduated/Suspended

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **TypeScript 5** | Type safety and developer experience |
| **Vite 7** | Fast build tool and dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **clsx** | Conditional class name utility |
| **tailwind-merge** | Smart Tailwind class merging |
| **vite-plugin-singlefile** | Bundle output into a single HTML file |

---

## 📁 Project Structure

```
├── index.html                    # Entry HTML file
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
├── README.md                     # This file
│
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Root component with state & routing
    ├── index.css                 # Tailwind CSS import
    │
    ├── types/
    │   └── student.ts            # TypeScript interfaces & constants
    │
    ├── data/
    │   └── sampleStudents.ts     # Sample data (students, attendance, marks)
    │
    ├── utils/
    │   └── cn.ts                 # Utility for merging class names
    │
    ├── components/
    │   ├── Sidebar.tsx           # Collapsible sidebar navigation
    │   ├── Header.tsx            # Page header (legacy)
    │   ├── SearchAndFilter.tsx   # Search bar + filter dropdowns
    │   ├── StudentTable.tsx      # Student data table (desktop + mobile)
    │   ├── StudentForm.tsx       # Add/Edit student modal form
    │   ├── StudentDetail.tsx     # Student detail view modal
    │   └── ConfirmDialog.tsx     # Delete confirmation dialog
    │
    └── pages/
        ├── DashboardPage.tsx     # Dashboard with stats & charts
        ├── StudentsPage.tsx      # Student management page
        ├── AttendancePage.tsx    # Attendance tracking page
        └── MarksPage.tsx         # Marks & grades management page
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn/pnpm)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/springfield-academy-sms.git
cd springfield-academy-sms

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 📄 Pages & Modules

### 📊 Dashboard

The dashboard provides a comprehensive overview of the school's performance metrics:

- **4 Stat Cards** — Total Students, Attendance Rate, Average GPA, Average Marks
- **Attendance Trend** — Bar chart visualizing attendance rates over the last 7 school days
- **Student Status Distribution** — Progress bars showing Active, Inactive, Graduated, and Suspended counts
- **Grade Distribution** — Cards showing how many students are in each grade (9th–12th)
- **🏆 Top Performers** — Ranked list of top 5 students by GPA with avatar and grade info
- **📊 Subject Performance** — Color-coded horizontal bar charts showing average marks per subject

---

### 👨‍🎓 Students

Full CRUD student management with a polished UI:

- **Add Student** — Modal form with validation (name, email format, age/GPA range, required fields)
- **Edit Student** — Pre-populated form for updating existing records
- **View Detail** — Beautiful modal with gradient header, avatar, and organized info cards
- **Delete Student** — Confirmation dialog before deletion
- **Search** — Real-time search by name or email
- **Filters** — Filter by grade (9th–12th) and status (Active/Inactive/Graduated/Suspended)
- **Responsive Layout** — Table view on desktop, card layout on mobile

**Student Data Model:**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `firstName` | `string` | Student's first name |
| `lastName` | `string` | Student's last name |
| `email` | `string` | School email address |
| `grade` | `string` | Grade level (9th–12th) |
| `age` | `number` | Student's age (5–25) |
| `gender` | `enum` | Male, Female, or Other |
| `enrollmentDate` | `string` | Date of enrollment |
| `address` | `string` | Home address |
| `parentPhone` | `string` | Parent/guardian phone |
| `status` | `enum` | Active, Inactive, Graduated, Suspended |
| `gpa` | `number` | Grade Point Average (0.0–4.0) |
| `avatar` | `string` | Initials for avatar display |

---

### 📋 Attendance

Daily attendance tracking with edit mode and bulk actions:

- **Date Picker** — Select any date to view or mark attendance
- **Stats Bar** — Present, Absent, Late, Excused counts for the selected date
- **Edit Mode** — Click "Mark Attendance" to enter edit mode with per-student status buttons
- **Quick Actions** — "Mark All Present" / "Mark All Absent" buttons for bulk operations
- **Per-Student Buttons** — Choose Present, Absent, Late, or Excused for each student
- **Overall Rate** — Each student shows their cumulative attendance percentage
- **Filters** — Search by name and filter by grade
- **Color Coding** — Green (Present), Red (Absent), Amber (Late), Blue (Excused)

**Attendance Statuses:**

| Status | Color | Description |
|---|---|---|
| ✅ Present | Green | Student attended class |
| ❌ Absent | Red | Student was absent |
| ⏰ Late | Amber | Student arrived late |
| 📝 Excused | Blue | Excused absence (medical, etc.) |

---

### 📝 Marks & Grades

Comprehensive marks management with inline editing:

- **Overview Stats** — Average, Highest, Lowest marks, and Pass Rate
- **Student Cards** — Expandable cards showing all subjects and exams
- **Inline Editing** — Click the edit icon → modify marks → save
- **Add/Update Modal** — Add new marks for any student/subject/exam combination
- **Letter Grades** — Automatic grading: A+ (90+), A (80+), B (70+), C (60+), D (50+), F (<50)
- **Progress Bars** — Visual percentage indicators with color coding
- **Filters** — Filter by student, subject, and exam type

**Subjects (8):**

| Subject |
|---|
| Mathematics |
| English |
| Science |
| History |
| Geography |
| Computer Science |
| Physical Education |
| Art |

**Exam Types (5):**

| Exam Type |
|---|
| Mid-Term |
| Final |
| Quiz 1 |
| Quiz 2 |
| Assignment |

**Grading Scale:**

| Percentage | Grade | Color |
|---|---|---|
| 90–100% | A+ | 🟢 Emerald |
| 80–89% | A | 🟢 Emerald |
| 70–79% | B | 🔵 Blue |
| 60–69% | C | 🟡 Amber |
| 50–59% | D | 🟠 Orange |
| 0–49% | F | 🔴 Red |

---

## 🖼 Screenshots

### Sidebar Navigation
- **Expanded** — Full sidebar with labels, school branding, and student count widget
- **Collapsed** — Compact icon-only sidebar with hover tooltips
- **Mobile** — Overlay sidebar with backdrop blur

### Dashboard View
- Stat cards with gradient icons
- Attendance trend bar chart
- Student status distribution
- Top performers leaderboard
- Subject performance analysis

### Student Management
- Clean data table with hover-reveal actions
- Add/Edit modal with form validation
- Detail view modal with gradient avatar header

### Attendance Tracking
- Date-based attendance grid
- Color-coded status buttons in edit mode
- Attendance rate indicators per student

### Marks & Grades
- Student-wise expandable mark cards
- Inline editing with save/cancel
- Visual progress bars and letter grades

---

## ⚙ Configuration

### Sample Data

The app ships with **8 sample students** with pre-generated attendance and marks data. The sample data is generated in `src/data/sampleStudents.ts`:

- **Attendance**: Randomly generated for the last 20 school days (weighted 75% Present)
- **Marks**: Generated for all 8 subjects × 2 exams (Mid-Term, Final) per student

To modify the sample data, edit the `sampleStudents.ts` file.

### Adding New Grades

To add new grade levels, update the following files:
1. `src/components/SearchAndFilter.tsx` — Add option to grade filter dropdown
2. `src/components/StudentForm.tsx` — Add option to grade select
3. `src/pages/AttendancePage.tsx` — Add option to grade filter

### Adding New Subjects or Exams

Update the constants in `src/types/student.ts`:

```typescript
export const SUBJECTS = [
  'Mathematics',
  'English',
  // ... add new subjects here
] as const;

export const EXAMS = [
  'Mid-Term',
  'Final',
  // ... add new exam types here
] as const;
```

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

This generates a single-file output in the `dist/` directory using `vite-plugin-singlefile`, meaning everything (HTML, CSS, JS) is bundled into a single `dist/index.html` file.

### Preview

```bash
npm run preview
```

### Deployment

Since the build output is a single HTML file, you can deploy it to:

- **Static hosting** — Netlify, Vercel, GitHub Pages, Cloudflare Pages
- **CDN** — Upload `dist/index.html` to any CDN
- **Local** — Open `dist/index.html` directly in a browser

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for Springfield Academy<br/>
  <sub>React · TypeScript · Vite · Tailwind CSS</sub>
</p>