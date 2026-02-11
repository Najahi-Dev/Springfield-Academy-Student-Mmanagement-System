import { useState, useMemo } from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types/student';

interface AttendancePageProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
}

const statusColors: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Absent: 'bg-red-100 text-red-700 border-red-200',
  Late: 'bg-amber-100 text-amber-700 border-amber-200',
  Excused: 'bg-blue-100 text-blue-700 border-blue-200',
};

const statusDots: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-500',
  Absent: 'bg-red-500',
  Late: 'bg-amber-500',
  Excused: 'bg-blue-500',
};

function getAvatarColor(name: string) {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500',
    'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500',
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

export function AttendancePage({ students, attendance, onUpdateAttendance }: AttendancePageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [gradeFilter, setGradeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [tempAttendance, setTempAttendance] = useState<Record<string, AttendanceStatus>>({});

  const activeStudents = useMemo(() => {
    return students.filter((s) => {
      const matchGrade = !gradeFilter || s.grade === gradeFilter;
      const matchSearch =
        !searchQuery ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      return s.status === 'Active' && matchGrade && matchSearch;
    });
  }, [students, gradeFilter, searchQuery]);

  const dayAttendance = useMemo(() => {
    const map: Record<string, AttendanceStatus> = {};
    attendance
      .filter((a) => a.date === selectedDate)
      .forEach((a) => {
        map[a.studentId] = a.status;
      });
    return map;
  }, [attendance, selectedDate]);

  const startEdit = () => {
    setTempAttendance({ ...dayAttendance });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setTempAttendance({});
    setEditMode(false);
  };

  const saveAttendance = () => {
    const newRecords = attendance.filter((a) => a.date !== selectedDate);
    Object.entries(tempAttendance).forEach(([studentId, status]) => {
      newRecords.push({ studentId, date: selectedDate, status });
    });
    onUpdateAttendance(newRecords);
    setEditMode(false);
    setTempAttendance({});
  };

  const markAll = (status: AttendanceStatus) => {
    const newTemp: Record<string, AttendanceStatus> = {};
    activeStudents.forEach((s) => {
      newTemp[s.id] = status;
    });
    setTempAttendance(newTemp);
  };

  // Stats for selected date
  const dateStats = useMemo(() => {
    const records = attendance.filter((a) => a.date === selectedDate);
    return {
      total: records.length,
      present: records.filter((a) => a.status === 'Present').length,
      absent: records.filter((a) => a.status === 'Absent').length,
      late: records.filter((a) => a.status === 'Late').length,
      excused: records.filter((a) => a.status === 'Excused').length,
    };
  }, [attendance, selectedDate]);

  // Student-level stats
  const getStudentStats = (studentId: string) => {
    const records = attendance.filter((a) => a.studentId === studentId);
    const present = records.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    return {
      total: records.length,
      rate: records.length > 0 ? ((present / records.length) * 100).toFixed(0) : 'N/A',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage daily attendance</p>
        </div>
        <div className="flex items-center gap-3">
          {!editMode ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Mark Attendance
            </button>
          ) : (
            <>
              <button
                onClick={cancelEdit}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAttendance}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-emerald-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Attendance
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <MiniStat label="Total" value={dateStats.total} color="gray" />
        <MiniStat label="Present" value={dateStats.present} color="emerald" />
        <MiniStat label="Absent" value={dateStats.absent} color="red" />
        <MiniStat label="Late" value={dateStats.late} color="amber" />
        <MiniStat label="Excused" value={dateStats.excused} color="blue" />
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

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setEditMode(false);
            }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">All Grades</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
          </select>

          {editMode && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Mark All:</span>
              <button onClick={() => markAll('Present')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-200 transition-colors">Present</button>
              <button onClick={() => markAll('Absent')} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors">Absent</button>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="text-center py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Rate</th>
                <th className="text-center py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status ({new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeStudents.map((student) => {
                const currentStatus = editMode
                  ? tempAttendance[student.id]
                  : dayAttendance[student.id];
                const stats = getStudentStats(student.id);
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(student.firstName)} flex items-center justify-center text-white text-xs font-semibold`}>
                          {student.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="text-sm text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">{student.grade}</span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`text-sm font-semibold ${
                        Number(stats.rate) >= 90 ? 'text-emerald-600' :
                        Number(stats.rate) >= 75 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {stats.rate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {editMode ? (
                          <div className="flex gap-1.5">
                            {(['Present', 'Absent', 'Late', 'Excused'] as AttendanceStatus[]).map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  setTempAttendance((prev) => ({ ...prev, [student.id]: status }))
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  currentStatus === status
                                    ? statusColors[status] + ' ring-2 ring-offset-1 ring-current shadow-sm'
                                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        ) : currentStatus ? (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[currentStatus]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDots[currentStatus]}`} />
                            {currentStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Not marked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-gray-100">
          {activeStudents.map((student) => {
            const currentStatus = editMode
              ? tempAttendance[student.id]
              : dayAttendance[student.id];
            const stats = getStudentStats(student.id);
            return (
              <div key={student.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${getAvatarColor(student.firstName)} flex items-center justify-center text-white text-xs font-semibold`}>
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-gray-500">{student.grade} · Rate: {stats.rate}%</p>
                  </div>
                </div>
                {editMode ? (
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['Present', 'Absent', 'Late', 'Excused'] as AttendanceStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setTempAttendance((prev) => ({ ...prev, [student.id]: status }))
                        }
                        className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                          currentStatus === status
                            ? statusColors[status] + ' ring-2 ring-offset-1 ring-current'
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {currentStatus ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[currentStatus]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[currentStatus]}`} />
                        {currentStatus}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not marked</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activeStudents.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-sm">No active students found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    gray: 'bg-gray-50 text-gray-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
  };
  return (
    <div className={`rounded-xl p-3 text-center ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-70">{label}</p>
    </div>
  );
}
