import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

interface AttendanceRecord {
  _id: string;
  studentId: string;
  subject: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  totalClasses?: number;
  attendedClasses?: number;
}

const AttendanceView: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user || user.role !== 'student') return;
      const student = user as Student;
      
      try {
        setLoading(true);
        const data = await studentAPI.getAttendance(student.studentID);
        setAttendance(Array.isArray(data) ? data : data.attendance || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading attendance data...');
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

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(record => record.status === 'Present').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const percentage = calculateAttendancePercentage();

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
      React.createElement('h3', { style: { color: '#3b82f6', marginBottom: '15px' } }, 'Attendance Overview'),
      React.createElement('div', { 
        style: { 
          display: 'flex', 
          justifyContent: 'space-around', 
          textAlign: 'center' 
        }
      },
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: percentage >= 75 ? '#10b981' : '#ef4444' 
            } 
          }, `${percentage}%`),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Overall Attendance')
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#3b82f6' 
            } 
          }, attendance.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Total Classes')
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
      React.createElement('h4', { style: { marginBottom: '15px' } }, 'Recent Attendance'),
      attendance.length === 0 ? 
        React.createElement('p', { style: { textAlign: 'center', color: '#6b7280' } }, 'No attendance records found') :
        React.createElement('div', { 
          style: { 
            maxHeight: '300px', 
            overflowY: 'auto' 
          }
        },
          ...attendance.slice(0, 10).map((record) => 
            React.createElement('div', { 
              key: record._id,
              style: { 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px 0', 
                borderBottom: '1px solid #f3f4f6' 
              }
            },
              React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: '500' } }, record.subject || 'General'),
                React.createElement('div', { 
                  style: { 
                    fontSize: '12px', 
                    color: '#6b7280' 
                  } 
                }, new Date(record.date).toLocaleDateString())
              ),
              React.createElement('span', { 
                style: { 
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: record.status === 'Present' ? '#dcfce7' : 
                                  record.status === 'Late' ? '#fef3c7' : '#fee2e2',
                  color: record.status === 'Present' ? '#166534' : 
                         record.status === 'Late' ? '#92400e' : '#991b1b'
                }
              }, record.status)
            )
          )
        )
    )
  );
};

export default AttendanceView;