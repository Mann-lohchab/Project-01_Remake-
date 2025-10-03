import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AttendanceRecord {
  _id: string;
  studentID: string;
  subject?: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  totalClasses?: number;
  attendedClasses?: number;
}

const AttendanceView: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendance = async () => {
      console.log('=== Attendance Fetch Debug ===');
      console.log('1. User object:', user);
      console.log('2. User role:', user?.role);
      
      if (!user || user.role !== 'student') {
        console.log('3. Early return - not a student');
        setLoading(false);
        setError('User is not logged in as a student');
        return;
      }
      
      // FIX: Use 'id' field instead of 'studentID'
      const studentID = (user as any).studentID || (user as any).id;
      
      console.log('4. Student ID being used:', studentID);
      console.log('5. Token from localStorage:', localStorage.getItem('token'));
      
      if (!studentID) {
        console.error('No student ID found in user object');
        setError('Student ID not found');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('6. Making API call with ID:', studentID);
        const response = await studentAPI.getAttendance(studentID);
        
        console.log('7. Raw API Response:', response);
        console.log('8. Response type:', typeof response);
        console.log('9. Is Array?:', Array.isArray(response));
        
        // The backend returns an array directly
        if (Array.isArray(response)) {
          console.log('10. Setting attendance data, count:', response.length);
          if (response.length === 0) {
            console.log('11. No attendance records found for this student');
          }
          setAttendance(response);
        } else {
          console.log('11. Unexpected response format:', response);
          setAttendance([]);
        }
        
      } catch (err: any) {
        console.error('❌ Error Details:');
        console.error('- Full error object:', err);
        console.error('- Error message:', err.message);
        console.error('- Response status:', err.response?.status);
        console.error('- Response data:', err.response?.data);
        console.error('- Request URL:', err.config?.url);
        
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 404) {
          setError('Attendance endpoint not found. Check API routes.');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else if (!err.response) {
          setError('Network error. Cannot reach the server.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch attendance data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '16px',
        color: '#CCCCCC'
      }}>
        Loading attendance data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#444444',
        color: '#CCCCCC',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '4px',
        margin: '20px'
      }}>
        <strong>Error:</strong> {error}
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
          Check the console for detailed error information.
        </div>
      </div>
    );
  }

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(record => 
      record.status === 'Present' || record.status === 'Late'
    ).length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const percentage = calculateAttendancePercentage();

  // If no attendance records
  if (attendance.length === 0) {
    return (
      <div style={{
        backgroundColor: '#444444',
        padding: '40px',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#CCCCCC', marginBottom: '15px' }}>Attendance Records</h3>
        <p style={{ color: '#CCCCCC', fontSize: '16px' }}>
          No attendance records found for your account.
        </p>
        <p style={{ color: '#999999', fontSize: '14px', marginTop: '10px' }}>
          Attendance records will appear here once your teachers mark them.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Overview Card */}
      <div style={{
        backgroundColor: '#444444',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#CCCCCC', marginBottom: '15px' }}>Attendance Overview</h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#CCCCCC'
            }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Overall Attendance</div>
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#CCCCCC'
            }}>
              {attendance.length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Total Classes</div>
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#CCCCCC'
            }}>
              {attendance.filter(r => r.status === 'Present').length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Present</div>
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#CCCCCC'
            }}>
              {attendance.filter(r => r.status === 'Absent').length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Absent</div>
          </div>
        </div>
      </div>

      {/* Recent Attendance Card */}
      <div style={{
        backgroundColor: '#444444',
        padding: '20px',
        borderRadius: '4px'
      }}>
        <h4 style={{ marginBottom: '15px', color: '#CCCCCC' }}>Recent Attendance Records</h4>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {attendance
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 20)
            .map((record) => (
              <div
                key={record._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderBottom: '1px solid #555555'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', color: '#CCCCCC' }}>
                    {record.subject || 'General Attendance'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999999' }}>
                    {new Date(record.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: '#555555',
                  color: '#CCCCCC'
                }}>
                  {record.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;