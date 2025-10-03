import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Student } from '../../types';
import { Users, Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    studentID: '',
    firstName: '',
    lastName: '',
    fathersName: '',
    mothersName: '',
    Address: '',
    grade: '',
    email: '',
    password: '',
    section: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await adminAPI.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Update student
        await adminAPI.updateStudent(editingStudent._id!, {
          ...formData,
          grade: parseInt(formData.grade)
        });
      } else {
        // Add new student
        await adminAPI.addStudent({
          ...formData,
          grade: parseInt(formData.grade)
        });
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentID: student.studentID,
      firstName: student.firstName,
      lastName: student.lastName || '',
      fathersName: student.fathersName,
      mothersName: student.mothersName,
      Address: student.address,
      grade: student.grade.toString(),
      email: student.email,
      password: '', // Don't populate password for security
      section: student.section || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await adminAPI.deleteStudent(student._id!);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentID: '',
      firstName: '',
      lastName: '',
      fathersName: '',
      mothersName: '',
      Address: '',
      grade: '',
      email: '',
      password: '',
      section: ''
    });
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-bold">Student Management</h1>
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Student</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#252422] mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Student ID</label>
                <input
                  type="text"
                  value={formData.studentID}
                  onChange={(e) => setFormData({...formData, studentID: e.target.value})}
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
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Father's Name</label>
                <input
                  type="text"
                  value={formData.fathersName}
                  onChange={(e) => setFormData({...formData, fathersName: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={formData.mothersName}
                  onChange={(e) => setFormData({...formData, mothersName: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
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
                <label className="block text-sm font-medium text-[#252422] mb-1">Grade</label>
                <input
                  type="number"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
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
              {!editingStudent && (
                <div>
                  <label className="block text-sm font-medium text-[#252422] mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                    required={!editingStudent}
                  />
                </div>
              )}
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
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

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#252422] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#ccc5b9]">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-[#fffcf2]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{student.studentID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{student.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{student.section || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-[#eb5e28] hover:text-[#d54d1f] transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
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
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-[#ccc5b9]">
              {searchTerm ? 'No students found matching your search.' : 'No students registered yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;