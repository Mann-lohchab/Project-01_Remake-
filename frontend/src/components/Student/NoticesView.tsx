import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface NoticeItem {
  _id: string;
  studentID: string;
  title: string;
  description: string;
  date: string;
  priority?: 'High' | 'Medium' | 'Low';
  category?: 'Academic' | 'Administrative' | 'Event' | 'Holiday' | 'Emergency';
  readStatus?: boolean;
}

const NoticesView: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getStudentId = () => {
    return (user as any)?.studentID || 
           (user as any)?.studentId || 
           (user as any)?.student_id || 
           (user as any)?.id;
  };

  const fetchNotices = async () => {
    if (!user || user.role !== 'student') {
      setError('User not authenticated as student');
      setLoading(false);
      return;
    }

    const studentId = getStudentId();
    if (!studentId) {
      setError('Student ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await studentAPI.getNotices(studentId);

      // Controller returns direct array or 404 error
      if (Array.isArray(response)) {
        setNotices(response);
      } else {
        setNotices([]);
      }

    } catch (err: any) {
      console.error('Error fetching notices:', err);
      
      // Handle specific 404 case from controller
      if (err.response?.status === 404) {
        setNotices([]);
        setError('No notices available at this time');
      } else if (err.response?.status === 500) {
        setError('Server error while fetching notices');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch notices');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [user]);

  const markAsRead = async (noticeId: string) => {
    try {
      // Update local state optimistically
      setNotices(prevNotices => 
        prevNotices.map(notice => 
          notice._id === noticeId 
            ? { ...notice, readStatus: true }
            : notice
        )
      );
      
      // In a real implementation, you'd call an API to update read status
      // await studentAPI.markNoticeAsRead(noticeId);
    } catch (error) {
      console.error('Error marking notice as read:', error);
      // Revert optimistic update on error
      setNotices(prevNotices => 
        prevNotices.map(notice => 
          notice._id === noticeId 
            ? { ...notice, readStatus: false }
            : notice
        )
      );
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ef4444',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div>Loading notices...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const unreadNotices = notices.filter(notice => !notice.readStatus);
  const urgentNotices = notices.filter(notice => notice.priority === 'High');

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string | undefined) => {
    switch (category) {
      case 'Academic': return '📚';
      case 'Administrative': return '📋';
      case 'Event': return '🎉';
      case 'Holiday': return '🏖️';
      case 'Emergency': return '🚨';
      default: return '📄';
    }
  };

  const getCategoryColor = (category: string | undefined) => {
    switch (category) {
      case 'Academic': return '#3b82f6';
      case 'Administrative': return '#8b5cf6';
      case 'Event': return '#10b981';
      case 'Holiday': return '#f59e0b';
      case 'Emergency': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      {/* Error Display */}
      {error && (
        <div style={{ 
          color: '#dc2626', 
          padding: '15px', 
          textAlign: 'center',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          border: '1px solid #fca5a5',
          marginBottom: '20px'
        }}>
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* Overview Statistics */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#ef4444', marginBottom: '15px' }}>Notices Overview</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '15px',
          textAlign: 'center' 
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
              {urgentNotices.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Urgent</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
              {unreadNotices.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Unread</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
              {notices.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total</div>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h4 style={{ marginBottom: '15px' }}>All Notices</h4>
        
        {notices.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            color: '#6b7280' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
            <div style={{ fontSize: '18px', marginBottom: '5px', color: '#374151' }}>
              No notices available
            </div>
            <div style={{ fontSize: '14px' }}>
              Check back later for important announcements
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {notices.map((notice) => (
              <div 
                key={notice._id}
                onClick={() => !notice.readStatus && markAsRead(notice._id)}
                style={{ 
                  padding: '20px', 
                  marginBottom: '15px',
                  borderRadius: '8px',
                  backgroundColor: !notice.readStatus ? '#f0f9ff' : 'white',
                  border: `1px solid ${!notice.readStatus ? '#3b82f6' : '#e5e7eb'}`,
                  boxShadow: !notice.readStatus ? '0 2px 4px rgba(59, 130, 246, 0.1)' : 'none',
                  cursor: !notice.readStatus ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '20px' }}>{getCategoryIcon(notice.category)}</span>
                      <h5 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600',
                        margin: 0,
                        color: !notice.readStatus ? '#1f2937' : '#4b5563'
                      }}>
                        {notice.title}
                      </h5>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {notice.priority && (
                        <span style={{ 
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                          backgroundColor: `${getPriorityColor(notice.priority)}20`,
                          color: getPriorityColor(notice.priority)
                        }}>
                          {notice.priority} Priority
                        </span>
                      )}
                      {notice.category && (
                        <span style={{ 
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                          backgroundColor: `${getCategoryColor(notice.category)}20`,
                          color: getCategoryColor(notice.category)
                        }}>
                          {notice.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: '5px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(notice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    {!notice.readStatus && (
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: '500'
                      }}>
                        NEW
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ 
                  color: '#4b5563',
                  lineHeight: '1.6',
                  fontSize: '14px',
                  marginTop: '10px'
                }}>
                  {notice.description}
                </div>
                {!notice.readStatus && (
                  <div style={{
                    marginTop: '10px',
                    fontSize: '11px',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    Click to mark as read
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticesView;
