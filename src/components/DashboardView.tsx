import React, { useMemo } from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  Layers, 
  UserPlus, 
  ArrowRight, 
  Clock, 
  GraduationCap, 
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types/student';
import { DEPARTMENTS, YEARS, SECTIONS } from '../data/initialStudents';

interface DashboardViewProps {
  students: Student[];
  onOpenAddModal?: () => void;
  onAddStudent?: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
  onNavigateToStudents?: () => void;
  onNavigateStudents?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onOpenAddModal,
  onAddStudent,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onNavigateToStudents,
  onNavigateStudents
}) => {
  const handleOpenAdd = onOpenAddModal || onAddStudent || (() => {});
  const handleNavigate = onNavigateToStudents || onNavigateStudents || (() => {});

  // All departments (catalog + any custom student departments)
  const allDepartments = useMemo(() => {
    const set = new Set<string>(DEPARTMENTS);
    students.forEach((s) => {
      if (s.department) set.add(s.department.trim());
    });
    return Array.from(set);
  }, [students]);

  // Dynamic department counts and percentages based on current students
  const departmentCounts = useMemo(() => {
    return allDepartments.map((dept) => {
      const count = students.filter((s) => s.department === dept).length;
      const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
      return { name: dept, count, percentage };
    }).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [allDepartments, students]);

  // Active departments count (departments with at least 1 student)
  const activeDeptsCount = useMemo(() => {
    return new Set(students.map((s) => s.department).filter(Boolean)).size;
  }, [students]);

  // Dynamic year counts based on current students
  const yearCounts = useMemo(() => {
    return YEARS.map((yr) => {
      const count = students.filter((s) => s.year === yr).length;
      const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
      return { year: yr, count, percentage };
    });
  }, [students]);

  // Active years count (years with at least 1 student)
  const activeYearsCount = useMemo(() => {
    return new Set(students.map((s) => s.year).filter(Boolean)).size;
  }, [students]);

  // Dynamic section counts (A through J) based on current students
  const sectionCounts = useMemo(() => {
    return SECTIONS.map((sec) => {
      const count = students.filter((s) => s.section === sec).length;
      const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
      return { section: sec, count, percentage };
    });
  }, [students]);

  // Active sections count (sections with at least 1 student)
  const activeSectionsCount = useMemo(() => {
    return new Set(students.map((s) => s.section).filter(Boolean)).size;
  }, [students]);

  const recentStudents = useMemo(() => [...students].slice(0, 5), [students]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <GraduationCap className="w-64 h-64 -rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Academic Administration
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-100 text-xs font-medium backdrop-blur-xs border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Synced: {students.length} Records
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Student Management Dashboard
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
            Real-time enrollment tracking across {activeDeptsCount} active departments, {activeYearsCount} cohorts, and {activeSectionsCount} sections. Details update automatically upon student registration or edit.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAdd}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 text-xs sm:text-sm font-semibold hover:bg-blue-50 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Quick Add Student
            </button>
            <button
              onClick={handleNavigate}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white text-xs sm:text-sm font-medium transition border border-white/20 cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4" />
              Browse Student Directory ({students.length})
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards - Dynamically computed from students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between transition hover:shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
              {students.length}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Auto-updates on add/edit
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Active Departments Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between transition hover:shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Departments
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
              {activeDeptsCount}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeDeptsCount} of {allDepartments.length} disciplines enrolled
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Academic Years Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between transition hover:shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Years
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
              {activeYearsCount}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeYearsCount} of {YEARS.length} cohorts with students
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Active Sections Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between transition hover:shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Sections
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
              {activeSectionsCount}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeSectionsCount} of {SECTIONS.length} sections active (A-J)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Mid Section: Department Breakdown & Year Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Enrollment */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Department Distribution</h3>
              <p className="text-xs text-slate-500">
                Live count and percentage breakdown based on enrolled students
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {activeDeptsCount} Active Departments
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {departmentCounts.map((dept) => {
              const hasStudents = dept.count > 0;
              return (
                <div key={dept.name} className="space-y-1 group">
                  <div className="flex items-center justify-between text-xs">
                    <span 
                      className={`font-semibold truncate mr-2 transition ${
                        hasStudents ? 'text-slate-800' : 'text-slate-400'
                      }`} 
                      title={dept.name}
                    >
                      {dept.name}
                    </span>
                    <span className="text-slate-500 font-mono shrink-0">
                      <strong className={hasStudents ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                        {dept.count}
                      </strong>{' '}
                      {dept.count === 1 ? 'student' : 'students'} ({dept.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hasStudents ? 'bg-blue-600 group-hover:bg-blue-500' : 'bg-transparent'
                      }`}
                      style={{ width: `${Math.max(dept.percentage, hasStudents ? 6 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Years & Sections Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Academic Batches</h3>
                <p className="text-xs text-slate-500">{activeYearsCount} of {YEARS.length} cohorts active</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                {students.length} Total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {yearCounts.map((yr, index) => {
                const colors = [
                  'bg-blue-50/80 border-blue-200 text-blue-900',
                  'bg-emerald-50/80 border-emerald-200 text-emerald-900',
                  'bg-amber-50/80 border-amber-200 text-amber-900',
                  'bg-purple-50/80 border-purple-200 text-purple-900'
                ];
                const hasStudents = yr.count > 0;
                return (
                  <div
                    key={yr.year}
                    className={`p-3 rounded-xl border transition ${
                      hasStudents ? colors[index % colors.length] : 'bg-slate-50/50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <p className="text-xs font-semibold">{yr.year}</p>
                    <div className="flex items-baseline justify-between mt-1">
                      <h4 className="text-2xl font-black font-mono">{yr.count}</h4>
                      <span className="text-[10px] font-mono opacity-80 font-medium">
                        {yr.percentage}%
                      </span>
                    </div>
                    <p className="text-[10px] opacity-75 mt-0.5">
                      {yr.count === 1 ? '1 student' : `${yr.count} students`}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Sections A to J Breakdown */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sections Roster (A to J)</h4>
                  <p className="text-[10px] text-slate-400">
                    {activeSectionsCount} active with enrolled students
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {SECTIONS.length} Sections
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {sectionCounts.map((sec) => {
                  const hasStudents = sec.count > 0;
                  return (
                    <div
                      key={sec.section}
                      className={`p-1.5 rounded-lg border text-center transition ${
                        hasStudents
                          ? 'bg-blue-50 border-blue-200 text-blue-950 shadow-2xs font-semibold'
                          : 'bg-slate-50/60 border-slate-200/60 text-slate-400'
                      }`}
                      title={`Section ${sec.section}: ${sec.count} students (${sec.percentage}%)`}
                    >
                      <span className="block text-[10px] font-bold">Sec {sec.section}</span>
                      <span className={`block text-xs font-mono font-black ${
                        hasStudents ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {sec.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={handleNavigate}
              type="button"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 py-1 cursor-pointer"
            >
              View complete student roster
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Students & Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Recently Registered Students
            </h3>
            <p className="text-xs text-slate-500">Quickly preview recently added student profiles</p>
          </div>
          <button
            onClick={handleNavigate}
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
          >
            View all ({students.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentStudents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No students registered yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentStudents.map((student) => (
              <div
                key={student.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition cursor-pointer"
                onClick={() => onViewStudent(student)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{student.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {student.rollNumber} &bull; {student.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="inline-block text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                      {student.department}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {student.year} &bull; Sec {student.section}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewStudent(student);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                    title="View Student"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
