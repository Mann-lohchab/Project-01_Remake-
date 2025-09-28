import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface CalendarEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: 'Class' | 'Exam' | 'Assignment' | 'Meeting' | 'Holiday' | 'Event' | 'Reminder';
  targetGrade?: number;
  isAllDay: boolean;
  location?: string;
}

const CalendarManagement: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await teacherAPI.getCalendar();
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };


  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Class': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Exam': return { bg: '#fee2e2', text: '#991b1b' };
      case 'Assignment': return { bg: '#fef3c7', text: '#92400e' };
      case 'Meeting': return { bg: '#ede9fe', text: '#6b21a8' };
      case 'Holiday': return { bg: '#d1fae5', text: '#065f46' };
      case 'Event': return { bg: '#cffafe', text: '#0e7490' };
      case 'Reminder': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getEventsForMonth = (month: string) => {
    return events.filter(event => event.date.startsWith(month));
  };

  const groupEventsByDate = (events: CalendarEvent[]) => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    return grouped;
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const monthEvents = getEventsForMonth(selectedMonth);
  const groupedEvents = groupEventsByDate(monthEvents);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Calendar View</h1>
        <p style={{ color: '#6b7280' }}>View school calendar events</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Month Selector */}
      <div style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <label style={{ fontWeight: '500' }}>View Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <div style={{ marginLeft: 'auto', color: '#6b7280' }}>
          {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''} in {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>


      {/* Events List */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading events...
          </div>
        ) : monthEvents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📅</div>
            <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '10px' }}>
              No events for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Click "Add Event" to start scheduling your activities
            </p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedEvents)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, dayEvents]) => (
                <div key={date} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{
                    background: '#f9fafb',
                    padding: '15px 20px',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>

                  {dayEvents
                    .sort((a, b) => {
                      if (a.isAllDay && !b.isAllDay) return -1;
                      if (!a.isAllDay && b.isAllDay) return 1;
                      return (a.startTime || '').localeCompare(b.startTime || '');
                    })
                    .map((event, index) => {
                      const categoryColors = getCategoryBadgeColor(event.category);
                      return (
                        <div
                          key={event.id}
                          style={{
                            padding: '20px',
                            borderBottom: index < dayEvents.length - 1 ? '1px solid #f3f4f6' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '20px'
                          }}
                        >
                          <div style={{
                            background: categoryColors.bg,
                            color: categoryColors.text,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            minWidth: '80px',
                            textAlign: 'center'
                          }}>
                            {event.category}
                          </div>

                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              margin: '0 0 8px 0', 
                              color: '#111827',
                              fontSize: '16px',
                              fontWeight: '600'
                            }}>
                              {event.title}
                            </h4>

                            <div style={{
                              display: 'flex',
                              gap: '20px',
                              fontSize: '12px',
                              color: '#6b7280',
                              marginBottom: event.description ? '8px' : '0'
                            }}>
                              <span>
                                🕐 {event.isAllDay ? 'All Day' : 
                                  `${formatTime(event.startTime || '')}${event.endTime ? ` - ${formatTime(event.endTime)}` : ''}`}
                              </span>
                              {event.location && <span>📍 {event.location}</span>}
                              {event.targetGrade && <span>🎯 Grade {event.targetGrade}</span>}
                            </div>

                            {event.description && (
                              <p style={{
                                margin: 0,
                                color: '#374151',
                                fontSize: '14px',
                                lineHeight: '1.5'
                              }}>
                                {event.description}
                              </p>
                            )}
                          </div>

                        </div>
                      );
                    })}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarManagement;