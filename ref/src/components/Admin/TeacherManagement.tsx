import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Teacher } from '../../types';
import { UserCheck, Plus, Edit, Trash2, Search, ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({ type: 'info', message: '', show: false });
  const [formData, setFormData] = useState({
    teacherID: '',
    firstName: '',
    lastName: '',
    Address: '',
    email: '',
    phone: '',
    subject: '',
    assignedClasses: [] as string[],
    password: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await adminAPI.getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        // Update teacher
        await adminAPI.updateTeacher(editingTeacher._id!, formData);
      } else {
        // Add new teacher
        await adminAPI.createTeacher(formData);
      }

      resetForm();
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      teacherID: teacher.teacherID,
      firstName: teacher.firstName,
      lastName: teacher.lastName || '',
      Address: teacher.address,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      assignedClasses: teacher.assignedClasses || [],
      password: '' // Don't populate password for security
    });
    setShowAddForm(true);
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => setNotification({ ...notification, show: false }), 5000);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;

    try {
      const response = await adminAPI.deleteTeacher(teacherToDelete._id!);
      fetchTeachers();
      setShowDeleteConfirm(false);
      setTeacherToDelete(null);

      const cascadeInfo = response.cascadeResults ?
        ` (Removed from ${response.cascadeResults.classesUpdated} classes and ${response.cascadeResults.subjectsRemoved} subjects)` : '';

      showNotification('success', `Teacher ${teacherToDelete.firstName} ${teacherToDelete.lastName || ''} deleted successfully${cascadeInfo}`);
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      showNotification('error', error.response?.data?.message || 'Failed to delete teacher. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setTeacherToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      teacherID: '',
      firstName: '',
      lastName: '',
      Address: '',
      email: '',
      phone: '',
      subject: '',
      assignedClasses: [],
      password: ''
    });
    setEditingTeacher(null);
    setShowAddForm(false);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.assignedClasses?.some(cls => cls.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = !subjectFilter || teacher.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf2] flex items-center justify-center">
        <div className="text-[#252422]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf2]">
      {/* Header */}
      <header className="bg-[#252422] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin-dashboard"
                className="flex items-center space-x-2 text-[#ccc5b9] hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Teacher Management</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search, Filter and Add */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ccc5b9] h-5 w-5" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-4 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent bg-white"
              >
                <option value="">All Subjects</option>
                {[...new Set(teachers.map(t => t.subject))].map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Teacher</span>
          </button>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'error' && <XCircle size={20} />}
            {notification.type === 'info' && <AlertTriangle size={20} />}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && teacherToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold text-[#252422]">Confirm Deletion</h3>
              </div>
              <p className="text-[#252422] mb-4">
                Are you sure you want to delete teacher <strong>{teacherToDelete.firstName} {teacherToDelete.lastName || ''}</strong>?
              </p>
              <p className="text-sm text-gray-600 mb-6">
                This action will:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Remove the teacher from all assigned classes</li>
                  <li>Remove the teacher from all subject assignments</li>
                  <li>Permanently delete all teacher data</li>
                  <li>Create an audit log of this action</li>
                </ul>
                <strong>This action cannot be undone.</strong>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#252422] px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete Teacher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#252422] mb-4">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm  text-black font-medium text-[#252422] mb-1">Teacher ID</label>
                <input
                  type="text"
                  value={formData.teacherID}
                  onChange={(e) => setFormData({...formData, teacherID: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border  text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border  text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Address</label>
                <input
                  type="text"
                  value={formData.Address}
                  onChange={(e) => setFormData({...formData, Address: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Assigned Classes</label>
                <input
                  type="text"
                  value={formData.assignedClasses.join(', ')}
                  onChange={(e) => setFormData({...formData, assignedClasses: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  placeholder="e.g. Grade 10A, Grade 11B"
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                />
              </div>
              {!editingTeacher && (
                <div>
                  <label className="block text-sm font-medium text-[#252422] mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border  text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                    required={!editingTeacher}
                  />
                </div>
              )}
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#ccc5b9] hover:bg-[#b8aea1] text-[#252422] px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#252422] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Classes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#ccc5b9]">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-[#fffcf2]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{teacher.teacherID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{teacher.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{teacher.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">
                      {teacher.assignedClasses?.join(', ') || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-[#eb5e28] hover:text-[#d54d1f] transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(teacher)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTeachers.length === 0 && (
            <div className="text-center py-8 text-[#ccc5b9]">
              {searchTerm ? 'No teachers found matching your search.' : 'No teachers registered yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;