import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TimetableEntry {
  _id: string;
  studentID: string; // Changed from classId to match backend pattern
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

  const getStudentId = () => {
    return (user as any)?.studentID ||(user as any)?.studentId ||(user as any)?.student_id || (user as any)?.id;
  };

  const fetchTimetable = async () => {
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
      
      const response = await studentAPI.getTimetable(studentId);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        setTimetable(response);
      } else if (response.timetable && Array.isArray(response.timetable)) {
        setTimetable(response.timetable);
      } else if (response.data && Array.isArray(response.data)) {
        setTimetable(response.data);
      } else {
        setTimetable([]);
      }

    } catch (err: any) {
      console.error('Error fetching timetable:', err);
      
      if (err.response?.status === 404) {
        setTimetable([]);
        setError('No timetable available at this time');
      } else if (err.response?.status === 500) {
        setError('Server error while fetching timetable data');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch timetable data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [user]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#CCCCCC'
      }}>
        Loading timetable...
      </div>
    );
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

  return (
    <div>
      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#444444',
          color: '#CCCCCC',
          padding: '15px',
          textAlign: 'center',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* Today's Schedule Overview */}
      <div style={{
        backgroundColor: '#444444',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#CCCCCC', marginBottom: '15px' }}>Today's Schedule</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: currentClass ? '#10b981' : '#6b7280'
            }}>
              {currentClass ? '📚' : '⏰'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
              {currentClass ? 'Current Class' : 'No Current Class'}
            </div>
            {currentClass && (
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#10b981'
              }}>
                {currentClass.subject}
              </div>
            )}
          </div>

          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: nextClass ? '#3b82f6' : '#6b7280'
            }}>
              {nextClass ? '⏭️' : '✅'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
              {nextClass ? 'Next Class' : 'No More Classes'}
            </div>
            {nextClass && (
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#3b82f6'
              }}>
                {nextClass.subject} at {nextClass.startTime}
              </div>
            )}
          </div>

          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#f59e0b'
            }}>
              {todaySchedule.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Classes Today</div>
          </div>
        </div>

        {/* Today's Classes Horizontal Scroll */}
        {todaySchedule.length > 0 && (
          <div>
            <h5 style={{ marginBottom: '15px', color: '#374151' }}>Today's Classes</h5>
            <div style={{ 
              display: 'flex', 
              gap: '15px',
              overflowX: 'auto',
              paddingBottom: '10px'
            }}>
              {todaySchedule.map((entry, index) => (
                <div 
                  key={`${entry._id}-${index}`}
                  style={{ 
                    minWidth: '180px',
                    padding: '15px', 
                    borderRadius: '8px',
                    backgroundColor: `${getSubjectColor(entry.subject)}10`,
                    border: `2px solid ${getSubjectColor(entry.subject)}20`,
                    borderLeft: `4px solid ${getSubjectColor(entry.subject)}`
                  }}
                >
                  <div style={{ 
                    fontWeight: '600', 
                    color: getSubjectColor(entry.subject),
                    marginBottom: '8px',
                    fontSize: '16px'
                  }}>
                    {entry.subject}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    marginBottom: '4px' 
                  }}>
                    {entry.startTime} - {entry.endTime}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    marginBottom: '4px'
                  }}>
                    {entry.teacher}
                  </div>
                  {entry.room && (
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#6b7280',
                      backgroundColor: `${getSubjectColor(entry.subject)}05`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginTop: '4px'
                    }}>
                      Room: {entry.room}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weekly Timetable */}
      <div style={{
        backgroundColor: '#444444',
        padding: '20px',
        borderRadius: '4px'
      }}>
        <h4 style={{ marginBottom: '20px', color: '#CCCCCC' }}>Weekly Timetable</h4>

        {timetable.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#555555',
            borderRadius: '4px',
            color: '#CCCCCC'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '5px' }}>
              No timetable available
            </div>
            <div style={{ fontSize: '14px' }}>
              Your class schedule will appear here once it's uploaded
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              minWidth: '800px',
              borderCollapse: 'collapse',
              fontSize: '13px'
            }}>
              <thead>
                <tr>
                  <th style={{ 
                    padding: '12px 8px', 
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    fontWeight: '600',
                    textAlign: 'left',
                    minWidth: '80px'
                  }}>
                    Day
                  </th>
                  {timeSlots.map(time => (
                    <th 
                      key={time}
                      style={{ 
                        padding: '12px 6px', 
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        fontWeight: '600',
                        textAlign: 'center',
                        fontSize: '12px',
                        minWidth: '70px'
                      }}
                    >
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map(day => {
                  const daySchedule = getDaySchedule(day);
                  return (
                    <tr key={day}>
                      <td style={{ 
                        padding: '12px 8px', 
                        border: '1px solid #e5e7eb',
                        fontWeight: '600',
                        backgroundColor: '#fafafa',
                        verticalAlign: 'top'
                      }}>
                        {day.substring(0, 3)}
                      </td>
                      {timeSlots.map(time => {
                        const classAtTime = daySchedule.find(entry => 
                          entry.startTime <= time && entry.endTime > time
                        );
                        
                        return (
                          <td 
                            key={`${day}-${time}`}
                            style={{ 
                              padding: classAtTime ? '6px 4px' : '8px 4px', 
                              border: '1px solid #e5e7eb',
                              textAlign: 'center',
                              backgroundColor: classAtTime ? `${getSubjectColor(classAtTime.subject)}10` : 'white',
                              fontSize: '10px',
                              verticalAlign: 'middle',
                              position: 'relative'
                            }}
                          >
                            {classAtTime && (
                              <div style={{ 
                                fontWeight: '600',
                                color: getSubjectColor(classAtTime.subject),
                                lineHeight: '1.2',
                                marginBottom: '2px'
                              }}>
                                {classAtTime.subject}
                              </div>
                            )}
                            {classAtTime && classAtTime.room && (
                              <div style={{ 
                                fontSize: '9px',
                                color: '#6b7280',
                                opacity: 0.8
                              }}>
                                {classAtTime.room}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableView;
