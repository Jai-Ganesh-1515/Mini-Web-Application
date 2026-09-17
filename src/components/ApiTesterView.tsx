import React, { useState } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  Terminal, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { studentApi, getBackendMode, setBackendMode, getBackendUrl, setBackendUrl } from '../services/apiService';
import { Student } from '../types/student';

interface TestCase {
  id: string;
  name: string;
  category: 'CRUD' | 'Validation' | 'Errors';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  expectedStatus: number;
  requestBody?: any;
}

const PRESET_TEST_CASES: TestCase[] = [
  {
    id: 'post_valid',
    name: '1. POST - Create Valid Student',
    category: 'CRUD',
    method: 'POST',
    endpoint: '/api/students',
    description: 'Registers a new student with complete valid parameters.',
    expectedStatus: 201,
    requestBody: {
      rollNumber: '24CSE999',
      name: 'Priya Sundaram',
      email: 'priya.sundaram@college.edu',
      phone: '9876501234',
      department: 'Computer Science and Engineering',
      year: '1st Year',
      section: 'A',
      dateOfBirth: '2005-08-12',
      address: '14 Emerald Park, Whitefield, Bengaluru'
    }
  },
  {
    id: 'get_all',
    name: '2. GET - Read All Students',
    category: 'CRUD',
    method: 'GET',
    endpoint: '/api/students',
    description: 'Retrieves all registered students in the database as a JSON array.',
    expectedStatus: 200
  },
  {
    id: 'get_by_id',
    name: '3. GET - Read Student by ID',
    category: 'CRUD',
    method: 'GET',
    endpoint: '/api/students/1',
    description: 'Retrieves student record #1.',
    expectedStatus: 200
  },
  {
    id: 'put_update',
    name: '4. PUT - Update Student',
    category: 'CRUD',
    method: 'PUT',
    endpoint: '/api/students/1',
    description: 'Modifies fields of student #1.',
    expectedStatus: 200,
    requestBody: {
      rollNumber: '24CSE101',
      name: 'Aarav Sharma (Updated)',
      email: 'aarav.sharma@college.edu',
      phone: '9876543210',
      department: 'Computer Science and Engineering',
      year: '2nd Year',
      section: 'A',
      dateOfBirth: '2005-04-14',
      address: '42 Blossom Grove, Tech Park Road, Bengaluru'
    }
  },
  {
    id: 'delete_student',
    name: '5. DELETE - Remove Student',
    category: 'CRUD',
    method: 'DELETE',
    endpoint: '/api/students/1',
    description: 'Deletes student record by ID.',
    expectedStatus: 200
  },
  {
    id: 'search_query',
    name: '6. GET - Search Students',
    category: 'CRUD',
    method: 'GET',
    endpoint: '/api/students/search?name=Diya',
    description: 'Searches students matching query string in name or roll number.',
    expectedStatus: 200
  },
  {
    id: 'err_missing_name',
    name: '7. POST - Missing Name (Validation)',
    category: 'Validation',
    method: 'POST',
    endpoint: '/api/students',
    description: 'Attempts to create student without name. Expects 400 Bad Request.',
    expectedStatus: 400,
    requestBody: {
      rollNumber: '24CSE105',
      name: '',
      email: 'test@college.edu',
      phone: '9876543210',
      department: 'Information Technology',
      year: '1st Year',
      section: 'A',
      dateOfBirth: '2005-01-01'
    }
  },
  {
    id: 'err_invalid_email',
    name: '8. POST - Invalid Email (Validation)',
    category: 'Validation',
    method: 'POST',
    endpoint: '/api/students',
    description: 'Sends malformed email address. Expects 400 Bad Request.',
    expectedStatus: 400,
    requestBody: {
      rollNumber: '24CSE106',
      name: 'Rahul Sen',
      email: 'not-an-email',
      phone: '9876543210',
      department: 'Information Technology',
      year: '1st Year',
      section: 'A',
      dateOfBirth: '2005-01-01'
    }
  },
  {
    id: 'err_duplicate_roll',
    name: '9. POST - Duplicate Roll Number (Conflict)',
    category: 'Errors',
    method: 'POST',
    endpoint: '/api/students',
    description: 'Sends roll number that already exists (e.g. 24CSE101). Expects 409 Conflict.',
    expectedStatus: 409,
    requestBody: {
      rollNumber: '24CSE101',
      name: 'Clone Student',
      email: 'clone@college.edu',
      phone: '9876543210',
      department: 'Civil Engineering',
      year: '1st Year',
      section: 'A',
      dateOfBirth: '2005-01-01'
    }
  },
  {
    id: 'err_not_found',
    name: '10. GET - Invalid Student ID (Not Found)',
    category: 'Errors',
    method: 'GET',
    endpoint: '/api/students/9999',
    description: 'Requests student with non-existent ID. Expects 404 Not Found.',
    expectedStatus: 404
  }
];

interface ApiTesterViewProps {
  onRefreshStudentList: () => void;
}

export const ApiTesterView: React.FC<ApiTesterViewProps> = ({ onRefreshStudentList }) => {
  const [selectedCase, setSelectedCase] = useState<TestCase>(PRESET_TEST_CASES[0]);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [endpoint, setEndpoint] = useState('/api/students');
  const [requestBodyText, setRequestBodyText] = useState(
    JSON.stringify(PRESET_TEST_CASES[0].requestBody, null, 2)
  );
  const [response, setResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const [backendMode, setBackendModeState] = useState<'simulated' | 'live'>(getBackendMode());
  const [backendUrl, setBackendUrlState] = useState<string>(getBackendUrl());

  const handleSelectCase = (tc: TestCase) => {
    setSelectedCase(tc);
    setMethod(tc.method);
    setEndpoint(tc.endpoint);
    setRequestBodyText(tc.requestBody ? JSON.stringify(tc.requestBody, null, 2) : '');
    setResponse(null);
  };

  const handleBackendModeToggle = (mode: 'simulated' | 'live') => {
    setBackendModeState(mode);
    setBackendMode(mode);
  };

  const handleBackendUrlChange = (val: string) => {
    setBackendUrlState(val);
    setBackendUrl(val);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponse(null);

    try {
      let result: any;
      let body: any = null;

      if (requestBodyText && (method === 'POST' || method === 'PUT')) {
        try {
          body = JSON.parse(requestBodyText);
        } catch (err) {
          setResponse({
            status: 400,
            statusText: 'BAD REQUEST',
            error: 'Malformed JSON syntax in request body',
            durationMs: 1
          });
          setIsLoading(false);
          return;
        }
      }

      // Execute based on endpoint pattern
      if (endpoint === '/api/students' && method === 'GET') {
        result = await studentApi.getAllStudents();
      } else if (endpoint === '/api/students' && method === 'POST') {
        result = await studentApi.createStudent(body);
      } else if (endpoint.startsWith('/api/students/search')) {
        const query = new URLSearchParams(endpoint.split('?')[1] || '').get('name') || '';
        result = await studentApi.searchStudents(query);
      } else if (endpoint.match(/^\/api\/students\/\d+$/) && method === 'GET') {
        const id = parseInt(endpoint.split('/')[3], 10);
        result = await studentApi.getStudentById(id);
      } else if (endpoint.match(/^\/api\/students\/\d+$/) && method === 'PUT') {
        const id = parseInt(endpoint.split('/')[3], 10);
        result = await studentApi.updateStudent(id, body);
      } else if (endpoint.match(/^\/api\/students\/\d+$/) && method === 'DELETE') {
        const id = parseInt(endpoint.split('/')[3], 10);
        result = await studentApi.deleteStudent(id);
      } else {
        result = {
          status: 404,
          statusText: 'NOT FOUND',
          error: 'Endpoint not recognized by REST simulator',
          durationMs: 5
        };
      }

      setResponse(result);
      onRefreshStudentList();
    } catch (err: any) {
      setResponse({
        status: 500,
        statusText: 'SERVER ERROR',
        error: err.message || 'Internal error',
        durationMs: 10
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponseJson = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (status === 400) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (status === 404) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    }
    if (status === 409) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Mode Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              Interactive REST API & Postman Simulator
            </h2>
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Spring Boot Endpoints
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Test all CRUD endpoints, verify response JSON payloads, error status codes, and HTTP headers.
          </p>
        </div>

        {/* Backend Target Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-semibold px-1">Target Engine:</span>
          <button
            onClick={() => handleBackendModeToggle('simulated')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              backendMode === 'simulated'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Built-in Simulator
          </button>
          <button
            onClick={() => handleBackendModeToggle('live')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              backendMode === 'live'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Spring Boot Server
          </button>
        </div>
      </div>

      {backendMode === 'live' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold block">Connecting to local Spring Boot backend:</span>
            <span>Make sure your Spring Boot app is running on port 8080 and CORS is enabled.</span>
          </div>
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => handleBackendUrlChange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-mono text-xs max-w-xs"
            placeholder="http://localhost:8080"
          />
        </div>
      )}

      {/* Main Grid: Scenarios List + Request/Response Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Test Scenarios */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pre-Configured Test Cases
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              {PRESET_TEST_CASES.length} Cases
            </span>
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {PRESET_TEST_CASES.map((tc) => {
              const isSelected = selectedCase.id === tc.id;
              const methodColor =
                tc.method === 'GET'
                  ? 'bg-blue-100 text-blue-700'
                  : tc.method === 'POST'
                  ? 'bg-emerald-100 text-emerald-700'
                  : tc.method === 'PUT'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700';

              return (
                <button
                  key={tc.id}
                  onClick={() => handleSelectCase(tc)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate">{tc.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${methodColor}`}>
                      {tc.method}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono">{tc.endpoint}</span>
                    <span className="font-medium text-slate-400">Exp: {tc.expectedStatus}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Request & Response Window */}
        <div className="lg:col-span-8 space-y-4">
          {/* Request Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Method select */}
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className={`text-xs font-bold font-mono px-3 py-2 rounded-xl border focus:outline-hidden ${
                  method === 'GET'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : method === 'POST'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : method === 'PUT'
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              {/* Endpoint input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/api/students"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Description Info */}
            <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <strong className="text-slate-700">Scenario:</strong> {selectedCase.description}
            </p>

            {/* Request Body (for POST/PUT) */}
            {(method === 'POST' || method === 'PUT') && (
              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-semibold text-slate-700">JSON Request Body</span>
                  <span className="text-slate-400 font-mono text-[10px]">Content-Type: application/json</span>
                </div>
                <textarea
                  value={requestBodyText}
                  onChange={(e) => setRequestBodyText(e.target.value)}
                  rows={7}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Response Window */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Response Window
                </h4>
                {response && (
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                      response.status
                    )}`}
                  >
                    HTTP {response.status} {response.statusText}
                  </span>
                )}
                {response?.durationMs !== undefined && (
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {response.durationMs}ms
                  </span>
                )}
              </div>

              {response && (
                <button
                  onClick={copyResponseJson}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Response Payload Viewer */}
            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto min-h-[220px] max-h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Executing HTTP Request...</span>
                </div>
              ) : response ? (
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {JSON.stringify(response.data || response, null, 2)}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <Terminal className="w-8 h-8 opacity-40 mb-2" />
                  <p>Click "Send Request" to test endpoint and view HTTP response payload.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
