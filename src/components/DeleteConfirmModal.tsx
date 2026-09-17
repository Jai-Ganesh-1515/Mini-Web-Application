import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Student } from '../types/student';

interface DeleteConfirmModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !student) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(student.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          {/* Warning Icon */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">Are you sure you want to delete this student?</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            This operation will permanently remove the record from the database. This action cannot be undone.
          </p>

          {/* Student Card Summary */}
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-left text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">ROLL NUMBER:</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {student.rollNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">NAME:</span>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">DEPARTMENT:</span>
              <span className="text-slate-700 truncate max-w-[200px]">{student.department}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="w-1/2 py-2.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="w-1/2 py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              {isDeleting ? (
                <span>Deleting...</span>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
