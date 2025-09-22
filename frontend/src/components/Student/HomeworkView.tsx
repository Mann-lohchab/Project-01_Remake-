import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface HomeworkItem {
  _id: string;
  studentId: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  assignedDate: string;
  status: 'Assigned' | 'Submitted' | 'Late' | 'Graded';
  marks?: number;
  totalMarks?: number;
}

const HomeworkView: React.FC = () => {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHomework = async () => {
      if (!user || user.role !== 'student') {
        setLoading(false);
        setError('User is not logged in as a student');
        return;
      }

      const studentId = (user as any).studentID || (user as any).id;
      
      if (!studentId) {
        setError('Student ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await studentAPI.getHomework(studentId);
        
        if (Array.isArray(response)) {
          setHomework(response);
        } else {
          setHomework([]);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 404) {
          setError('Homework endpoint not found. Check API routes.');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else if (!err.response) {
          setError('Network error. Cannot reach the server.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch homework data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [user]);

  const pendingHomework = homework.filter(hw => hw.status === 'Assigned');
  const completedHomework = homework.filter(hw => hw.status === 'Submitted' || hw.status === 'Graded');
  const lateHomework = homework.filter(hw => hw.status === 'Late');

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        fontSize: '16px',
        color: '#6b7280'
      }}>
        Loading homework data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#fee2e2',
        color: '#dc2626', 
        padding: '20px', 
        textAlign: 'center',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <strong>Error:</strong> {error}
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#7f1d1d' }}>
          Check the console for detailed error information.
        </div>
      </div>
    );
  }

  const calculateCompletionPercentage = () => {
    if (homework.length === 0) return 0;
    const completedCount = completedHomework.length;
    return Math.round((completedCount / homework.length) * 100);
  };

  const percentage = calculateCompletionPercentage();

  // If no homework records
  if (homework.length === 0) {
    return (
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#10b981', marginBottom: '15px' }}>Homework Records</h3>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          No homework assignments found for your account.
        </p>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '10px' }}>
          Homework assignments will appear here once your teachers assign them.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Overview Card */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#10b981', marginBottom: '15px' }}>Homework Overview</h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          textAlign: 'center' 
        }}>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: percentage >= 75 ? '#10b981' : '#ef4444' 
            }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Completion Rate</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#3b82f6' 
            }}>
              {homework.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Assignments</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#10b981' 
            }}>
              {completedHomework.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Completed</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ef4444' 
            }}>
              {pendingHomework.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
          </div>
          {lateHomework.length > 0 && (
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#f59e0b' 
              }}>
                {lateHomework.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Late</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Homework Card */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h4 style={{ marginBottom: '15px' }}>Recent Homework Assignments</h4>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {homework
            .sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime())
            .slice(0, 20)
            .map((item) => (
              <div
                key={item._id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  padding: '15px', 
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Subject: {item.subject || 'General'}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
                      {item.description.length > 60 
                        ? `${item.description.substring(0, 60)}...` 
                        : item.description
                      }
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Due: {new Date(item.dueDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  {item.marks !== undefined && item.totalMarks !== undefined && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#059669',
                      marginTop: '4px',
                      fontWeight: '500'
                    }}>
                      Score: {item.marks}/{item.totalMarks}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ 
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: 
                      item.status === 'Submitted' || item.status === 'Graded' ? '#dcfce7' : 
                      item.status === 'Late' ? '#fef3c7' : '#fee2e2',
                    color: 
                      item.status === 'Submitted' || item.status === 'Graded' ? '#166534' : 
                      item.status === 'Late' ? '#92400e' : '#991b1b'
                  }}>
                    {item.status}
                  </span>
                  {/* Priority indicator for urgent assignments */}
                  {item.status === 'Assigned' && new Date(item.dueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && (
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '10px',
                      fontWeight: '500'
                    }}>
                      DUE SOON
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomeworkView;