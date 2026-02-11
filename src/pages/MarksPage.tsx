import { useState, useMemo } from 'react';
import { Student, SubjectMark, SUBJECTS, EXAMS } from '../types/student';

interface MarksPageProps {
  students: Student[];
  marks: SubjectMark[];
  onUpdateMarks: (marks: SubjectMark[]) => void;
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500',
    'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500',
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

function getGradeLabel(pct: number) {
  if (pct >= 90) return { label: 'A+', color: 'text-emerald-600 bg-emerald-50' };
  if (pct >= 80) return { label: 'A', color: 'text-emerald-600 bg-emerald-50' };
  if (pct >= 70) return { label: 'B', color: 'text-blue-600 bg-blue-50' };
  if (pct >= 60) return { label: 'C', color: 'text-amber-600 bg-amber-50' };
  if (pct >= 50) return { label: 'D', color: 'text-orange-600 bg-orange-50' };
  return { label: 'F', color: 'text-red-600 bg-red-50' };
}

export function MarksPage({ students, marks, onUpdateMarks }: MarksPageProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMark, setEditingMark] = useState<{ studentId: string; subject: string; exam: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form state
  const [addForm, setAddForm] = useState<{
    studentId: string;
    subject: string;
    exam: string;
    marks: string;
    maxMarks: string;
  }>({
    studentId: '',
    subject: SUBJECTS[0] as string,
    exam: EXAMS[0] as string,
    marks: '',
    maxMarks: '100',
  });

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = !searchQuery || `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStudent = !selectedStudent || s.id === selectedStudent;
      return matchSearch && matchStudent;
    });
  }, [students, searchQuery, selectedStudent]);

  const getStudentMarks = (studentId: string) => {
    return marks.filter((m) => {
      const matchStudent = m.studentId === studentId;
      const matchSubject = !selectedSubject || m.subject === selectedSubject;
      const matchExam = !selectedExam || m.exam === selectedExam;
      return matchStudent && matchSubject && matchExam;
    });
  };

  const getStudentAverage = (studentId: string) => {
    const studentMarks = marks.filter((m) => m.studentId === studentId);
    if (studentMarks.length === 0) return 0;
    return studentMarks.reduce((sum, m) => sum + (m.marks / m.maxMarks) * 100, 0) / studentMarks.length;
  };

  const startEdit = (studentId: string, subject: string, exam: string, currentValue: number) => {
    setEditingMark({ studentId, subject, exam });
    setEditValue(currentValue.toString());
  };

  const saveEdit = () => {
    if (!editingMark) return;
    const newMarks = marks.map((m) =>
      m.studentId === editingMark.studentId &&
      m.subject === editingMark.subject &&
      m.exam === editingMark.exam
        ? { ...m, marks: Math.min(Math.max(0, Number(editValue)), m.maxMarks) }
        : m
    );
    onUpdateMarks(newMarks);
    setEditingMark(null);
    setEditValue('');
  };

  const addNewMark = () => {
    if (!addForm.studentId || !addForm.marks) return;

    // Check if mark already exists
    const exists = marks.find(
      (m) =>
        m.studentId === addForm.studentId &&
        m.subject === addForm.subject &&
        m.exam === addForm.exam
    );
    if (exists) {
      // Update existing
      const newMarks = marks.map((m) =>
        m.studentId === addForm.studentId &&
        m.subject === addForm.subject &&
        m.exam === addForm.exam
          ? { ...m, marks: Number(addForm.marks), maxMarks: Number(addForm.maxMarks) }
          : m
      );
      onUpdateMarks(newMarks);
    } else {
      // Add new
      onUpdateMarks([
        ...marks,
        {
          studentId: addForm.studentId,
          subject: addForm.subject,
          marks: Number(addForm.marks),
          maxMarks: Number(addForm.maxMarks),
          exam: addForm.exam,
        },
      ]);
    }
    setShowAddModal(false);
    setAddForm({ studentId: '', subject: SUBJECTS[0], exam: EXAMS[0], marks: '', maxMarks: '100' });
  };

  // Overall stats
  const overallStats = useMemo(() => {
    if (marks.length === 0) return { avg: 0, highest: 0, lowest: 0, passRate: 0 };
    const percentages = marks.map((m) => (m.marks / m.maxMarks) * 100);
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    const passRate = (percentages.filter((p) => p >= 50).length / percentages.length) * 100;
    return { avg, highest, lowest, passRate };
  }, [marks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marks & Grades</h1>
          <p className="text-sm text-gray-500 mt-1">View and update student marks for each subject</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add / Update Marks
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Average</p>
          <p className="text-2xl font-bold text-indigo-600">{overallStats.avg.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Highest</p>
          <p className="text-2xl font-bold text-emerald-600">{overallStats.highest.toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Lowest</p>
          <p className="text-2xl font-bold text-red-600">{overallStats.lowest.toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Pass Rate</p>
          <p className="text-2xl font-bold text-amber-600">{overallStats.passRate.toFixed(0)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">All Exams</option>
            {EXAMS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Cards with Marks */}
      <div className="space-y-4">
        {filteredStudents.map((student) => {
          const studentMarks = getStudentMarks(student.id);
          const avg = getStudentAverage(student.id);
          const grade = getGradeLabel(avg);

          if (studentMarks.length === 0) return null;

          return (
            <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Student Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getAvatarColor(student.firstName)} flex items-center justify-center text-white text-sm font-semibold`}>
                    {student.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-gray-500">{student.grade} · {student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Average</p>
                    <p className="text-lg font-bold text-indigo-600">{avg.toFixed(1)}%</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${grade.color}`}>
                    {grade.label}
                  </span>
                </div>
              </div>

              {/* Marks Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2.5 px-4 sm:px-5 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                      <th className="text-left py-2.5 px-4 sm:px-5 text-xs font-semibold text-gray-500 uppercase">Exam</th>
                      <th className="text-center py-2.5 px-4 sm:px-5 text-xs font-semibold text-gray-500 uppercase">Marks</th>
                      <th className="text-center py-2.5 px-4 sm:px-5 text-xs font-semibold text-gray-500 uppercase">Percentage</th>
                      <th className="text-center py-2.5 px-4 sm:px-5 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                      <th className="text-center py-2.5 px-4 sm:px-5 text-xs font-semibold text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {studentMarks.map((mark, idx) => {
                      const pct = (mark.marks / mark.maxMarks) * 100;
                      const g = getGradeLabel(pct);
                      const isEditing =
                        editingMark?.studentId === mark.studentId &&
                        editingMark?.subject === mark.subject &&
                        editingMark?.exam === mark.exam;

                      return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-2.5 px-4 sm:px-5 text-sm font-medium text-gray-800">{mark.subject}</td>
                          <td className="py-2.5 px-4 sm:px-5">
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                              {mark.exam}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 sm:px-5 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                  className="w-16 px-2 py-1 border border-indigo-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  min="0"
                                  max={mark.maxMarks}
                                  autoFocus
                                />
                                <span className="text-xs text-gray-400">/ {mark.maxMarks}</span>
                              </div>
                            ) : (
                              <span className="text-sm font-semibold text-gray-800">
                                {mark.marks} <span className="text-gray-400 font-normal">/ {mark.maxMarks}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 sm:px-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-600">{pct.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 sm:px-5 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${g.color}`}>{g.label}</span>
                          </td>
                          <td className="py-2.5 px-4 sm:px-5 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={saveEdit}
                                  className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setEditingMark(null)}
                                  className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEdit(mark.studentId, mark.subject, mark.exam, mark.marks)}
                                className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                                title="Edit marks"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.every((s) => getStudentMarks(s.id).length === 0) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No marks found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or add new marks.</p>
        </div>
      )}

      {/* Add/Update Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add / Update Marks</h2>
                <p className="text-xs text-gray-500 mt-0.5">Enter marks for a student</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student *</label>
                <select
                  value={addForm.studentId}
                  onChange={(e) => setAddForm({ ...addForm, studentId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                <select
                  value={addForm.subject}
                  onChange={(e) => setAddForm({ ...addForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam *</label>
                <select
                  value={addForm.exam}
                  onChange={(e) => setAddForm({ ...addForm, exam: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {EXAMS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Marks *</label>
                  <input
                    type="number"
                    value={addForm.marks}
                    onChange={(e) => setAddForm({ ...addForm, marks: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="85"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Marks</label>
                  <input
                    type="number"
                    value={addForm.maxMarks}
                    onChange={(e) => setAddForm({ ...addForm, maxMarks: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewMark}
                  disabled={!addForm.studentId || !addForm.marks}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
