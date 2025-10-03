import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../../services/api';
import { CalendarEvent } from '../../types';
import { Calendar, Plus, Edit, Trash2, Search, ArrowLeft, Filter, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalendarManagement: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);
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
      setError(null);
      const data = await adminAPI.getCalendarEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setError('Failed to load calendar events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingEvent) {
        // Update event
        await adminAPI.updateCalendarEvent(editingEvent._id!, {
          ...formData,
          date: new Date(formData.date).toISOString()
        });
        setSuccess('Event updated successfully!');
      } else {
        // Add new event
        await adminAPI.createCalendarEvent({
          ...formData,
          date: new Date(formData.date).toISOString()
        });
        setSuccess('Event created successfully!');
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving calendar event:', error);
      setError('Failed to save event. Please try again.');
    } finally {
      setSubmitting(false);
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
        setError(null);
        await adminAPI.deleteCalendarEvent(event._id!);
        setSuccess('Event deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting calendar event:', error);
        setError('Failed to delete event. Please try again.');
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
    setError(null);
    setSuccess(null);
  };

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort events
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [events, searchTerm, categoryFilter, sortBy, sortOrder]);

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
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle size={20} className="mr-2" />
            {success}
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-700 hover:text-green-900"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Search, Filters, and Add */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ccc5b9] h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ccc5b9] h-5 w-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border  text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent appearance-none bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Holiday">Holiday</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
                <option value="Reminder">Reminder</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                className="px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="category">Sort by Category</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border text-black  border-[#ccc5b9] rounded-lg hover:bg-[#fffcf2] transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Add Event Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center space-x-2 bg-[#eb5e28] hover:bg-[#d54d1f] text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#252422]">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button
                onClick={resetForm}
                className="text-[#ccc5b9] hover:text-[#252422] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#252422] mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border  text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent"
                  placeholder="Enter event title"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as CalendarEvent['category']})}
                  className="w-full px-3 py-2 border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent appearance-none bg-white"
                  required
                  disabled={submitting}
                >
                  <option value="Holiday">Holiday</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                  <option value="Reminder">Reminder</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28]  text-black focus:border-transparent"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#252422] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2  border text-black border-[#ccc5b9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb5e28] focus:border-transparent resize-vertical"
                  rows={3}
                  placeholder="Enter event description (optional)"
                  disabled={submitting}
                />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-[#ccc5b9] text-[#252422] rounded-lg hover:bg-[#fffcf2] transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#eb5e28] hover:bg-[#d54d1f] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingEvent ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingEvent ? 'Update Event' : 'Create Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events Table/List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
                {filteredAndSortedEvents.map((event) => (
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
                          className="p-1 text-[#eb5e28] hover:text-[#d54d1f] hover:bg-orange-50 rounded transition-colors"
                          title="Edit event"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete event"
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

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredAndSortedEvents.map((event) => (
              <div key={event._id} className="p-4 border-b border-[#ccc5b9] hover:bg-[#fffcf2]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-[#252422] flex-1 mr-2">{event.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <div className="text-sm text-[#252422] mb-2">
                  <Calendar size={14} className="inline mr-1" />
                  {formatDate(event.date)}
                </div>
                {event.description && (
                  <p className="text-sm text-[#666] mb-3 line-clamp-2">{event.description}</p>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-[#eb5e28] hover:text-[#d54d1f] hover:bg-orange-50 rounded transition-colors"
                    title="Edit event"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-[#ccc5b9] mb-4" />
              <p className="text-[#ccc5b9] text-lg">
                {searchTerm || categoryFilter !== 'All' ? 'No events found matching your filters.' : 'No calendar events created yet.'}
              </p>
              <p className="text-[#999] text-sm mt-2">
                {searchTerm || categoryFilter !== 'All' ? 'Try adjusting your search or filters.' : 'Click "Add Event" to create your first event.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;