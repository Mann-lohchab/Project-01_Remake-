import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  Plus,
  Edit3,
  BookOpen,
  Folder,
  FolderOpen,
  Search,
  MoreVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Subject {
  id: string;
  name: string;
  notebooks: Notebook[];
  isExpanded: boolean;
}

interface Notebook {
  id: string;
  title: string;
  color: string;
  noteCount: number;
}

interface PinnedNote {
  id: string;
  title: string;
  content: string;
  color: 'yellow' | 'red' | 'blue' | 'green';
  date: string;
}

const NoteTakingDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data from API
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Mathematics',
      isExpanded: true,
      notebooks: [
        { id: '1', title: 'Calculus Notes', color: '#FF6B6B', noteCount: 12 },
        { id: '2', title: 'Linear Algebra', color: '#4ECDC4', noteCount: 8 },
        { id: '3', title: 'Statistics', color: '#45B7D1', noteCount: 15 },
      ]
    },
    {
      id: '2',
      name: 'Computer Science',
      isExpanded: false,
      notebooks: [
        { id: '4', title: 'Data Structures', color: '#96CEB4', noteCount: 20 },
        { id: '5', title: 'Algorithms', color: '#FFEAA7', noteCount: 18 },
      ]
    },
    {
      id: '3',
      name: 'Physics',
      isExpanded: false,
      notebooks: [
        { id: '6', title: 'Quantum Physics', color: '#DDA0DD', noteCount: 10 },
        { id: '7', title: 'Thermodynamics', color: '#98D8C8', noteCount: 14 },
      ]
    }
  ]);

  const [pinnedNotes] = useState<PinnedNote[]>([
    {
      id: '1',
      title: 'Important Formula',
      content: 'E = mc² - Einstein\'s mass-energy equivalence',
      color: 'yellow',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: 'Discuss project timeline and deliverables',
      color: 'red',
      date: '2024-01-14'
    },
    {
      id: '3',
      title: 'Code Snippet',
      content: 'const fibonacci = n => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);',
      color: 'blue',
      date: '2024-01-13'
    },
    {
      id: '4',
      title: 'Research Link',
      content: 'https://arxiv.org/abs/quant-ph/9703044',
      color: 'green',
      date: '2024-01-12'
    }
  ]);

  const toggleSubject = (subjectId: string) => {
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, isExpanded: !subject.isExpanded }
        : subject
    ));
  };

  const handleLogout = () => {
    logout();
  };

  const getStickyNoteClasses = (color: string) => {
    const classes = {
      yellow: 'bg-yellow-200 border-yellow-300 shadow-yellow-200/50',
      red: 'bg-red-200 border-red-300 shadow-red-200/50',
      blue: 'bg-blue-200 border-blue-300 shadow-blue-200/50',
      green: 'bg-green-200 border-green-300 shadow-green-200/50'
    };
    return classes[color as keyof typeof classes] || classes.yellow;
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-semibold text-white">Notebooks</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notebooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Subjects/Notebooks */}
        <div className="flex-1 overflow-y-auto p-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="mb-2">
              <button
                onClick={() => toggleSubject(subject.id)}
                className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors text-left ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
              >
                {subject.isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                )}
                {!sidebarCollapsed && (
                  <>
                    {subject.isExpanded ? (
                      <FolderOpen className="h-4 w-4 text-blue-400 mr-2" />
                    ) : (
                      <Folder className="h-4 w-4 text-blue-400 mr-2" />
                    )}
                    <span className="text-sm font-medium text-white truncate">
                      {subject.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {subject.notebooks.length}
                    </span>
                  </>
                )}
              </button>

              {!sidebarCollapsed && subject.isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {subject.notebooks.map((notebook) => (
                    <div
                      key={notebook.id}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer group"
                    >
                      <div
                        className="w-3 h-3 rounded mr-3 border border-gray-600"
                        style={{ backgroundColor: notebook.color }}
                      />
                      <span className="text-sm text-gray-300 truncate flex-1">
                        {notebook.title}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {notebook.noteCount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">School Notes</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {/* Pinned Notes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Pinned Notes</h2>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border-2 shadow-lg transform rotate-1 hover:rotate-0 transition-transform cursor-pointer ${getStickyNoteClasses(note.color)}`}
                  style={{ backgroundColor: note.color === 'yellow' ? '#FEF3C7' :
                                          note.color === 'red' ? '#FECACA' :
                                          note.color === 'blue' ? '#BFDBFE' :
                                          '#BBF7D0' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{note.title}</h3>
                    <Edit3 className="h-3 w-3 text-gray-600 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-xs text-gray-700 mb-2 line-clamp-3">{note.content}</p>
                  <div className="text-xs text-gray-500">{note.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notebooks Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">My Notebooks</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {subjects.flatMap(subject => subject.notebooks).map((notebook) => (
                <div
                  key={notebook.id}
                  className="group cursor-pointer transform hover:scale-105 transition-transform"
                >
                  <div className="relative mb-3">
                    {/* Book spine */}
                    <div
                      className="h-32 w-16 rounded-r-lg shadow-lg border-r-4 border-gray-300 relative"
                      style={{ backgroundColor: notebook.color }}
                    >
                      {/* Book pages effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-r-lg"></div>
                      {/* Book binding */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-800 rounded-r"></div>
                    </div>
                    {/* Book title on spine */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-xs font-medium text-white transform -rotate-90 whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ maxWidth: '120px' }}
                      >
                        {notebook.title}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-1 truncate">
                      {notebook.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {notebook.noteCount} notes
                    </p>
                  </div>
                </div>
              ))}

              {/* Add new book placeholders */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="group cursor-pointer transform hover:scale-105 transition-transform"
                >
                  <div className="h-32 w-16 rounded-r-lg border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-500 transition-colors">
                    <Plus className="h-6 w-6 text-gray-500 group-hover:text-gray-400" />
                  </div>
                  <div className="text-center mt-3">
                    <p className="text-xs text-gray-500">Add new book here</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteTakingDashboard;