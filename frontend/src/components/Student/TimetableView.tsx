import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

interface TimetableEntry {
  _id: string;
  classId?: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room?: string;
}

const TimetableView: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!user || user.role !== 'student') return;
      const student = user as Student;
      
      try {
        setLoading(true);
        const data = await studentAPI.getTimetable(student.studentID);
        setTimetable(Array.isArray(data) ? data : data.timetable || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch timetable data');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [user]);

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading timetable...');
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

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  
  const getTodaySchedule = () => {
    const today = new Date();
    const todayName = today.toLocaleDateString('en-US', { weekday: 'long' }) as typeof daysOfWeek[0];
    return timetable.filter(entry => entry.day === todayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getDaySchedule = (day: string) => {
    return timetable.filter(entry => entry.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getCurrentClass = () => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const todaySchedule = getTodaySchedule();
    
    return todaySchedule.find(entry => 
      currentTime >= entry.startTime && currentTime <= entry.endTime
    );
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const todaySchedule = getTodaySchedule();
    
    return todaySchedule.find(entry => currentTime < entry.startTime);
  };

  const todaySchedule = getTodaySchedule();
  const currentClass = getCurrentClass();
  const nextClass = getNextClass();

  const getSubjectColor = (subject: string) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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
      React.createElement('h3', { style: { color: '#6366f1', marginBottom: '15px' } }, 'Today\'s Schedule'),
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px',
          textAlign: 'center',
          marginBottom: '20px'
        }
      },
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#10b981' 
            } 
          }, currentClass ? '📚' : '⏰'),
          React.createElement('div', { style: { fontSize: '12px', color: '#6b7280' } }, 
            currentClass ? 'Current Class' : 'No Current Class'
          ),
          currentClass && React.createElement('div', { 
            style: { 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#10b981' 
            } 
          }, currentClass.subject)
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#3b82f6' 
            } 
          }, nextClass ? '⏭️' : '✅'),
          React.createElement('div', { style: { fontSize: '12px', color: '#6b7280' } }, 
            nextClass ? 'Next Class' : 'No More Classes'
          ),
          nextClass && React.createElement('div', { 
            style: { 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#3b82f6' 
            } 
          }, `${nextClass.subject} at ${nextClass.startTime}`)
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#f59e0b' 
            } 
          }, todaySchedule.length),
          React.createElement('div', { style: { fontSize: '12px', color: '#6b7280' } }, 'Classes Today')
        )
      ),

      // Today's Classes
      todaySchedule.length > 0 && React.createElement('div', null,
        React.createElement('h5', { style: { marginBottom: '10px' } }, 'Today\'s Classes'),
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '10px'
          }
        },
          ...todaySchedule.map((entry, index) => 
            React.createElement('div', { 
              key: `${entry._id}-${index}`,
              style: { 
                minWidth: '160px',
                padding: '12px', 
                borderRadius: '8px',
                backgroundColor: getSubjectColor(entry.subject) + '10',
                border: `2px solid ${getSubjectColor(entry.subject)}20`,
                borderLeft: `4px solid ${getSubjectColor(entry.subject)}`
              }
            },
              React.createElement('div', { 
                style: { 
                  fontWeight: '600', 
                  color: getSubjectColor(entry.subject),
                  marginBottom: '5px'
                } 
              }, entry.subject),
              React.createElement('div', { 
                style: { 
                  fontSize: '12px', 
                  color: '#6b7280',
                  marginBottom: '3px' 
                } 
              }, `${entry.startTime} - ${entry.endTime}`),
              React.createElement('div', { 
                style: { 
                  fontSize: '12px', 
                  color: '#6b7280' 
                } 
              }, entry.teacher),
              entry.room && React.createElement('div', { 
                style: { 
                  fontSize: '11px', 
                  color: '#6b7280',
                  marginTop: '3px'
                } 
              }, `Room: ${entry.room}`)
            )
          )
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
      React.createElement('h4', { style: { marginBottom: '20px' } }, 'Weekly Timetable'),
      timetable.length === 0 ? 
        React.createElement('div', { 
          style: { 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280' 
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '📅'),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '5px' } }, 'No timetable available'),
          React.createElement('div', { style: { fontSize: '14px' } }, 'Your class schedule will appear here')
        ) :
        React.createElement('div', { style: { overflowX: 'auto' } },
          React.createElement('table', { 
            style: { 
              width: '100%', 
              minWidth: '800px',
              borderCollapse: 'collapse'
            }
          },
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', { 
                  style: { 
                    padding: '12px', 
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    fontWeight: '600',
                    textAlign: 'left'
                  }
                }, 'Day'),
                ...timeSlots.map(time => 
                  React.createElement('th', { 
                    key: time,
                    style: { 
                      padding: '12px', 
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: '12px'
                    }
                  }, time)
                )
              )
            ),
            React.createElement('tbody', null,
              ...daysOfWeek.map(day => {
                const daySchedule = getDaySchedule(day);
                return React.createElement('tr', { key: day },
                  React.createElement('td', { 
                    style: { 
                      padding: '12px', 
                      border: '1px solid #e5e7eb',
                      fontWeight: '600',
                      backgroundColor: '#fafafa'
                    }
                  }, day.substring(0, 3)),
                  ...timeSlots.map(time => {
                    const classAtTime = daySchedule.find(entry => 
                      entry.startTime <= time && entry.endTime > time
                    );
                    
                    return React.createElement('td', { 
                      key: `${day}-${time}`,
                      style: { 
                        padding: '8px', 
                        border: '1px solid #e5e7eb',
                        textAlign: 'center',
                        backgroundColor: classAtTime ? getSubjectColor(classAtTime.subject) + '10' : 'white',
                        fontSize: '11px'
                      }
                    }, classAtTime ? 
                      React.createElement('div', { 
                        style: { 
                          fontWeight: '600',
                          color: getSubjectColor(classAtTime.subject)
                        } 
                      }, classAtTime.subject) : ''
                    );
                  })
                );
              })
            )
          )
        )
    )
  );
};

export default TimetableView;