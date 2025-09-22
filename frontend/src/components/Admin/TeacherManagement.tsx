import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Teacher } from '../../types';
import { UserCheck, Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    teacherID: '',
    firstName: '',
    lastName: '',
    Address: '',
    email: '',
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
      password: '' // Don't populate password for security
    });
    setShowAddForm(true);
  };

  const handleDelete = async (teacher: Teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`)) {
      try {
        await adminAPI.deleteTeacher(teacher._id!);
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      teacherID: '',
      firstName: '',
      lastName: '',
      Address: '',
      email: '',
      password: ''
    });
    setEditingTeacher(null);
    setShowAddForm(false);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Teacher</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#252422] mb-4">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Teacher ID</label>
                <input
                  type="text"
                  value={formData.teacherID}
                  onChange={(e) => setFormData({...formData, teacherID: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Address</label>
                <input
                  type="text"
                  value={formData.Address}
                  onChange={(e) => setFormData({...formData, Address: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              {!editingTeacher && (
                <div>
                  <label className="block text-sm font-medium text-[#252422] mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{teacher.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-[#eb5e28] hover:text-[#d54d1f] transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
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