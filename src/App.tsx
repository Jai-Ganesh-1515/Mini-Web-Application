import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudentTableView } from './components/StudentTableView';
import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Student, StudentFormData } from './types/student';
import { studentApi, resetToDefaultSeedData } from './services/apiService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state for student table
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToView, setStudentToView] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load students on mount
  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const response = await studentApi.getAllStudents();
      if (response.status >= 200 && response.status < 300) {
        setStudents(response.data || []);
      } else {
        addToast('error', 'API Error', response.error || 'Failed to load students');
      }
    } catch (err: any) {
      addToast('error', 'Connection Error', 'Network error while fetching student directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // CRUD Handlers
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (student: Student) => {
    setStudentToView(student);
  };

  const handleOpenDeleteModal = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleFormSubmit = async (formData: StudentFormData, existingId?: number): Promise<boolean> => {
    try {
      if (existingId) {
        const res = await studentApi.updateStudent(existingId, formData);
        if (res.status >= 200 && res.status < 300) {
          addToast('success', 'Student Updated', `Student "${formData.name}" updated successfully!`);
          await loadStudents();
          return true;
        } else if (res.status === 409) {
          addToast('error', 'Duplicate Roll Number', `Roll Number "${formData.rollNumber}" is already in use.`);
          return false;
        } else {
          addToast('error', 'Update Failed', res.error || 'Failed to update student');
          return false;
        }
      } else {
        const res = await studentApi.createStudent(formData);
        if (res.status >= 200 && res.status < 300) {
          addToast('success', 'Student Created', `Student "${formData.name}" registered successfully!`);
          await loadStudents();
          return true;
        } else if (res.status === 409) {
          addToast('error', 'Duplicate Roll Number', `Roll Number "${formData.rollNumber}" already exists.`);
          return false;
        } else {
          addToast('error', 'Creation Failed', res.error || 'Failed to create student');
          return false;
        }
      }
    } catch (err: any) {
      addToast('error', 'Error', 'Unexpected error saving student');
      return false;
    }
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      const res = await studentApi.deleteStudent(id);
      if (res.status >= 200 && res.status < 300) {
        addToast('success', 'Student Deleted', 'Student record deleted successfully.');
        await loadStudents();
      } else {
        addToast('error', 'Delete Failed', res.error || 'Could not delete student.');
      }
    } catch (err: any) {
      addToast('error', 'Delete Failed', 'Failed to delete student.');
    }
  };

  const handleResetData = () => {
    resetToDefaultSeedData();
    loadStudents();
    addToast('info', 'Database Reset', 'Database reset to initial sample students.');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Fixed Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Navigation Header */}
      <Navbar
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
        studentCount={students.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            students={students}
            onOpenAddModal={handleOpenAddModal}
            onAddStudent={handleOpenAddModal}
            onViewStudent={handleOpenViewModal}
            onEditStudent={handleOpenEditModal}
            onDeleteStudent={handleOpenDeleteModal}
            onNavigateToStudents={() => setCurrentTab('students')}
            onNavigateStudents={() => setCurrentTab('students')}
          />
        )}

        {currentTab === 'students' && (
          <StudentTableView
            students={students}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            onAddStudent={handleOpenAddModal}
            onViewStudent={handleOpenViewModal}
            onEditStudent={handleOpenEditModal}
            onDeleteStudent={handleOpenDeleteModal}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            <span className="font-semibold text-slate-700">Student Management System</span> &bull; Academic Administration Portal
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('students')}
              className="hover:text-blue-600 transition"
            >
              Student Directory
            </button>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-700 transition"
              title="Reset data to initial state"
            >
              Reset Sample Data
            </button>
          </div>
        </div>
      </footer>

      {/* Modal Components */}
      <StudentModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        studentToEdit={studentToEdit}
      />

      <StudentDetailModal
        student={studentToView}
        isOpen={Boolean(studentToView)}
        onClose={() => setStudentToView(null)}
        onEdit={(student) => {
          setStudentToView(null);
          handleOpenEditModal(student);
        }}
      />

      <DeleteConfirmModal
        student={studentToDelete}
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
