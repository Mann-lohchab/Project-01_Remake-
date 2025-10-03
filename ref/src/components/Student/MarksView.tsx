import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

interface MarkRecord {
  _id: string;
  studentID: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  examType: 'Midterm' | 'Final' | 'Class Test' | 'Assignment';
  semester: string;
  date: string;
  grade?: string;
}

const MarksView: React.FC = () => {
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMarks = async () => {
      if (!user || user.role !== 'student') {
        setError('User not authenticated as student');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Get studentID from user object - handle different property names
        const studentId = (user as any).studentID || 
                             (user as any).studentId || 
                      (user as any).student_id || 
                       (user as any).id;
        
        if (!studentId) {
          throw new Error('Student ID not found in user data');
        }
        
        console.log('Fetching marks for student:', studentId);
        
        const response = await studentAPI.getMarks(studentId);
        console.log('Marks API response:', response);
        
        // Handle different response formats
        let marksData = [];
        if (response.marks && Array.isArray(response.marks)) {
          marksData = response.marks;
        } else if (Array.isArray(response)) {
          marksData = response;
        } else if (response.data && Array.isArray(response.data)) {
          marksData = response.data;
        }
        
        setMarks(marksData);
        
        if (marksData.length === 0) {
          console.log('No marks data found for student');
        }
      } catch (err: any) {
        console.error('Error fetching marks:', err);
        setError(err.message || 'Failed to fetch marks data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [user]);

  const calculateOverallPercentage = () => {
    if (marks.length === 0) return 0;
    const totalPossible = marks.reduce((sum, mark) => sum + (mark.totalMarks || 100), 0);
    const totalObtained = marks.reduce((sum, mark) => sum + mark.marksObtained, 0);
    return totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;
  };

  const getSubjectWiseMarks = () => {
    const subjectMap: { [key: string]: { obtained: number; total: number; count: number } } = {};
    
    marks.forEach(mark => {
      if (!subjectMap[mark.subject]) {
        subjectMap[mark.subject] = { obtained: 0, total: 0, count: 0 };
      }
      subjectMap[mark.subject].obtained += mark.marksObtained;
      subjectMap[mark.subject].total += (mark.totalMarks || 100);
      subjectMap[mark.subject].count += 1;
    });

    return Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      percentage: data.total > 0 ? Math.round((data.obtained / data.total) * 100) : 0,
      obtained: data.obtained,
      total: data.total,
      count: data.count
    }));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#CCCCCC'
      }}>
        Loading marks data...
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
        borderRadius: '4px'
      }}>
        <strong>Error:</strong> {error}
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
          Please try refreshing the page or contact support if the issue persists.
        </div>
      </div>
    );
  }

  if (!marks || marks.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#444444',
        borderRadius: '4px',
        color: '#CCCCCC'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>No Marks Available</h3>
        <p>Your marks will appear here once they are uploaded by your teachers.</p>
      </div>
    );
  }

  const overallPercentage = calculateOverallPercentage();
  const subjectWiseMarks = getSubjectWiseMarks();

  return (
    <div>
      {/* Performance Overview Card */}
      <div style={{
        backgroundColor: '#444444',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#CCCCCC', marginBottom: '15px' }}>Academic Performance</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#CCCCCC'
            }}>
              {overallPercentage}%
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Overall Performance</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#CCCCCC' }}>
              {marks.length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Total Assessments</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#CCCCCC' }}>
              {subjectWiseMarks.length}
            </div>
            <div style={{ fontSize: '14px', color: '#999999' }}>Subjects</div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* Subject-wise Performance */}
        <div style={{
          backgroundColor: '#444444',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#CCCCCC' }}>Subject-wise Performance</h4>
          <div>
            {subjectWiseMarks.map((subjectData) => (
              <div key={subjectData.subject} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #555555'
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#CCCCCC' }}>{subjectData.subject}</div>
                  <div style={{ fontSize: '12px', color: '#999999' }}>
                    {subjectData.obtained}/{subjectData.total} ({subjectData.count} tests)
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '60px',
                    height: '8px',
                    backgroundColor: '#666666',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${subjectData.percentage}%`,
                      height: '100%',
                      backgroundColor: '#CCCCCC'
                    }}></div>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#CCCCCC'
                  }}>
                    {subjectData.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Test Results */}
        <div style={{
          backgroundColor: '#444444',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#CCCCCC' }}>Recent Test Results</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {marks.slice(0, 8).map((mark) => {
              const percentage = mark.totalMarks > 0 ?
                Math.round((mark.marksObtained / mark.totalMarks) * 100) : 0;

              return (
                <div key={mark._id} style={{
                  padding: '12px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  backgroundColor: '#555555'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '5px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#CCCCCC' }}>{mark.subject}</div>
                      <div style={{ fontSize: '12px', color: '#999999' }}>
                        {mark.examType} - {mark.semester}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#CCCCCC'
                      }}>
                        {mark.marksObtained}/{mark.totalMarks || 100}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#CCCCCC'
                      }}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#999999' }}>
                    Date: {new Date(mark.date).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksView;