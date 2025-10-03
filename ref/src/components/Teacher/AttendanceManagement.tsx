import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface Student {
  id: string;
  studentID: string;
  firstName: string;
  lastName: string;
  grade: number;
}

interface AttendanceRecord {
  studentID: string;
  status: 'Present' | 'Absent';
}

const AttendanceManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      initializeAttendance();
    }
  }, [students, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await teacherAPI.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      setMessage({ type: 'error', text: 'Failed to load students' });
    } finally {
      setLoading(false);
    }
  };

  const initializeAttendance = () => {
    const initialAttendance = students.map(student => ({
      studentID: student.studentID,
      status: 'Present' as const
    }));
    setAttendance(initialAttendance);
  };

  const updateAttendance = (studentID: string, status: 'Present' | 'Absent') => {
    setAttendance(prev => 
      prev.map(record => 
        record.studentID === studentID 
          ? { ...record, status }
          : record
      )
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const attendanceData = {
        date: selectedDate,
        records: attendance
      };
      
      await teacherAPI.markAttendance(attendanceData);
      setMessage({ type: 'success', text: 'Attendance saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving attendance:', error);
      setMessage({ type: 'error', text: 'Failed to save attendance' });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = selectedGrade === 'all' 
    ? students 
    : students.filter(student => student.grade.toString() === selectedGrade);

  const uniqueGrades = Array.from(new Set(students.map(student => student.grade))).sort();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Attendance Management</h1>
        <p style={{ color: '#6b7280' }}>Mark student attendance for classes</p>
      </div>

      {/* Controls */}
      <div style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Grade:
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '100px'
            }}
          >
            <option value="all">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade.toString()}>Grade {grade}</option>
            ))}
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={handleSaveAttendance}
            disabled={saving || attendance.length === 0}
            style={{
              background: saving ? '#9ca3af' : '#10b981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
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

      {/* Student List */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#f9fafb',
          padding: '15px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 100px 200px',
          fontWeight: '600',
          color: '#374151'
        }}>
          <div>Student ID</div>
          <div>Name</div>
          <div>Grade</div>
          <div>Attendance</div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No students found
          </div>
        ) : (
          filteredStudents.map((student, index) => (
            <div
              key={student.id}
              style={{
                padding: '15px 20px',
                borderBottom: index < filteredStudents.length - 1 ? '1px solid #e5e7eb' : 'none',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 100px 200px',
                alignItems: 'center',
                background: index % 2 === 0 ? 'white' : '#f9fafb'
              }}
            >
              <div style={{ fontFamily: 'monospace', color: '#374151' }}>
                {student.studentID}
              </div>
              <div style={{ fontWeight: '500', color: '#111827' }}>
                {student.firstName} {student.lastName}
              </div>
              <div style={{ color: '#6b7280' }}>
                {student.grade}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => updateAttendance(student.studentID, 'Present')}
                  style={{
                    background: attendance.find(a => a.studentID === student.studentID)?.status === 'Present' 
                      ? '#10b981' : '#e5e7eb',
                    color: attendance.find(a => a.studentID === student.studentID)?.status === 'Present' 
                      ? 'white' : '#6b7280',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Present
                </button>
                <button
                  onClick={() => updateAttendance(student.studentID, 'Absent')}
                  style={{
                    background: attendance.find(a => a.studentID === student.studentID)?.status === 'Absent' 
                      ? '#ef4444' : '#e5e7eb',
                    color: attendance.find(a => a.studentID === student.studentID)?.status === 'Absent' 
                      ? 'white' : '#6b7280',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Absent
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredStudents.length > 0 && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '20px',
          display: 'flex',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ color: '#6b7280' }}>Total Students: </span>
            <span style={{ fontWeight: '600', color: '#111827' }}>
              {filteredStudents.length}
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Present: </span>
            <span style={{ fontWeight: '600', color: '#10b981' }}>
              {attendance.filter(a => a.status === 'Present').length}
            </span>
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Absent: </span>
            <span style={{ fontWeight: '600', color: '#ef4444' }}>
              {attendance.filter(a => a.status === 'Absent').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;