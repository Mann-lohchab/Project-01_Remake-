import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { CalendarEvent } from '../../types';
import { Calendar, Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalendarManagement: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'Other' as CalendarEvent['category']
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await adminAPI.getCalendarEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Update event
        await adminAPI.updateCalendarEvent(editingEvent._id!, {
          ...formData,
          date: new Date(formData.date).toISOString()
        });
      } else {
        // Add new event
        await adminAPI.createCalendarEvent({
          ...formData,
          date: new Date(formData.date).toISOString()
        });
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving calendar event:', error);
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0], // Format for date input
      category: event.category
    });
    setShowAddForm(true);
  };

  const handleDelete = async (event: CalendarEvent) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await adminAPI.deleteCalendarEvent(event._id!);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting calendar event:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: 'Other'
    });
    setEditingEvent(null);
    setShowAddForm(false);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Holiday':
        return 'bg-green-100 text-green-800';
      case 'Exam':
        return 'bg-red-100 text-red-800';
      case 'Event':
        return 'bg-blue-100 text-blue-800';
      case 'Reminder':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf2] flex items-center justify-center">
        <div className="text-[#252422]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf2]">
      {/* Header */}
      <header className="bg-[#252422] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin-dashboard"
                className="flex items-center space-x-2 text-[#ccc5b9] hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Calendar Management</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ccc5b9] h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Event</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#252422] mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#252422] mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as CalendarEvent['category']})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                >
                  <option value="Holiday">Holiday</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                  <option value="Reminder">Reminder</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#252422] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#ccc5b9] hover:bg-[#b8aea1] text-[#252422] px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#252422] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#ccc5b9]">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-[#fffcf2]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#252422]">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">{formatDate(event.date)}</td>
                    <td className="px-6 py-4 text-sm text-[#252422] max-w-xs truncate">{event.description || 'No description'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#252422]">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-[#eb5e28] hover:text-[#d54d1f] transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-[#ccc5b9]">
              {searchTerm ? 'No events found matching your search.' : 'No calendar events created yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;