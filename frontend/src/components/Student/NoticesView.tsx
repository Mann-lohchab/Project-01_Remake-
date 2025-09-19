import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

interface NoticeItem {
  _id: string;
  studentId?: string;
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

  useEffect(() => {
    const fetchNotices = async () => {
      if (!user || user.role !== 'student') return;
      const student = user as Student;
      
      try {
        setLoading(true);
        const data = await studentAPI.getNotices(student.studentID);
        setNotices(Array.isArray(data) ? data : data.notices || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch notices data');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [user]);

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading notices...');
  }

  if (error) {
    return React.createElement('div', { 
      style: { 
        color: '#dc2626', 
        padding: '20px', 
        textAlign: 'center' 
      } 
    }, `Error: ${error}`);
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

  return React.createElement('div', null,
    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    },
      React.createElement('h3', { style: { color: '#ef4444', marginBottom: '15px' } }, 'Notices Overview'),
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '15px',
          textAlign: 'center' 
        }
      },
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ef4444' 
            } 
          }, urgentNotices.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Urgent')
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#3b82f6' 
            } 
          }, unreadNotices.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Unread')
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#10b981' 
            } 
          }, notices.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Total')
        )
      )
    ),

    React.createElement('div', { 
      style: { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }
    },
      React.createElement('h4', { style: { marginBottom: '15px' } }, 'All Notices'),
      notices.length === 0 ? 
        React.createElement('div', { 
          style: { 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280' 
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '📄'),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '5px' } }, 'No notices available'),
          React.createElement('div', { style: { fontSize: '14px' } }, 'Check back later for important announcements')
        ) :
        React.createElement('div', { 
          style: { 
            maxHeight: '600px', 
            overflowY: 'auto' 
          }
        },
          ...notices.map((notice) => 
            React.createElement('div', { 
              key: notice._id,
              style: { 
                padding: '20px', 
                marginBottom: '15px',
                borderRadius: '8px',
                backgroundColor: !notice.readStatus ? '#f8fafc' : 'white',
                border: `1px solid ${!notice.readStatus ? '#cbd5e1' : '#e5e7eb'}`,
                boxShadow: !notice.readStatus ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }
            },
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }
              },
                React.createElement('div', { 
                  style: { 
                    flex: 1 
                  }
                },
                  React.createElement('h5', { 
                    style: { 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '5px',
                      color: !notice.readStatus ? '#1f2937' : '#4b5563'
                    } 
                  }, notice.title),
                  React.createElement('div', { 
                    style: { 
                      display: 'flex', 
                      gap: '10px', 
                      flexWrap: 'wrap' 
                    }
                  },
                    notice.priority && React.createElement('span', { 
                      style: { 
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: getPriorityColor(notice.priority) + '20',
                        color: getPriorityColor(notice.priority)
                      }
                    }, notice.priority),
                    notice.category && React.createElement('span', { 
                      style: { 
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        backgroundColor: getCategoryColor(notice.category) + '20',
                        color: getCategoryColor(notice.category)
                      }
                    }, notice.category)
                  )
                ),
                React.createElement('div', { 
                  style: { 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: '5px'
                  }
                },
                  React.createElement('div', { 
                    style: { 
                      fontSize: '12px', 
                      color: '#6b7280' 
                    } 
                  }, new Date(notice.date).toLocaleDateString()),
                  !notice.readStatus && React.createElement('div', { 
                    style: { 
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6'
                    }
                  })
                )
              ),
              React.createElement('div', { 
                style: { 
                  color: '#4b5563',
                  lineHeight: '1.5',
                  fontSize: '14px'
                } 
              }, notice.description)
            )
          )
        )
    )
  );
};

export default NoticesView;