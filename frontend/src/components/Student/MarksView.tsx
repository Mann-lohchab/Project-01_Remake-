import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

interface MarkRecord {
  _id: string;
  studentId: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  examType: 'Midterm' | 'Final' | 'Class Test' | 'Assignment';
  semester: string;
  date: string;
  grade?: string;
}

const MarksView: React.FC = () => {
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMarks = async () => {
      if (!user || user.role !== 'student') return;
      const student = user as Student;
      
      try {
        setLoading(true);
        const data = await studentAPI.getMarks(student.studentID);
        setMarks(Array.isArray(data) ? data : data.marks || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch marks data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [user]);

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading marks data...');
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

  const calculateOverallPercentage = () => {
    if (marks.length === 0) return 0;
    const totalPossible = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);
    const totalObtained = marks.reduce((sum, mark) => sum + mark.marksObtained, 0);
    return Math.round((totalObtained / totalPossible) * 100);
  };

  const getSubjectWiseMarks = () => {
    const subjectMap: { [key: string]: { obtained: number; total: number; count: number } } = {};
    
    marks.forEach(mark => {
      if (!subjectMap[mark.subject]) {
        subjectMap[mark.subject] = { obtained: 0, total: 0, count: 0 };
      }
      subjectMap[mark.subject].obtained += mark.marksObtained;
      subjectMap[mark.subject].total += mark.totalMarks;
      subjectMap[mark.subject].count += 1;
    });

    return Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      percentage: Math.round((data.obtained / data.total) * 100),
      obtained: data.obtained,
      total: data.total,
      count: data.count
    }));
  };

  const overallPercentage = calculateOverallPercentage();
  const subjectWiseMarks = getSubjectWiseMarks();

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
      React.createElement('h3', { style: { color: '#f59e0b', marginBottom: '15px' } }, 'Academic Performance'),
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px',
          textAlign: 'center' 
        }
      },
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: overallPercentage >= 85 ? '#10b981' : 
                     overallPercentage >= 70 ? '#f59e0b' : '#ef4444' 
            } 
          }, `${overallPercentage}%`),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Overall Performance')
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#3b82f6' 
            } 
          }, marks.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Total Assessments')
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#8b5cf6' 
            } 
          }, subjectWiseMarks.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Subjects')
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
      // Subject-wise Performance
      React.createElement('div', { 
        style: { 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }
      },
        React.createElement('h4', { style: { marginBottom: '15px', color: '#f59e0b' } }, 'Subject-wise Performance'),
        subjectWiseMarks.length === 0 ? 
          React.createElement('p', { style: { textAlign: 'center', color: '#6b7280' } }, 'No marks data available') :
          React.createElement('div', null,
            ...subjectWiseMarks.map((subjectData) => 
              React.createElement('div', { 
                key: subjectData.subject,
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 0', 
                  borderBottom: '1px solid #f3f4f6' 
                }
              },
                React.createElement('div', null,
                  React.createElement('div', { style: { fontWeight: '500' } }, subjectData.subject),
                  React.createElement('div', { 
                    style: { 
                      fontSize: '12px', 
                      color: '#6b7280' 
                    } 
                  }, `${subjectData.obtained}/${subjectData.total} (${subjectData.count} tests)`)
                ),
                React.createElement('div', { 
                  style: { 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px' 
                  }
                },
                  React.createElement('div', { 
                    style: { 
                      width: '60px', 
                      height: '8px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }
                  },
                    React.createElement('div', { 
                      style: { 
                        width: `${subjectData.percentage}%`, 
                        height: '100%',
                        backgroundColor: subjectData.percentage >= 85 ? '#10b981' : 
                                        subjectData.percentage >= 70 ? '#f59e0b' : '#ef4444',
                        transition: 'width 0.3s ease'
                      }
                    })
                  ),
                  React.createElement('span', { 
                    style: { 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: subjectData.percentage >= 85 ? '#10b981' : 
                             subjectData.percentage >= 70 ? '#f59e0b' : '#ef4444'
                    }
                  }, `${subjectData.percentage}%`)
                )
              )
            )
          )
      ),

      // Recent Test Results
      React.createElement('div', { 
        style: { 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }
      },
        React.createElement('h4', { style: { marginBottom: '15px', color: '#8b5cf6' } }, 'Recent Test Results'),
        marks.length === 0 ? 
          React.createElement('p', { style: { textAlign: 'center', color: '#6b7280' } }, 'No recent test results') :
          React.createElement('div', { 
            style: { 
              maxHeight: '300px', 
              overflowY: 'auto' 
            }
          },
            ...marks.slice(0, 8).map((mark) => {
              const percentage = Math.round((mark.marksObtained / mark.totalMarks) * 100);
              return React.createElement('div', { 
                key: mark._id,
                style: { 
                  padding: '12px', 
                  marginBottom: '10px',
                  borderRadius: '6px',
                  backgroundColor: percentage >= 85 ? '#f0fdf4' : 
                                  percentage >= 70 ? '#fffbeb' : '#fef2f2',
                  border: `1px solid ${percentage >= 85 ? '#bbf7d0' : 
                                       percentage >= 70 ? '#fed7aa' : '#fecaca'}`
                }
              },
                React.createElement('div', { 
                  style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '5px'
                  }
                },
                  React.createElement('div', null,
                    React.createElement('div', { style: { fontWeight: '600', fontSize: '14px' } }, mark.subject),
                    React.createElement('div', { 
                      style: { 
                        fontSize: '12px', 
                        color: '#6b7280' 
                      } 
                    }, `${mark.examType} - ${mark.semester}`)
                  ),
                  React.createElement('div', { 
                    style: { 
                      textAlign: 'right' 
                    }
                  },
                    React.createElement('div', { 
                      style: { 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        color: percentage >= 85 ? '#059669' : 
                               percentage >= 70 ? '#d97706' : '#dc2626'
                      } 
                    }, `${mark.marksObtained}/${mark.totalMarks}`),
                    React.createElement('div', { 
                      style: { 
                        fontSize: '12px', 
                        color: percentage >= 85 ? '#059669' : 
                               percentage >= 70 ? '#d97706' : '#dc2626' 
                      } 
                    }, `${percentage}%`)
                  )
                ),
                React.createElement('div', { 
                  style: { 
                    fontSize: '11px', 
                    color: '#6b7280' 
                  } 
                }, `Date: ${new Date(mark.date).toLocaleDateString()}`)
              );
            })
          )
      )
    )
  );
};

export default MarksView;