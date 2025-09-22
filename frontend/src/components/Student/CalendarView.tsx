import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface CalendarEvent {
  _id: string;
  studentID: string; // Changed from studentId to match backend pattern
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

  const getStudentId = () => {
    return (user as any)?.studentID || 
           (user as any)?.studentId || 
           (user as any)?.student_id || 
           (user as any)?.id;
  };

  const fetchCalendar = async () => {
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
      
      const response = await studentAPI.getCalendar(studentId);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        setEvents(response);
      } else if (response.events && Array.isArray(response.events)) {
        setEvents(response.events);
      } else if (response.data && Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }

    } catch (err: any) {
      console.error('Error fetching calendar:', err);
      
      if (err.response?.status === 404) {
        setEvents([]);
        setError('No calendar events available at this time');
      } else if (err.response?.status === 500) {
        setError('Server error while fetching calendar data');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch calendar data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
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
        Loading calendar events...
      </div>
    );
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

  const thisWeekEvents = upcomingEvents.filter(event => {
    const eventDate = new Date(event.date);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    return eventDate <= weekFromNow;
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
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

      {/* Calendar Overview */}
      <div style={{
        backgroundColor: '#444444',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#CCCCCC', marginBottom: '15px' }}>Calendar Overview</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '15px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#CCCCCC' }}>
              {todayEvents.length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Today</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#CCCCCC' }}>
              {thisWeekEvents.length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>This Week</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#CCCCCC' }}>
              {events.length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Total Events</div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Today's Events */}
        <div style={{
          backgroundColor: '#444444',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#CCCCCC' }}>Today's Events</h4>
          
          {todayEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#555555',
              borderRadius: '4px',
              color: '#CCCCCC'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                No events today
              </div>
              <div style={{ fontSize: '14px' }}>
                Enjoy your free day!
              </div>
            </div>
          ) : (
            <div>
              {todayEvents.map((event) => (
                <div 
                  key={event._id}
                  style={{ 
                    padding: '15px', 
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: `${getCategoryColor(event.category)}10`,
                    borderLeft: `4px solid ${getCategoryColor(event.category)}`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>{getCategoryIcon(event.category)}</span>
                    <h5 style={{ 
                      fontWeight: '600', 
                      margin: 0,
                      color: '#1f2937'
                    }}>
                      {event.title}
                    </h5>
                  </div>
                  
                  {event.description && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#4b5563',
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {event.description}
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    {event.startTime && event.endTime && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {event.startTime} - {event.endTime}
                      </div>
                    )}
                    <span style={{ 
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      backgroundColor: getCategoryColor(event.category),
                      color: 'white'
                    }}>
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div style={{
          backgroundColor: '#444444',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#CCCCCC' }}>Upcoming Events</h4>

          {upcomingEvents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#555555',
              borderRadius: '4px',
              color: '#CCCCCC'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                No upcoming events
              </div>
              <div style={{ fontSize: '14px' }}>
                Your schedule is clear ahead
              </div>
            </div>
          ) : (
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto' 
            }}>
              {upcomingEvents.slice(0, 10).map((event) => (
                <div 
                  key={event._id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    padding: '12px 0', 
                    borderBottom: '1px solid #f3f4f6' 
                  }}
                >
                  <div style={{ 
                    minWidth: '40px',
                    textAlign: 'center',
                    fontSize: '20px',
                    marginTop: '2px'
                  }}>
                    {getCategoryIcon(event.category)}
                  </div>
                  
                  <div style={{ flex: 1, marginLeft: '12px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      marginBottom: '4px',
                      color: '#1f2937'
                    }}>
                      {event.title}
                    </div>
                    
                    {event.description && (
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        marginBottom: '4px',
                        lineHeight: '1.3'
                      }}>
                        {event.description}
                      </div>
                    )}
                    
                    <div style={{ 
                      fontSize: '12px', 
                      color: getCategoryColor(event.category),
                      fontWeight: '600'
                    }}>
                      {formatDate(event.date)}
                      {event.startTime && ` at ${event.startTime}`}
                    </div>
                  </div>
                  
                  <span style={{ 
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '500',
                    backgroundColor: `${getCategoryColor(event.category)}20`,
                    color: getCategoryColor(event.category),
                    whiteSpace: 'nowrap'
                  }}>
                    {event.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
