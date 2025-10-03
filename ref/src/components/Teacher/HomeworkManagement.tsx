import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface Homework {
  id?: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  assignDate: string;
  dueDate: string;
  instructions?: string;
}

const HomeworkManagement: React.FC = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<Homework>({
    title: '',
    description: '',
    subject: '',
    grade: 1,
    assignDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    instructions: ''
  });

  useEffect(() => {
    loadHomeworks();
  }, []);

  const loadHomeworks = async () => {
    setLoading(true);
    try {
      // Load from localStorage to persist data across sessions
      const savedHomeworks = localStorage.getItem('teacher_homeworks');
      if (savedHomeworks) {
        setHomeworks(JSON.parse(savedHomeworks));
      }
    } catch (error) {
      console.error('Error loading homeworks:', error);
      setMessage({ type: 'error', text: 'Failed to load homeworks' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Homework, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      grade: 1,
      assignDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      instructions: ''
    });
    setEditingHomework(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingHomework) {
        // Update existing homework
        const updatedHomework = { ...formData, id: editingHomework.id };
        const updatedHomeworks = homeworks.map(hw => hw.id === editingHomework.id ? updatedHomework : hw);
        setHomeworks(updatedHomeworks);
        localStorage.setItem('teacher_homeworks', JSON.stringify(updatedHomeworks));
        setMessage({ type: 'success', text: 'Homework updated successfully!' });
      } else {
        // Create new homework
        try {
          await teacherAPI.createHomework(formData);
        } catch (apiError) {
          console.warn('API call failed, storing locally:', apiError);
        }
        const newHomework = { ...formData, id: Date.now().toString() };
        const updatedHomeworks = [newHomework, ...homeworks];
        setHomeworks(updatedHomeworks);
        localStorage.setItem('teacher_homeworks', JSON.stringify(updatedHomeworks));
        setMessage({ type: 'success', text: 'Homework created successfully!' });
      }
      
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving homework:', error);
      setMessage({ type: 'error', text: 'Failed to save homework' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (homework: Homework) => {
    setFormData(homework);
    setEditingHomework(homework);
    setShowCreateForm(true);
  };

  const handleDelete = (homeworkId: string) => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      const updatedHomeworks = homeworks.filter(hw => hw.id !== homeworkId);
      setHomeworks(updatedHomeworks);
      localStorage.setItem('teacher_homeworks', JSON.stringify(updatedHomeworks));
      setMessage({ type: 'success', text: 'Homework deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const subjects = [
    'Mathematics', 'Science', 'English', 'Social Studies', 'History',
    'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Art', 'Music', 'Physical Education'
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Homework Management</h1>
          <p style={{ color: '#6b7280' }}>Create and manage assignments for your students</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span> Create Homework
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>
                {editingHomework ? 'Edit Homework' : 'Create New Homework'}
              </h2>
              <button
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Grade *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Assign Date *
                    </label>
                    <input
                      type="date"
                      value={formData.assignDate}
                      onChange={(e) => handleInputChange('assignDate', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      required
                      min={formData.assignDate}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Additional Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Any additional instructions for students..."
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '25px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: saving ? '#9ca3af' : '#10b981',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {saving ? 'Saving...' : (editingHomework ? 'Update' : 'Create')} Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Homework List */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading homeworks...
          </div>
        ) : homeworks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📚</div>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>
              No homework assignments yet
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Click "Create Homework" to get started
            </p>
          </div>
        ) : (
          <div>
            <div style={{
              background: '#f9fafb',
              padding: '15px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 150px',
              fontWeight: '600',
              color: '#374151'
            }}>
              <div>Title & Description</div>
              <div>Subject</div>
              <div>Grade</div>
              <div>Due Date</div>
              <div>Actions</div>
            </div>

            {homeworks.map((homework, index) => (
              <div
                key={homework.id}
                style={{
                  padding: '20px',
                  borderBottom: index < homeworks.length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 150px',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#f9fafb'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#111827' }}>
                    {homework.title}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    color: '#6b7280', 
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {homework.description}
                  </p>
                </div>
                <div style={{ color: '#374151', fontWeight: '500' }}>
                  {homework.subject}
                </div>
                <div style={{ color: '#6b7280' }}>
                  Grade {homework.grade}
                </div>
                <div style={{ color: '#374151' }}>
                  {new Date(homework.dueDate).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(homework)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '6px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => homework.id && handleDelete(homework.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '6px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeworkManagement;