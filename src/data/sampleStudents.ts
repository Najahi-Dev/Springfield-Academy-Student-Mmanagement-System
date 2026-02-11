import { Student, AttendanceRecord, SubjectMark } from '../types/student';

export const sampleStudents: Student[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@school.edu',
    grade: '10th',
    age: 16,
    gender: 'Female',
    enrollmentDate: '2023-09-01',
    address: '123 Oak Street, Springfield',
    parentPhone: '(555) 123-4567',
    status: 'Active',
    gpa: 3.8,
    avatar: 'EJ',
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Williams',
    email: 'liam.williams@school.edu',
    grade: '11th',
    age: 17,
    gender: 'Male',
    enrollmentDate: '2022-09-01',
    address: '456 Maple Ave, Springfield',
    parentPhone: '(555) 234-5678',
    status: 'Active',
    gpa: 3.5,
    avatar: 'LW',
  },
  {
    id: '3',
    firstName: 'Sophia',
    lastName: 'Brown',
    email: 'sophia.brown@school.edu',
    grade: '9th',
    age: 15,
    gender: 'Female',
    enrollmentDate: '2024-09-01',
    address: '789 Pine Rd, Springfield',
    parentPhone: '(555) 345-6789',
    status: 'Active',
    gpa: 3.9,
    avatar: 'SB',
  },
  {
    id: '4',
    firstName: 'Noah',
    lastName: 'Davis',
    email: 'noah.davis@school.edu',
    grade: '12th',
    age: 18,
    gender: 'Male',
    enrollmentDate: '2021-09-01',
    address: '321 Elm St, Springfield',
    parentPhone: '(555) 456-7890',
    status: 'Graduated',
    gpa: 3.2,
    avatar: 'ND',
  },
  {
    id: '5',
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.martinez@school.edu',
    grade: '10th',
    age: 16,
    gender: 'Female',
    enrollmentDate: '2023-09-01',
    address: '654 Birch Ln, Springfield',
    parentPhone: '(555) 567-8901',
    status: 'Active',
    gpa: 3.7,
    avatar: 'OM',
  },
  {
    id: '6',
    firstName: 'James',
    lastName: 'Garcia',
    email: 'james.garcia@school.edu',
    grade: '11th',
    age: 17,
    gender: 'Male',
    enrollmentDate: '2022-09-01',
    address: '987 Cedar Dr, Springfield',
    parentPhone: '(555) 678-9012',
    status: 'Suspended',
    gpa: 2.8,
    avatar: 'JG',
  },
  {
    id: '7',
    firstName: 'Ava',
    lastName: 'Anderson',
    email: 'ava.anderson@school.edu',
    grade: '9th',
    age: 14,
    gender: 'Female',
    enrollmentDate: '2024-09-01',
    address: '147 Walnut St, Springfield',
    parentPhone: '(555) 789-0123',
    status: 'Active',
    gpa: 4.0,
    avatar: 'AA',
  },
  {
    id: '8',
    firstName: 'Benjamin',
    lastName: 'Thomas',
    email: 'ben.thomas@school.edu',
    grade: '12th',
    age: 18,
    gender: 'Male',
    enrollmentDate: '2021-09-01',
    address: '258 Spruce Ave, Springfield',
    parentPhone: '(555) 890-1234',
    status: 'Inactive',
    gpa: 3.1,
    avatar: 'BT',
  },
];

// Generate attendance for the last 30 days
function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const statuses: Array<'Present' | 'Absent' | 'Late' | 'Excused'> = ['Present', 'Absent', 'Late', 'Excused'];
  const today = new Date();

  for (const student of sampleStudents) {
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Weight towards present
      const rand = Math.random();
      let status: typeof statuses[number];
      if (rand < 0.75) status = 'Present';
      else if (rand < 0.85) status = 'Late';
      else if (rand < 0.93) status = 'Absent';
      else status = 'Excused';

      records.push({
        studentId: student.id,
        date: date.toISOString().split('T')[0],
        status,
      });
    }
  }
  return records;
}

// Generate marks for each student
function generateMarks(): SubjectMark[] {
  const marks: SubjectMark[] = [];
  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Computer Science', 'Physical Education', 'Art'];
  const exams = ['Mid-Term', 'Final'];

  for (const student of sampleStudents) {
    for (const subject of subjects) {
      for (const exam of exams) {
        const maxMarks = 100;
        const minMark = 40 + Math.floor(Math.random() * 20);
        const studentMarks = minMark + Math.floor(Math.random() * (maxMarks - minMark));
        marks.push({
          studentId: student.id,
          subject,
          marks: studentMarks,
          maxMarks,
          exam,
        });
      }
    }
  }
  return marks;
}

export const sampleAttendance = generateAttendance();
export const sampleMarks = generateMarks();
