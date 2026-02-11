export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  enrollmentDate: string;
  address: string;
  parentPhone: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  gpa: number;
  avatar: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

export interface SubjectMark {
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  exam: string;
}

export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Computer Science',
  'Physical Education',
  'Art',
] as const;

export const EXAMS = ['Mid-Term', 'Final', 'Quiz 1', 'Quiz 2', 'Assignment'] as const;

export type Page = 'dashboard' | 'students' | 'attendance' | 'marks';
