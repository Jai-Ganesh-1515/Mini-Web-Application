import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  Plus
} from 'lucide-react';

export type TabType = 'dashboard' | 'students';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  studentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  studentCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-lg leading-tight">Student Management System</h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Academic Administration &bull; Student Records Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'students'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Directory
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                {studentCount}
              </span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-200 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center justify-start py-2 border-t border-slate-100 gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Students ({studentCount})
          </button>
        </div>
      </div>
    </header>
  );
};
