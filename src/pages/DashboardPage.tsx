import { Student, AttendanceRecord, SubjectMark } from '../types/student';

interface DashboardPageProps {
  students: Student[];
  attendance: AttendanceRecord[];
  marks: SubjectMark[];
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500',
    'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500',
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

export function DashboardPage({ students, attendance, marks }: DashboardPageProps) {
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const avgGpa = students.length > 0
    ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
    : '0.00';

  // Attendance stats for today
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentToday = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const absentToday = todayAttendance.filter((a) => a.status === 'Absent').length;

  // Overall attendance rate
  const totalRecords = attendance.length;
  const totalPresent = attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : '0';

  // Average marks
  const avgMarks = marks.length > 0
    ? (marks.reduce((sum, m) => sum + (m.marks / m.maxMarks) * 100, 0) / marks.length).toFixed(1)
    : '0';

  // Grade distribution
  const gradeDistribution = students.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top performers
  const topStudents = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);

  // Subject averages
  const subjectAverages: Record<string, { total: number; count: number }> = {};
  marks.forEach((m) => {
    if (!subjectAverages[m.subject]) subjectAverages[m.subject] = { total: 0, count: 0 };
    subjectAverages[m.subject].total += (m.marks / m.maxMarks) * 100;
    subjectAverages[m.subject].count += 1;
  });

  // Recent attendance - last 7 unique dates
  const uniqueDates = [...new Set(attendance.map((a) => a.date))].sort().reverse().slice(0, 7).reverse();
  const attendanceTrend = uniqueDates.map((date) => {
    const dayRecords = attendance.filter((a) => a.date === date);
    const present = dayRecords.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    const rate = dayRecords.length > 0 ? (present / dayRecords.length) * 100 : 0;
    return { date, rate, total: dayRecords.length, present };
  });

  // Status distribution
  const statusCounts = {
    Active: students.filter((s) => s.status === 'Active').length,
    Inactive: students.filter((s) => s.status === 'Inactive').length,
    Graduated: students.filter((s) => s.status === 'Graduated').length,
    Suspended: students.filter((s) => s.status === 'Suspended').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of school performance and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={students.length.toString()}
          subtitle={`${activeStudents} active`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="indigo"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle={`${presentToday} present today, ${absentToday} absent`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          color="emerald"
        />
        <StatCard
          title="Average GPA"
          value={avgGpa}
          subtitle="Out of 4.0"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          color="amber"
        />
        <StatCard
          title="Avg Marks"
          value={`${avgMarks}%`}
          subtitle="Across all subjects"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Attendance Trend (Last 7 Days)</h3>
          <div className="flex items-end gap-2 h-48">
            {attendanceTrend.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">{day.rate.toFixed(0)}%</span>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '140px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${day.rate}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))}
            {attendanceTrend.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                No attendance data available
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Student Status</h3>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = students.length > 0 ? (count / students.length) * 100 : 0;
              const colorMap: Record<string, string> = {
                Active: 'bg-emerald-500',
                Inactive: 'bg-gray-400',
                Graduated: 'bg-blue-500',
                Suspended: 'bg-red-500',
              };
              const bgMap: Record<string, string> = {
                Active: 'bg-emerald-100',
                Inactive: 'bg-gray-100',
                Graduated: 'bg-blue-100',
                Suspended: 'bg-red-100',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorMap[status]}`} />
                      <span className="text-sm font-medium text-gray-700">{status}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className={`h-2 rounded-full ${bgMap[status]}`}>
                    <div
                      className={`h-full rounded-full ${colorMap[status]} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grade distribution */}
          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-4">By Grade</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(gradeDistribution).sort().map(([grade, count]) => (
              <div key={grade} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-indigo-600">{count}</p>
                <p className="text-xs text-gray-500">{grade} Grade</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">🏆 Top Performers</h3>
          <div className="space-y-3">
            {topStudents.map((student, idx) => (
              <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                  idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-700' : 'bg-gray-300'
                }`}>
                  {idx + 1}
                </div>
                <div className={`w-9 h-9 rounded-full ${getAvatarColor(student.firstName)} flex items-center justify-center text-white text-xs font-semibold`}>
                  {student.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                  <p className="text-xs text-gray-500">{student.grade} Grade</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">{student.gpa.toFixed(1)}</p>
                  <p className="text-[10px] text-gray-400">GPA</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">📊 Subject Performance</h3>
          <div className="space-y-3">
            {Object.entries(subjectAverages)
              .map(([subject, data]) => ({
                subject,
                avg: data.total / data.count,
              }))
              .sort((a, b) => b.avg - a.avg)
              .map((item) => {
                const color =
                  item.avg >= 80 ? 'bg-emerald-500' : item.avg >= 65 ? 'bg-amber-500' : 'bg-red-500';
                const bgColor =
                  item.avg >= 80 ? 'bg-emerald-100' : item.avg >= 65 ? 'bg-amber-100' : 'bg-red-100';
                return (
                  <div key={item.subject}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.avg.toFixed(1)}%</span>
                    </div>
                    <div className={`h-2.5 rounded-full ${bgColor}`}>
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-500`}
                        style={{ width: `${item.avg}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; iconBg: string; text: string }> = {
    indigo: { bg: 'bg-indigo-50', iconBg: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-600' },
    emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${c.text}`}>{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${c.iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
