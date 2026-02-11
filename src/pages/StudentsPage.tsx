import { useState, useMemo } from 'react';
import { Student } from '../types/student';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { StudentTable } from '../components/StudentTable';
import { StudentForm } from '../components/StudentForm';
import { StudentDetail } from '../components/StudentDetail';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface StudentsPageProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'avatar'>) => void;
  onEditStudent: (id: string, student: Omit<Student, 'id' | 'avatar'>) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentsPage({ students, onAddStudent, onEditStudent, onDeleteStudent }: StudentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        searchQuery === '' ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === '' || student.grade === gradeFilter;
      const matchesStatus = statusFilter === '' || student.status === statusFilter;
      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [students, searchQuery, gradeFilter, statusFilter]);

  const handleSubmit = (data: Omit<Student, 'id' | 'avatar'>) => {
    if (editStudent) {
      onEditStudent(editStudent.id, data);
    } else {
      onAddStudent(data);
    }
  };

  const openEdit = (student: Student) => {
    setEditStudent(student);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setEditStudent(null);
    setIsFormOpen(true);
  };

  const openView = (student: Student) => {
    setViewStudent(student);
    setIsDetailOpen(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    onDeleteStudent(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and view all student records</p>
      </div>

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddClick={openAdd}
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filteredStudents.length}</span> of{' '}
          <span className="font-semibold text-gray-700">{students.length}</span> students
        </p>
        {(searchQuery || gradeFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setGradeFilter('');
              setStatusFilter('');
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      <StudentTable
        students={filteredStudents}
        onEdit={openEdit}
        onDelete={(id) => setDeleteId(id)}
        onView={openView}
      />

      <StudentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditStudent(null);
        }}
        onSubmit={handleSubmit}
        editStudent={editStudent}
      />

      <StudentDetail
        student={viewStudent}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewStudent(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  );
}
