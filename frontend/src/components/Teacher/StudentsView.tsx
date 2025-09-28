import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface Student {
  _id?: string;
  id?: string;
  studentID: string;
  firstName: string;
  lastName: string;
  grade: number;
  email: string;
  fathersName?: string;
  mothersName?: string;
  address?: string;
  Address?: string;
}

const StudentsView: React.FC = () => {
  // Mock student data for testing when backend is unavailable
  const mockStudents: Student[] = [
    { id: '1', studentID: 'S001', firstName: 'John', lastName: 'Smith', grade: 10, email: 'john.smith@school.edu', fathersName: 'Robert Smith', mothersName: 'Mary Smith', address: '123 Main St, City' },
    { id: '2', studentID: 'S002', firstName: 'Emma', lastName: 'Johnson', grade: 10, email: 'emma.johnson@school.edu', fathersName: 'David Johnson', mothersName: 'Lisa Johnson', address: '124 Main St, City' },
    { id: '3', studentID: 'S003', firstName: 'Michael', lastName: 'Brown', grade: 9, email: 'michael.brown@school.edu', fathersName: 'James Brown', mothersName: 'Sarah Brown', address: '125 Main St, City' },
    { id: '4', studentID: 'S004', firstName: 'Sarah', lastName: 'Davis', grade: 11, email: 'sarah.davis@school.edu', fathersName: 'Tom Davis', mothersName: 'Anne Davis', address: '126 Main St, City' },
    { id: '5', studentID: 'S005', firstName: 'James', lastName: 'Wilson', grade: 10, email: 'james.wilson@school.edu', fathersName: 'Mark Wilson', mothersName: 'Carol Wilson', address: '127 Main St, City' },
    { id: '6', studentID: 'S006', firstName: 'Lisa', lastName: 'Miller', grade: 9, email: 'lisa.miller@school.edu', fathersName: 'Paul Miller', mothersName: 'Helen Miller', address: '128 Main St, City' },
  ];

  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, selectedGrade, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await teacherAPI.getStudents();
      console.log('Frontend received students:', data);
      setStudents(data);
      // Cache students for offline use
      localStorage.setItem('cached_students', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading students from API, using fallback data:', error);
      // Try to load from cache first
      const cachedStudents = localStorage.getItem('cached_students');
      if (cachedStudents) {
        setStudents(JSON.parse(cachedStudents));
        setMessage({ type: 'success', text: 'Loaded student data from offline cache' });
      } else {
        // Use mock data if no cache available
        setStudents(mockStudents);
        localStorage.setItem('cached_students', JSON.stringify(mockStudents));
        setMessage({ type: 'success', text: 'Using demo student data for testing - backend offline' });
      }
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by grade
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(student => student.grade.toString() === selectedGrade);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.studentID.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    }

    setFilteredStudents(filtered);
  };

  const uniqueGrades = Array.from(new Set(students.map(student => student.grade))).sort();

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Student Information</h1>
        <p style={{ color: '#6b7280' }}>View and manage student details</p>
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

      {/* Filters */}
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
            Search Students:
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or email..."
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '250px'
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
              minWidth: '120px'
            }}
          >
            <option value="all">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade.toString()}>Grade {grade}</option>
            ))}
          </select>
        </div>

        <div style={{ marginLeft: 'auto', color: '#6b7280' }}>
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Students List */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            {students.length === 0 ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>
                  No students found
                </p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Students will appear here once they're registered in the system
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <p style={{ color: '#6b7280', fontSize: '18px' }}>
                  No students match your search criteria
                </p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Try adjusting your search or filter settings
                </p>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{
              background: '#f9fafb',
              padding: '15px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'grid',
              gridTemplateColumns: '150px 200px 80px 200px 1fr',
              fontWeight: '600',
              color: '#374151'
            }}>
              <div>Student ID</div>
              <div>Name</div>
              <div>Grade</div>
              <div>Email</div>
              <div>Parents</div>
            </div>

            {/* Student Rows */}
            {filteredStudents.map((student, index) => (
              <div
                key={student._id || student.id || student.studentID}
                style={{
                  padding: '20px',
                  borderBottom: index < filteredStudents.length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '150px 200px 80px 200px 1fr',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#f9fafb'
                }}
              >
                <div>
                  <span style={{
                    fontFamily: 'monospace',
                    background: '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {student.studentID}
                  </span>
                </div>
                
                <div>
                  <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                    {student.firstName} {student.lastName}
                  </div>
                </div>
                
                <div>
                  <span style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Grade {student.grade}
                  </span>
                </div>
                
                <div>
                  <a 
                    href={`mailto:${student.email}`}
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
                    {student.email}
                  </a>
                </div>
                
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {student.fathersName && (
                    <div>Father: {student.fathersName}</div>
                  )}
                  {student.mothersName && (
                    <div>Mother: {student.mothersName}</div>
                  )}
                  {!student.fathersName && !student.mothersName && (
                    <span style={{ color: '#9ca3af' }}>No parent info</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {filteredStudents.length > 0 && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#3b82f6' }}>
              {students.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Students</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
              {uniqueGrades.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Active Grades</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#f59e0b' }}>
              {filteredStudents.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Showing</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;