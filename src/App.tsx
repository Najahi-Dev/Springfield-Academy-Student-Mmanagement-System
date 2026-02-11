import { useState } from 'react';
import { Student, AttendanceRecord, SubjectMark, Page } from './types/student';
import { sampleStudents, sampleAttendance, sampleMarks } from './data/sampleStudents';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { MarksPage } from './pages/MarksPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(sampleAttendance);
  const [marks, setMarks] = useState<SubjectMark[]>(sampleMarks);

  // Student handlers
  const handleAddStudent = (data: Omit<Student, 'id' | 'avatar'>) => {
    const newStudent: Student = {
      ...data,
      id: Date.now().toString(),
      avatar: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleEditStudent = (id: string, data: Omit<Student, 'id' | 'avatar'>) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...data,
              avatar: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
            }
          : s
      )
    );
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage students={students} attendance={attendance} marks={marks} />;
      case 'students':
        return (
          <StudentsPage
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'attendance':
        return (
          <AttendancePage
            students={students}
            attendance={attendance}
            onUpdateAttendance={setAttendance}
          />
        );
      case 'marks':
        return (
          <MarksPage
            students={students}
            marks={marks}
            onUpdateMarks={setMarks}
          />
        );
      default:
        return <DashboardPage students={students} attendance={attendance} marks={marks} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        studentCount={students.length}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden sm:block">
                <nav className="flex items-center gap-1 text-sm">
                  <span className="text-gray-400">Springfield Academy</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-700 font-medium capitalize">{currentPage}</span>
                </nav>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User avatar */}
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  AD
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800 leading-none">Admin</p>
                  <p className="text-xs text-gray-400">admin@school.edu</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {renderPage()}

          {/* Footer */}
          <footer className="mt-12 text-center pb-6">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Springfield Academy — Student Management System
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
