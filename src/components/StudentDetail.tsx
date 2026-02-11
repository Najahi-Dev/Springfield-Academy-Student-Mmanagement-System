import { Student } from '../types/student';

interface StudentDetailProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

function getAvatarColor(name: string) {
  const colors = [
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-pink-500 to-rose-500',
    'from-rose-500 to-orange-500',
    'from-orange-500 to-amber-500',
    'from-amber-500 to-yellow-500',
    'from-emerald-500 to-teal-500',
    'from-teal-500 to-cyan-500',
    'from-cyan-500 to-sky-500',
    'from-sky-500 to-blue-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getStatusStyle(status: Student['status']) {
  const styles: Record<Student['status'], string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Inactive: 'bg-gray-100 text-gray-600',
    Graduated: 'bg-blue-100 text-blue-700',
    Suspended: 'bg-red-100 text-red-700',
  };
  return styles[status];
}

export function StudentDetail({ student, isOpen, onClose }: StudentDetailProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${getAvatarColor(student.firstName)} p-6 pb-16 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-12 relative z-10">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getAvatarColor(student.firstName)} flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white`}>
            {student.avatar}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
            <p className="text-gray-500 text-sm mt-1">{student.email}</p>
            <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(student.status)}`}>
              {student.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard icon="📚" label="Grade" value={student.grade} />
            <InfoCard icon="🎂" label="Age" value={`${student.age} years`} />
            <InfoCard icon="⭐" label="GPA" value={student.gpa.toFixed(1)} />
            <InfoCard icon="👤" label="Gender" value={student.gender} />
            <InfoCard icon="📅" label="Enrolled" value={new Date(student.enrollmentDate).toLocaleDateString()} />
            <InfoCard icon="📞" label="Parent Phone" value={student.parentPhone} />
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-2">
              <span className="text-base">📍</span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Address</p>
                <p className="text-sm text-gray-700 mt-0.5">{student.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}
