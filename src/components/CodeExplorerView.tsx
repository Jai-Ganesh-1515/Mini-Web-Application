import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  FolderTree, 
  Download, 
  Terminal, 
  Layers, 
  ExternalLink,
  Code
} from 'lucide-react';
import { PROJECT_FILES, ProjectFile } from '../data/projectFiles';

export const CodeExplorerView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[3]); // Student.java default
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'backend', label: 'Spring Boot Java' },
    { id: 'frontend', label: 'HTML / CSS / JS' },
    { id: 'config', label: 'Config & Maven' },
    { id: 'database', label: 'MySQL SQL' },
    { id: 'docs', label: 'Documentation' }
  ];

  const filteredFiles = PROJECT_FILES.filter(
    (f) => activeCategory === 'all' || f.category === activeCategory
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-blue-600" />
              Full-Stack Project Code Explorer
            </h2>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              100% Complete & Production Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse, inspect, and copy complete source code files for Spring Boot 3.2.x, MySQL, and the HTML5/JS frontend.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Code Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar File Browser */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-blue-600" />
              Project File Hierarchy
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              {filteredFiles.length} files
            </span>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const ext = file.name.split('.').pop()?.toUpperCase();

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate">{file.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-200 text-slate-700">
                      {ext}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content & Action Bar */}
        <div className="lg:col-span-8 space-y-3">
          {/* File Meta Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-slate-400 capitalize">
                  {selectedFile.language} file
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
                title="Download this file"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-md overflow-hidden text-slate-100 font-mono text-xs">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <span>{selectedFile.name}</span>
              <span>{selectedFile.content.split('\n').length} lines</span>
            </div>

            <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto leading-relaxed">
              <pre className="text-slate-200">
                <code>
                  {selectedFile.content.split('\n').map((line, idx) => (
                    <div key={idx} className="table-row">
                      <span className="table-cell pr-4 text-slate-600 select-none text-right w-10 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="table-cell whitespace-pre">{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
