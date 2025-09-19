import React, { useState, useEffect } from 'react';

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<CalendarEvent>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    category: 'Class',
    targetGrade: undefined,
    isAllDay: false,
    location: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // For now, load from localStorage to persist data across sessions
      const savedEvents = localStorage.getItem('teacher_calendar_events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CalendarEvent, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      category: 'Class',
      targetGrade: undefined,
      isAllDay: false,
      location: ''
    });
    setEditingEvent(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingEvent) {
        // Update existing event
        const updatedEvent = { ...formData, id: editingEvent.id };
        const updatedEvents = events.map(event => event.id === editingEvent.id ? updatedEvent : event);
        setEvents(updatedEvents);
        localStorage.setItem('teacher_calendar_events', JSON.stringify(updatedEvents));
        setMessage({ type: 'success', text: 'Event updated successfully!' });
      } else {
        // Create new event
        const newEvent = { ...formData, id: Date.now().toString() };
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);
        localStorage.setItem('teacher_calendar_events', JSON.stringify(updatedEvents));
        setMessage({ type: 'success', text: 'Event created successfully!' });
      }
      
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage({ type: 'error', text: 'Failed to save event' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setFormData(event);
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleDelete = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('teacher_calendar_events', JSON.stringify(updatedEvents));
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
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
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Calendar Management</h1>
          <p style={{ color: '#6b7280' }}>Add events and manage your teaching schedule</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            background: '#8b5cf6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>📅</span> Add Event
        </button>
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

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter event title..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Enter event description..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="Class">Class</option>
                      <option value="Exam">Exam</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Event">Event</option>
                      <option value="Reminder">Reminder</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Target Grade
                    </label>
                    <select
                      value={formData.targetGrade || ''}
                      onChange={(e) => handleInputChange('targetGrade', e.target.value ? parseInt(e.target.value) : '')}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">All Grades</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <input
                    type="checkbox"
                    id="isAllDay"
                    checked={formData.isAllDay}
                    onChange={(e) => handleInputChange('isAllDay', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="isAllDay" style={{ fontWeight: '500', cursor: 'pointer' }}>
                    All-day event
                  </label>
                </div>

                {!formData.isAllDay && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        min={formData.startTime}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter location (optional)..."
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '25px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: saving ? '#9ca3af' : '#8b5cf6',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {saving ? 'Saving...' : (editingEvent ? 'Update' : 'Add')} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

                          <div style={{ 
                            display: 'flex', 
                            gap: '8px'
                          }}>
                            <button
                              onClick={() => handleEdit(event)}
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id!)}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              Delete
                            </button>
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