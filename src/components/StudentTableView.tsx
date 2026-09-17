import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  UserPlus, 
  Download, 
  RotateCcw,
  Check,
  Copy,
  Users
} from 'lucide-react';
import { Student } from '../types/student';
import { DEPARTMENTS, YEARS, SECTIONS } from '../data/initialStudents';

interface StudentTableViewProps {
  students: Student[];
  onOpenAddModal: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onResetData: () => void;
}

export const StudentTableView: React.FC<StudentTableViewProps> = ({
  students,
  onOpenAddModal,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onResetData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [copiedRoll, setCopiedRoll] = useState<string | null>(null);

  // Compute dynamic department, year, and section statistics
  const allDepartments = useMemo(() => {
    const set = new Set<string>(DEPARTMENTS);
    students.forEach((s) => {
      if (s.department) set.add(s.department.trim());
    });
    return Array.from(set);
  }, [students]);

  const activeDeptsCount = useMemo(() => {
    return new Set(students.map((s) => s.department).filter(Boolean)).size;
  }, [students]);

  const activeYearsCount = useMemo(() => {
    return new Set(students.map((s) => s.year).filter(Boolean)).size;
  }, [students]);

  const activeSectionsCount = useMemo(() => {
    return new Set(students.map((s) => s.section).filter(Boolean)).size;
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.department.toLowerCase().includes(q);

      const matchesDept = !selectedDept || s.department === selectedDept;
      const matchesYear = !selectedYear || s.year === selectedYear;
      const matchesSection = !selectedSection || s.section === selectedSection;

      return matchesSearch && matchesDept && matchesYear && matchesSection;
    });
  }, [students, searchQuery, selectedDept, selectedYear, selectedSection]);

  const hasActiveFilters = Boolean(searchQuery || selectedDept || selectedYear || selectedSection);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDept('');
    setSelectedYear('');
    setSelectedSection('');
  };

  const handleCopyRoll = (roll: string) => {
    navigator.clipboard.writeText(roll);
    setCopiedRoll(roll);
    setTimeout(() => setCopiedRoll(null), 2000);
  };

  // Export to JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name, roll number, email..."
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              title="Export all students as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              title="Reset to default sample students"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Student
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Departments ({activeDeptsCount} active)</option>
            {allDepartments.map((dept) => {
              const count = students.filter((s) => s.department === dept).length;
              return (
                <option key={dept} value={dept}>
                  {dept} ({count})
                </option>
              );
            })}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Years ({activeYearsCount} active)</option>
            {YEARS.map((yr) => {
              const count = students.filter((s) => s.year === yr).length;
              return (
                <option key={yr} value={yr}>
                  {yr} ({count})
                </option>
              );
            })}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Sections ({activeSectionsCount} active)</option>
            {SECTIONS.map((sec) => {
              const count = students.filter((s) => s.section === sec).length;
              return (
                <option key={sec} value={sec}>
                  Section {sec} ({count})
                </option>
              );
            })}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 px-2 py-1 hover:bg-rose-50 rounded-md transition font-medium"
            >
              <X className="w-3 h-3" />
              Reset Filters
            </button>
          )}

          <div className="ml-auto text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800 font-mono">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-800 font-mono">{students.length}</strong> students
          </div>
        </div>

        {/* Dynamic Breakdown Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600">Active Roster Counts:</span>
          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md font-medium">
            {activeDeptsCount} Departments
          </span>
          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md font-medium">
            {activeYearsCount} Cohorts
          </span>
          <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md font-medium">
            {activeSectionsCount} Sections (A-J)
          </span>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 w-12 text-center">ID</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 hidden md:table-cell">Contact Info</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Year & Sec</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-xs mx-auto text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-slate-600 text-sm">No matching students found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try clearing search terms or registering a new student.
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearAllFilters}
                          className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const initials = student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-semibold">
                        #{student.id}
                      </td>

                      {/* Roll Number */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-md border border-slate-200 transition">
                          <span className="font-mono font-bold text-slate-800 text-[11px]">
                            {student.rollNumber}
                          </span>
                          <button
                            onClick={() => handleCopyRoll(student.rollNumber)}
                            className="text-slate-400 hover:text-slate-700"
                            title="Copy roll number"
                          >
                            {copiedRoll === student.rollNumber ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-500 md:hidden">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info (Desktop) */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="text-slate-700 font-normal">{student.email}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{student.phone}</div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 max-w-[190px] truncate">
                          {student.department}
                        </span>
                      </td>

                      {/* Year & Section */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700">{student.year}</span>
                        <span className="text-slate-400 ml-1 text-[11px]">
                          (Sec {student.section})
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="inline-flex items-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => onViewStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Profile Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Edit Student Information"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Click <strong className="text-slate-700">View</strong> to see complete student card, <strong className="text-slate-700">Edit</strong> to modify details, or <strong className="text-slate-700">Delete</strong> to remove.
          </div>
          <div className="font-mono text-[11px]">
            Active Records: {students.length}
          </div>
        </div>
      </div>
    </div>
  );
};
