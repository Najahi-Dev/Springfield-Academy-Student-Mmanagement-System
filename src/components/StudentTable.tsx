import { Student } from '../types/student';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onView: (student: Student) => void;
}

function getStatusBadge(status: Student['status']) {
  const styles: Record<Student['status'], string> = {
    Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Inactive: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
    Graduated: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    Suspended: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  };
  return styles[status];
}

function getGpaColor(gpa: number) {
  if (gpa >= 3.7) return 'text-emerald-600 font-semibold';
  if (gpa >= 3.0) return 'text-blue-600 font-semibold';
  if (gpa >= 2.0) return 'text-amber-600 font-semibold';
  return 'text-red-600 font-semibold';
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function StudentTable({ students, onEdit, onDelete, onView }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">No students found</h3>
        <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
              <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">GPA</th>
              <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrollment</th>
              <th className="text-right py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getAvatarColor(student.firstName)} flex items-center justify-center text-white text-sm font-semibold shadow-sm`}>
                      {student.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{student.firstName} {student.lastName}</p>
                      <p className="text-gray-500 text-xs">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">{student.grade}</span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{student.age}</td>
                <td className="py-4 px-6">
                  <span className={`text-sm ${getGpaColor(student.gpa)}`}>{student.gpa.toFixed(1)}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      student.status === 'Active' ? 'bg-emerald-500' :
                      student.status === 'Inactive' ? 'bg-gray-400' :
                      student.status === 'Graduated' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></span>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(student)}
                      className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                      title="View"
                    >
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-100">
        {students.map((student) => (
          <div key={student.id} className="p-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${getAvatarColor(student.firstName)} flex items-center justify-center text-white text-sm font-semibold shadow-sm`}>
                  {student.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                  <p className="text-gray-500 text-xs">{student.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.status)}`}>
                {student.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Grade</p>
                <p className="font-medium text-gray-700">{student.grade}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Age</p>
                <p className="font-medium text-gray-700">{student.age}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">GPA</p>
                <p className={getGpaColor(student.gpa)}>{student.gpa.toFixed(1)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => onView(student)} className="flex-1 text-center py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors">View</button>
              <button onClick={() => onEdit(student)} className="flex-1 text-center py-2 text-amber-600 hover:bg-amber-50 rounded-lg text-sm font-medium transition-colors">Edit</button>
              <button onClick={() => onDelete(student.id)} className="flex-1 text-center py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
