import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Class, Teacher, Student } from '../../types';
import { UserCheck, Plus, Edit, Trash2, Search, Users, BookOpen, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClassesManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    grade: '',
    section: '',
    teacherId: '',
    academicYear: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesData, teachersData, studentsData] = await Promise.all([
        adminAPI.getClasses(),
        adminAPI.getTeachers(),
        adminAPI.getStudents()
      ]);
      setClasses(classesData);
      setTeachers(teachersData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const classData = {
        ...formData,
        grade: parseInt(formData.grade),
        teacherId: formData.teacherId || undefined
      };

      if (editingClass) {
        await adminAPI.updateClass(editingClass._id!, classData);
      } else {
        await adminAPI.createClass(classData);
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      className: classItem.className,
      grade: classItem.grade.toString(),
      section: classItem.section,
      teacherId: classItem.teacherId?._id || '',
      academicYear: classItem.academicYear
    });
    setShowAddForm(true);
  };

  const handleDelete = async (classItem: Class) => {
    if (window.confirm(`Are you sure you want to delete ${classItem.className}?`)) {
      try {
        await adminAPI.deleteClass(classItem._id!);
        fetchData();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const handleAssignTeacher = async (classId: string, teacherId: string) => {
    try {
      await adminAPI.assignTeacherToClass({ classId, teacherId });
      fetchData();
    } catch (error) {
      console.error('Error assigning teacher:', error);
    }
  };

  const handleAddStudent = async (classId: string, studentId: string) => {
    try {
      await adminAPI.addStudentToClass({ classId, studentId });
      fetchData();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleRemoveStudent = async (classId: string, studentId: string) => {
    try {
      await adminAPI.removeStudentFromClass({ classId, studentId });
      fetchData();
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      grade: '',
      section: '',
      teacherId: '',
      academicYear: ''
    });
    setEditingClass(null);
    setShowAddForm(false);
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.teacherId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.teacherId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailableStudents = (classItem: Class) => {
    return students.filter(student =>
      student.grade === classItem.grade &&
      !classItem.students.some(classStudent => classStudent._id === student._id)
    );
  };

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
            <h1 className="text-2xl font-bold">Classes Management</h1>
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
              placeholder="Search classes..."
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
            <span>Add Class</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#252422] mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Class Name</label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
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
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  className="w-full px-3 py-2 border  text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                  maxLength={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Class Teacher</label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                  className="w-full px-3 py-2 border  text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                >
                  <option value="">Select Teacher (Optional)</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName} ({teacher.subject})
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingClass ? 'Update Class' : 'Add Class'}
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

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <div key={classItem._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#252422]">{classItem.className}</h3>
                  <p className="text-sm text-[#ccc5b9]">Grade {classItem.grade} - Section {classItem.section}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(classItem)}
                    className="text-[#eb5e28] hover:text-[#d54d1f] transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(classItem)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#252422]">Class Teacher:</p>
                  {classItem.teacherId ? (
                    <p className="text-sm text-[#ccc5b9]">
                      {classItem.teacherId.firstName} {classItem.teacherId.lastName}
                    </p>
                  ) : (
                    <select
                      onChange={(e) => handleAssignTeacher(classItem._id!, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-[#ccc5b9] rounded focus:outline-none focus:ring-1 focus:ring-[#eb5e28]"
                      defaultValue=""
                    >
                      <option value="" disabled>Assign Teacher</option>
                      {teachers.filter(t => !classes.some(c => c.teacherId?._id === t._id)).map(teacher => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.firstName} {teacher.lastName} ({teacher.subject})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-[#252422]">Students: {classItem.students.length}</p>
                  <button
                    onClick={() => {
                      setSelectedClass(classItem);
                      setShowStudentModal(true);
                    }}
                    className="text-sm text-[#eb5e28] hover:text-[#d54d1f] transition-colors"
                  >
                    Manage Students
                  </button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-[#ccc5b9]">
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{classItem.students.length}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen size={14} />
                    <span>{classItem.academicYear}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-8 text-[#ccc5b9]">
            {searchTerm ? 'No classes found matching your search.' : 'No classes created yet.'}
          </div>
        )}

        {/* Student Management Modal */}
        {showStudentModal && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-[#252422]">
                    Manage Students - {selectedClass.className}
                  </h2>
                  <button
                    onClick={() => setShowStudentModal(false)}
                    className="text-[#ccc5b9] hover:text-[#252422] transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Students */}
                  <div>
                    <h3 className="text-lg font-medium text-[#252422] mb-4">Current Students ({selectedClass.students.length})</h3>
                    <div className="space-y-2">
                      {selectedClass.students.map((student) => (
                        <div key={student._id} className="flex justify-between items-center p-3 bg-[#fffcf2] rounded-lg">
                          <div>
                            <p className="font-medium text-[#252422]">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-[#ccc5b9]">ID: {student.studentID}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveStudent(selectedClass._id!, student._id!)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <UserMinus size={16} />
                          </button>
                        </div>
                      ))}
                      {selectedClass.students.length === 0 && (
                        <p className="text-[#ccc5b9] text-center py-4">No students in this class</p>
                      )}
                    </div>
                  </div>

                  {/* Available Students */}
                  <div>
                    <h3 className="text-lg font-medium text-[#252422] mb-4">Available Students</h3>
                    <div className="space-y-2">
                      {getAvailableStudents(selectedClass).map((student) => (
                        <div key={student._id} className="flex justify-between items-center p-3 border border-[#ccc5b9] rounded-lg">
                          <div>
                            <p className="font-medium text-[#252422]">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-[#ccc5b9]">ID: {student.studentID}</p>
                          </div>
                          <button
                            onClick={() => handleAddStudent(selectedClass._id!, student._id!)}
                            className="text-[#eb5e28] hover:text-[#d54d1f] transition-colors"
                          >
                            <UserPlus size={16} />
                          </button>
                        </div>
                      ))}
                      {getAvailableStudents(selectedClass).length === 0 && (
                        <p className="text-[#ccc5b9] text-center py-4">No available students for this grade</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesManagement;