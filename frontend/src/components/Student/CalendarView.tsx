import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

interface CalendarEvent {
  _id: string;
  studentId?: string;
  title: string;
  description?: string;
  date: string;
  category: 'Holiday' | 'Exam' | 'Event' | 'Reminder' | 'Assignment' | 'Other';
  startTime?: string;
  endTime?: string;
}

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!user || user.role !== 'student') return;
      const student = user as Student;
      
      try {
        setLoading(true);
        const data = await studentAPI.getCalendar(student.studentID);
        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [user]);

  if (loading) {
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      } 
    }, 'Loading calendar events...');
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Holiday': return '#10b981';
      case 'Exam': return '#ef4444';
      case 'Event': return '#3b82f6';
      case 'Reminder': return '#f59e0b';
      case 'Assignment': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Holiday': return '🏖️';
      case 'Exam': return '📝';
      case 'Event': return '🎉';
      case 'Reminder': return '⏰';
      case 'Assignment': return '📚';
      default: return '📅';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString();
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
      React.createElement('h3', { style: { color: '#8b5cf6', marginBottom: '15px' } }, 'Calendar Overview'),
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
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
          }, todayEvents.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Today')
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#f59e0b' 
            } 
          }, upcomingEvents.slice(0, 7).length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'This Week')
        ),
        React.createElement('div', null,
          React.createElement('div', { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#10b981' 
            } 
          }, events.length),
          React.createElement('div', { style: { fontSize: '14px', color: '#6b7280' } }, 'Total Events')
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
      // Today's Events
      React.createElement('div', { 
        style: { 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }
      },
        React.createElement('h4', { style: { marginBottom: '15px', color: '#3b82f6' } }, 'Today\'s Events'),
        todayEvents.length === 0 ? 
          React.createElement('div', { 
            style: { 
              textAlign: 'center', 
              padding: '30px',
              color: '#6b7280' 
            }
          },
            React.createElement('div', { style: { fontSize: '36px', marginBottom: '10px' } }, '📅'),
            React.createElement('div', { style: { fontSize: '16px' } }, 'No events today')
          ) :
          React.createElement('div', null,
            ...todayEvents.map((event) => 
              React.createElement('div', { 
                key: event._id,
                style: { 
                  padding: '15px', 
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: getCategoryColor(event.category) + '10',
                  borderLeft: `4px solid ${getCategoryColor(event.category)}`
                }
              },
                React.createElement('div', { 
                  style: { 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '5px'
                  }
                },
                  React.createElement('span', { style: { fontSize: '18px' } }, getCategoryIcon(event.category)),
                  React.createElement('div', { style: { fontWeight: '600' } }, event.title)
                ),
                event.description && React.createElement('div', { 
                  style: { 
                    fontSize: '14px', 
                    color: '#4b5563',
                    marginBottom: '5px' 
                  } 
                }, event.description),
                React.createElement('div', { 
                  style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }
                },
                  event.startTime && event.endTime && React.createElement('div', { 
                    style: { 
                      fontSize: '12px', 
                      color: '#6b7280' 
                    } 
                  }, `${event.startTime} - ${event.endTime}`),
                  React.createElement('span', { 
                    style: { 
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      backgroundColor: getCategoryColor(event.category),
                      color: 'white'
                    }
                  }, event.category)
                )
              )
            )
          )
      ),

      // Upcoming Events
      React.createElement('div', { 
        style: { 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }
      },
        React.createElement('h4', { style: { marginBottom: '15px', color: '#10b981' } }, 'Upcoming Events'),
        upcomingEvents.length === 0 ? 
          React.createElement('div', { 
            style: { 
              textAlign: 'center', 
              padding: '30px',
              color: '#6b7280' 
            }
          },
            React.createElement('div', { style: { fontSize: '36px', marginBottom: '10px' } }, '🗓️'),
            React.createElement('div', { style: { fontSize: '16px' } }, 'No upcoming events')
          ) :
          React.createElement('div', { 
            style: { 
              maxHeight: '400px', 
              overflowY: 'auto' 
            }
          },
            ...upcomingEvents.slice(0, 10).map((event) => 
              React.createElement('div', { 
                key: event._id,
                style: { 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '12px 0', 
                  borderBottom: '1px solid #f3f4f6' 
                }
              },
                React.createElement('div', { 
                  style: { 
                    minWidth: '40px',
                    textAlign: 'center',
                    fontSize: '20px'
                  }
                }, getCategoryIcon(event.category)),
                React.createElement('div', { style: { flex: 1, marginLeft: '12px' } },
                  React.createElement('div', { style: { fontWeight: '500', marginBottom: '2px' } }, event.title),
                  event.description && React.createElement('div', { 
                    style: { 
                      fontSize: '13px', 
                      color: '#6b7280',
                      marginBottom: '2px' 
                    } 
                  }, event.description),
                  React.createElement('div', { 
                    style: { 
                      fontSize: '12px', 
                      color: getCategoryColor(event.category),
                      fontWeight: '500'
                    } 
                  }, formatDate(event.date))
                ),
                React.createElement('span', { 
                  style: { 
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '500',
                    backgroundColor: getCategoryColor(event.category) + '20',
                    color: getCategoryColor(event.category)
                  }
                }, event.category)
              )
            )
          )
      )
    )
  );
};

export default CalendarView;