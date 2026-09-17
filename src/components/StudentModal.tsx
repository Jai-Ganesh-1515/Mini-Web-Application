import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, User, Hash, Mail, Phone, Building, Calendar, Layers, MapPin } from 'lucide-react';
import { Student, StudentFormData } from '../types/student';
import { DEPARTMENTS, YEARS, SECTIONS } from '../data/initialStudents';
import { validateStudentData } from '../services/apiService';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: StudentFormData, existingId?: number) => Promise<boolean>;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentToEdit
}) => {
  const isEdit = Boolean(studentToEdit);

  const [formData, setFormData] = useState<StudentFormData>({
    rollNumber: '',
    name: '',
    email: '',
    phone: '',
    department: DEPARTMENTS[0],
    year: YEARS[0],
    section: SECTIONS[0],
    dateOfBirth: '2005-01-01',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        rollNumber: studentToEdit.rollNumber,
        name: studentToEdit.name,
        email: studentToEdit.email,
        phone: studentToEdit.phone,
        department: studentToEdit.department,
        year: studentToEdit.year,
        section: studentToEdit.section,
        dateOfBirth: studentToEdit.dateOfBirth,
        address: studentToEdit.address || ''
      });
      setErrors({});
    } else {
      // Reset form for new student
      setFormData({
        rollNumber: '',
        name: '',
        email: '',
        phone: '',
        department: DEPARTMENTS[0],
        year: YEARS[0],
        section: SECTIONS[0],
        dateOfBirth: '2005-01-01',
        address: ''
      });
      setErrors({});
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client validation
    const validation = validateStudentData(formData, studentToEdit?.id);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData, studentToEdit?.id);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isEdit ? 'Edit Student Details' : 'Register New Student'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit
                ? 'Update academic profile and student contact information'
                : 'Fill in the required academic and personal details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Roll Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. 24CSE101"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-2 font-mono uppercase ${
                      errors.rollNumber
                        ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.rollNumber ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.rollNumber}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Must be unique across students</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-2 ${
                      errors.name
                        ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-2 ${
                      errors.email
                        ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (10 digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-2 font-mono ${
                      errors.phone
                        ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Department */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year <span className="text-rose-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                >
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section <span className="text-rose-500">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-2 ${
                      errors.dateOfBirth
                        ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address (Optional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Full residential address, city, state"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/70 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEdit ? (
                'Update Student'
              ) : (
                'Save Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
