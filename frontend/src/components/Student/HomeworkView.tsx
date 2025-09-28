import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

interface HomeworkItem {
  _id: string;
  grade: number;
  title: string;
  description?: string;
  dueDate: string;
  assignDate: string;
  date: string;
}

const HomeworkView: React.FC = () => {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHomework = async () => {
      if (!user || user.role !== 'student') return;
      const student = user as Student;
      console.log('🔍 Fetching homework for studentID:', student.studentID);

      try {
        setLoading(true);
        const data = await studentAPI.getHomework(student.studentID);
        console.log('✅ Homework API response:', data);
        setHomework(Array.isArray(data) ? data : data.homework || []);
      } catch (err: any) {
        console.log('❌ Homework fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch homework data');
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [user]);

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading homework data...');
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

  // For now, show all homework as pending
  const pendingHomework = homework;

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
      React.createElement('h3', { style: { color: '#10b981', marginBottom: '15px' } }, 'Homework Overview'),
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
              color: '#3b82f6'
            }
          }, homework.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Total Homework')
        )
      )
    ),

    React.createElement('div', { 
      style: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px' 
      }
    },
      // Pending Homework
      React.createElement('div', { 
        style: { 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }
      },
        React.createElement('h4', { style: { marginBottom: '15px', color: '#ef4444' } }, 'Pending Homework'),
        pendingHomework.length === 0 ? 
          React.createElement('p', { style: { textAlign: 'center', color: '#6b7280' } }, 'No pending homework') :
          React.createElement('div', { 
            style: { 
              maxHeight: '300px', 
              overflowY: 'auto' 
            }
          },
            ...pendingHomework.map((hw) => 
              React.createElement('div', { 
                key: hw._id,
                style: { 
                  padding: '15px', 
                  borderLeft: '4px solid #ef4444',
                  backgroundColor: '#fef2f2',
                  marginBottom: '10px',
                  borderRadius: '4px'
                }
              },
                React.createElement('div', { style: { fontWeight: '600', marginBottom: '5px' } }, hw.title),
                hw.description && React.createElement('div', {
                  style: { fontSize: '14px', marginBottom: '5px' }
                }, hw.description),
                React.createElement('div', {
                  style: {
                    fontSize: '12px',
                    color: '#dc2626',
                    fontWeight: '500'
                  }
                }, `Due: ${new Date(hw.dueDate).toLocaleDateString()}`)
              )
            )
          )
      )
    )
  );
};

export default HomeworkView;