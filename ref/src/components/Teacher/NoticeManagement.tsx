import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface Notice {
  id?: string;
  title: string;
  description: string;
  targetGrade?: number;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  date: string;
  expiryDate?: string;
  isActive: boolean;
}

const NoticeManagement: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<Notice>({
    title: '',
    description: '',
    targetGrade: undefined,
    priority: 'Medium',
    date: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    try {
      // Load from localStorage to persist data across sessions
      const savedNotices = localStorage.getItem('teacher_notices');
      if (savedNotices) {
        setNotices(JSON.parse(savedNotices));
      }
    } catch (error) {
      console.error('Error loading notices:', error);
      setMessage({ type: 'error', text: 'Failed to load notices' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Notice, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetGrade: undefined,
      priority: 'Medium',
      date: new Date().toISOString().split('T')[0],
      expiryDate: '',
      isActive: true
    });
    setEditingNotice(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingNotice) {
        // Update existing notice
        const updatedNotice = { ...formData, id: editingNotice.id };
        const updatedNotices = notices.map(notice => notice.id === editingNotice.id ? updatedNotice : notice);
        setNotices(updatedNotices);
        localStorage.setItem('teacher_notices', JSON.stringify(updatedNotices));
        setMessage({ type: 'success', text: 'Notice updated successfully!' });
      } else {
        // Create new notice
        await teacherAPI.createNotice(formData);
        const newNotice = { ...formData, id: Date.now().toString() };
        const updatedNotices = [newNotice, ...notices];
        setNotices(updatedNotices);
        localStorage.setItem('teacher_notices', JSON.stringify(updatedNotices));
        setMessage({ type: 'success', text: 'Notice created successfully!' });
      }
      
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving notice:', error);
      setMessage({ type: 'error', text: 'Failed to save notice' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (notice: Notice) => {
    setFormData(notice);
    setEditingNotice(notice);
    setShowCreateForm(true);
  };

  const handleDelete = (noticeId: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      const updatedNotices = notices.filter(notice => notice.id !== noticeId);
      setNotices(updatedNotices);
      localStorage.setItem('teacher_notices', JSON.stringify(updatedNotices));
      setMessage({ type: 'success', text: 'Notice deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleNoticeStatus = (noticeId: string) => {
    const updatedNotices = notices.map(notice => 
      notice.id === noticeId 
        ? { ...notice, isActive: !notice.isActive }
        : notice
    );
    setNotices(updatedNotices);
    localStorage.setItem('teacher_notices', JSON.stringify(updatedNotices));
  };


  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return { bg: '#fee2e2', text: '#991b1b' };
      case 'High': return { bg: '#fef3c7', text: '#92400e' };
      case 'Medium': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Low': return { bg: '#d1fae5', text: '#065f46' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Notice Management</h1>
          <p style={{ color: '#6b7280' }}>Create and manage announcements for students</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            background: '#ef4444',
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
          <span>📢</span> Create Notice
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
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
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
                    placeholder="Enter notice title..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Enter detailed notice description..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Priority *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Target Grade (Optional)
                    </label>
                    <select
                      value={formData.targetGrade || ''}
                      onChange={(e) => handleInputChange('targetGrade', e.target.value ? parseInt(e.target.value) : '')}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">All Grades</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
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
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      min={formData.date}
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

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="isActive" style={{ fontWeight: '500', cursor: 'pointer' }}>
                    Publish notice immediately
                  </label>
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
                    background: saving ? '#9ca3af' : '#ef4444',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {saving ? 'Saving...' : (editingNotice ? 'Update' : 'Create')} Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notices List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {loading ? (
          <div style={{
            background: 'white',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ color: '#6b7280' }}>Loading notices...</div>
          </div>
        ) : notices.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📢</div>
            <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '10px' }}>
              No notices created yet
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Click "Create Notice" to start sending announcements to students
            </p>
          </div>
        ) : (
          notices.map((notice) => {
            const priorityColors = getPriorityBadgeColor(notice.priority);
            const expired = isExpired(notice.expiryDate);
            
            return (
              <div
                key={notice.id}
                style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `2px solid ${expired ? '#fecaca' : (notice.isActive ? '#a7f3d0' : '#e5e7eb')}`,
                  opacity: notice.isActive && !expired ? 1 : 0.7
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '10px'
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#111827',
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        {notice.title}
                      </h3>
                      
                      <span style={{
                        background: priorityColors.bg,
                        color: priorityColors.text,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {notice.priority}
                      </span>

                      {expired && (
                        <span style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Expired
                        </span>
                      )}

                      {!notice.isActive && !expired && (
                        <span style={{
                          background: '#f3f4f6',
                          color: '#6b7280',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Draft
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '15px'
                    }}>
                      <span>📅 {new Date(notice.date).toLocaleDateString()}</span>
                      {notice.targetGrade && <span>🎯 Grade {notice.targetGrade}</span>}
                      {notice.expiryDate && (
                        <span>⏰ Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    <p style={{
                      margin: 0,
                      color: '#374151',
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {notice.description}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '8px',
                    marginLeft: '20px'
                  }}>
                    <button
                      onClick={() => toggleNoticeStatus(notice.id!)}
                      style={{
                        background: notice.isActive ? '#fbbf24' : '#10b981',
                        color: 'white',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {notice.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(notice)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id!)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NoticeManagement;