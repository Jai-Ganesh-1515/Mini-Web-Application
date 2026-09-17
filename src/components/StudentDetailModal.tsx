import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  MapPin, 
  Hash, 
  Edit3, 
  Copy, 
  Check, 
  UserCheck 
} from 'lucide-react';
import { Student } from '../types/student';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !student) return null;

  // Calculate approximate age
  const birthYear = new Date(student.dateOfBirth).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = isNaN(birthYear) ? '' : `${currentYear - birthYear} years old`;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(student, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-blue-700 font-extrabold text-xl flex items-center justify-center shadow-md">
              {initials}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono tracking-wider font-semibold border border-white/20 mb-1">
                <Hash className="w-3 h-3" />
                {student.rollNumber}
              </div>
              <h3 className="text-xl font-bold tracking-tight">{student.name}</h3>
              <p className="text-xs text-blue-100">{student.department}</p>
            </div>
          </div>
        </div>

        {/* Content Attributes */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Database ID */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                System Record ID
              </span>
              <span className="text-slate-900 font-mono font-bold text-sm mt-0.5 block">
                #{student.id}
              </span>
            </div>

            {/* Academic Cohort */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Class & Section
              </span>
              <span className="text-slate-900 font-semibold text-sm mt-0.5 block">
                {student.year} &bull; Sec {student.section}
              </span>
            </div>

            {/* Email */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                Official Email
              </span>
              <a
                href={`mailto:${student.email}`}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                {student.email}
              </a>
            </div>

            {/* Phone */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                Contact Phone
              </span>
              <a
                href={`tel:${student.phone}`}
                className="text-slate-800 hover:text-blue-600 font-mono font-medium flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {student.phone}
              </a>
            </div>

            {/* Date of Birth */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                Date of Birth
              </span>
              <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.dateOfBirth}</span>
              </div>
              {age && <span className="text-[10px] text-slate-500 mt-0.5 block">({age})</span>}
            </div>

            {/* Address */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                Residential Address
              </span>
              <div className="flex items-start gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{student.address || 'Address not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">JSON Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Record JSON</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 border border-slate-200 rounded-xl transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
