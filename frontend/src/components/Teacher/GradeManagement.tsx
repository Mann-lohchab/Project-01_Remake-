// import React, { useState, useEffect } from 'react';
// import { teacherAPI } from '../../services/api';

// interface Student {
//   id: string;
//   studentID: string;
//   firstName: string;
//   lastName: string;
//   grade: number;
// }

// interface Mark {
//   id?: string;
//   studentID: string;
//   subject: string;
//   marksObtained: number;
//   totalMarks: number;
//   examType: 'Midterm' | 'Final' | 'Class Test' | 'Assignment' | 'Quiz';
//   semester: string;
//   date: string;
//   comments?: string;
// }

// const GradeManagement: React.FC = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [marks, setMarks] = useState<Mark[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState<string>('');
//   const [selectedGrade, setSelectedGrade] = useState<string>('all');
//   const [showAddMarks, setShowAddMarks] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//   const [formData, setFormData] = useState<Mark>({
//     studentID: '',
//     subject: '',
//     marksObtained: 0,
//     totalMarks: 100,
//     examType: 'Class Test',
//     semester: '',
//     date: new Date().toISOString().split('T')[0],
//     comments: ''
//   });

//   useEffect(() => {
//     loadStudents();
//     loadMarks();
//   }, []);

//   const loadStudents = async () => {
//     setLoading(true);
//     try {
//       const data = await teacherAPI.getStudents();
//       setStudents(data);
//     } catch (error) {
//       console.error('Error loading students:', error);
//       setMessage({ type: 'error', text: 'Failed to load students' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMarks = async () => {
//     try {
//       const data = await teacherAPI.getMarks();
//       setMarks(data);
//       // Cache for offline use
//       localStorage.setItem('teacher_marks', JSON.stringify(data));
//     } catch (error) {
//       console.error('Error loading marks from API:', error);
//       // Fallback to localStorage
//       const savedMarks = localStorage.getItem('teacher_marks');
//       if (savedMarks) {
//         setMarks(JSON.parse(savedMarks));
//       }
//     }
//   };

//   const handleInputChange = (field: keyof Mark, value: string | number) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       studentID: '',
//       subject: '',
//       marksObtained: 0,
//       totalMarks: 100,
//       examType: 'Class Test',
//       semester: '',
//       date: new Date().toISOString().split('T')[0],
//       comments: ''
//     });
//     setShowAddMarks(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       await teacherAPI.addMarks(formData);
//       const newMark = { ...formData, id: Date.now().toString() };
//       const updatedMarks = [newMark, ...marks];
//       setMarks(updatedMarks);
//       localStorage.setItem('teacher_marks', JSON.stringify(updatedMarks));
//       setMessage({ type: 'success', text: 'Marks added successfully!' });
//       resetForm();
//       setTimeout(() => setMessage(null), 3000);
//     } catch (error) {
//       console.error('Error adding marks:', error);
//       setMessage({ type: 'error', text: 'Failed to add marks' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = (markId: string) => {
//     if (window.confirm('Are you sure you want to delete this mark entry?')) {
//       const updatedMarks = marks.filter(mark => mark.id !== markId);
//       setMarks(updatedMarks);
//       localStorage.setItem('teacher_marks', JSON.stringify(updatedMarks));
//       setMessage({ type: 'success', text: 'Mark entry deleted successfully!' });
//       setTimeout(() => setMessage(null), 3000);
//     }
//   };

//   const getStudentName = (studentID: string) => {
//     const student = students.find(s => s.studentID === studentID);
//     return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
//   };

//   const calculatePercentage = (obtained: number, total: number) => {
//     return ((obtained / total) * 100).toFixed(1);
//   };

//   const getGradeFromPercentage = (percentage: number) => {
//     if (percentage >= 90) return 'A+';
//     if (percentage >= 80) return 'A';
//     if (percentage >= 70) return 'B';
//     if (percentage >= 60) return 'C';
//     if (percentage >= 50) return 'D';
//     return 'F';
//   };

//   const filteredStudents = selectedGrade === 'all' 
//     ? students 
//     : students.filter(student => student.grade.toString() === selectedGrade);

//   const filteredMarks = selectedStudent 
//     ? marks.filter(mark => mark.studentID === selectedStudent)
//     : marks;

//   const subjects = [
//     'Mathematics', 'Science', 'English', 'Social Studies', 'History',
//     'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
//     'Art', 'Music', 'Physical Education'
//   ];

//   const examTypes = ['Class Test', 'Assignment', 'Quiz', 'Midterm', 'Final'];
//   const semesters = ['Spring 2024', 'Fall 2024', 'Spring 2025', 'Fall 2025'];
//   const uniqueGrades = Array.from(new Set(students.map(student => student.grade))).sort();

//   return (
//     <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         marginBottom: '30px'
//       }}>
//         <div>
//           <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Grade Management</h1>
//           <p style={{ color: '#6b7280' }}>Enter and manage student marks and grades</p>
//         </div>
        
//         <button
//           onClick={() => setShowAddMarks(true)}
//           style={{
//             background: '#f59e0b',
//             color: 'white',
//             padding: '12px 24px',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             fontWeight: '600',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px'
//           }}
//         >
//           <span>+</span> Add Marks
//         </button>
//       </div>

//       {/* Message */}
//       {message && (
//         <div style={{
//           background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
//           color: message.type === 'success' ? '#065f46' : '#991b1b',
//           padding: '12px',
//           borderRadius: '6px',
//           marginBottom: '20px',
//           border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
//         }}>
//           {message.text}
//         </div>
//       )}

//       {/* Filters */}
//       <div style={{ 
//         background: 'white',
//         padding: '20px',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         marginBottom: '20px',
//         display: 'flex',
//         gap: '20px',
//         alignItems: 'center',
//         flexWrap: 'wrap'
//       }}>
//         <div>
//           <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//             Grade:
//           </label>
//           <select
//             value={selectedGrade}
//             onChange={(e) => setSelectedGrade(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               border: '1px solid #d1d5db',
//               borderRadius: '6px',
//               fontSize: '14px',
//               minWidth: '120px'
//             }}
//           >
//             <option value="all">All Grades</option>
//             {uniqueGrades.map(grade => (
//               <option key={grade} value={grade.toString()}>Grade {grade}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//             Student:
//           </label>
//           <select
//             value={selectedStudent}
//             onChange={(e) => setSelectedStudent(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               border: '1px solid #d1d5db',
//               borderRadius: '6px',
//               fontSize: '14px',
//               minWidth: '200px'
//             }}
//           >
//             <option value="">All Students</option>
//             {filteredStudents.map(student => (
//               <option key={student.id} value={student.studentID}>
//                 {student.firstName} {student.lastName} ({student.studentID})
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedStudent && (
//           <div style={{ marginLeft: 'auto', color: '#6b7280' }}>
//             Showing marks for: {getStudentName(selectedStudent)}
//           </div>
//         )}
//       </div>

//       {/* Add Marks Modal */}
//       {showAddMarks && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             background: 'white',
//             padding: '30px',
//             borderRadius: '12px',
//             width: '90%',
//             maxWidth: '600px',
//             maxHeight: '90vh',
//             overflow: 'auto',
//             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
//           }}>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '20px'
//             }}>
//               <h2 style={{ margin: 0, color: '#1f2937' }}>Add Student Marks</h2>
//               <button
//                 onClick={resetForm}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '24px',
//                   cursor: 'pointer',
//                   padding: '0',
//                   color: '#6b7280'
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div style={{ display: 'grid', gap: '15px' }}>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                     Student *
//                   </label>
//                   <select
//                     value={formData.studentID}
//                     onChange={(e) => handleInputChange('studentID', e.target.value)}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '16px'
//                     }}
//                   >
//                     <option value="">Select Student</option>
//                     {students.map(student => (
//                       <option key={student.id} value={student.studentID}>
//                         {student.firstName} {student.lastName} ({student.studentID}) - Grade {student.grade}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//                   <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                       Subject *
//                     </label>
//                     <select
//                       value={formData.subject}
//                       onChange={(e) => handleInputChange('subject', e.target.value)}
//                       required
//                       style={{
//                         width: '100%',
//                         padding: '10px',
//                         border: '1px solid #d1d5db',
//                         borderRadius: '6px',
//                         fontSize: '16px'
//                       }}
//                     >
//                       <option value="">Select Subject</option>
//                       {subjects.map(subject => (
//                         <option key={subject} value={subject}>{subject}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                       Exam Type *
//                     </label>
//                     <select
//                       value={formData.examType}
//                       onChange={(e) => handleInputChange('examType', e.target.value)}
//                       required
//                       style={{
//                         width: '100%',
//                         padding: '10px',
//                         border: '1px solid #d1d5db',
//                         borderRadius: '6px',
//                         fontSize: '16px'
//                       }}
//                     >
//                       {examTypes.map(type => (
//                         <option key={type} value={type}>{type}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
//                   <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                       Marks Obtained *
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.marksObtained}
//                       onChange={(e) => handleInputChange('marksObtained', parseFloat(e.target.value) || 0)}
//                       required
//                       min="0"
//                       max={formData.totalMarks}
//                       step="0.5"
//                       style={{
//                         width: '100%',
//                         padding: '10px',
//                         border: '1px solid #d1d5db',
//                         borderRadius: '6px',
//                         fontSize: '16px'
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                       Total Marks *
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.totalMarks}
//                       onChange={(e) => handleInputChange('totalMarks', parseFloat(e.target.value) || 100)}
//                       required
//                       min="1"
//                       style={{
//                         width: '100%',
//                         padding: '10px',
//                         border: '1px solid #d1d5db',
//                         borderRadius: '6px',
//                         fontSize: '16px'
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                       Percentage
//                     </label>
//                     <input
//                       type="text"
//                       value={calculatePercentage(formData.marksObtained, formData.totalMarks) + '%'}
//                       readOnly
//                       style={{
//                         width: '100%',
//                         padding: '10px',
//                         border: '1px solid #d1d5db',
//                         borderRadius: '6px',
//                         fontSize: '16px',
//                         background: '#f9fafb',
//                         color: '#6b7280'
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//                   <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                       Semester *
//                     </label>
//                     <select
//                       value={formData.semester}
//                       onChange={(e) => handleInputChange('semester', e.target.value)}
//                       required
//                       style={{
//                         width: '100%',
//                         padding: '10px',
//                         border: '1px solid #d1d5db',
//                         borderRadius: '6px',
//                         fontSize: '16px'
//                       }}
//                     >
//                       <option value="">Select Semester</option>
//                       {semesters.map(semester => (
//                         <option key={semester} value={semester}>{semester}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                       Date *
//                     </label>
//                     <input
//                       type="date"
//                       value={formData.date}
//                       onChange={(e) => handleInputChange('date', e.target.value)}
//                       required
//                       style={{
//                         width: '100%',
//                         padding: '10px',
//                         border: '1px solid #d1d5db',
//                         borderRadius: '6px',
//                         fontSize: '16px'
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
//                     Comments (Optional)
//                   </label>
//                   <textarea
//                     value={formData.comments}
//                     onChange={(e) => handleInputChange('comments', e.target.value)}
//                     rows={3}
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '6px',
//                       fontSize: '16px',
//                       resize: 'vertical'
//                     }}
//                     placeholder="Any additional comments about the performance..."
//                   />
//                 </div>
//               </div>

//               <div style={{
//                 display: 'flex',
//                 gap: '10px',
//                 justifyContent: 'flex-end',
//                 marginTop: '25px',
//                 paddingTop: '20px',
//                 borderTop: '1px solid #e5e7eb'
//               }}>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   style={{
//                     background: '#f3f4f6',
//                     color: '#374151',
//                     padding: '10px 20px',
//                     border: '1px solid #d1d5db',
//                     borderRadius: '6px',
//                     cursor: 'pointer',
//                     fontSize: '14px'
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   style={{
//                     background: saving ? '#9ca3af' : '#f59e0b',
//                     color: 'white',
//                     padding: '10px 20px',
//                     border: 'none',
//                     borderRadius: '6px',
//                     cursor: saving ? 'not-allowed' : 'pointer',
//                     fontSize: '14px',
//                     fontWeight: '500'
//                   }}
//                 >
//                   {saving ? 'Adding...' : 'Add Marks'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Marks List */}
//       <div style={{
//         background: 'white',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         overflow: 'hidden'
//       }}>
//         {loading ? (
//           <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
//             Loading marks...
//           </div>
//         ) : filteredMarks.length === 0 ? (
//           <div style={{ padding: '40px', textAlign: 'center' }}>
//             <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
//             <p style={{ color: '#6b7280', fontSize: '18px' }}>
//               No marks recorded yet
//             </p>
//             <p style={{ color: '#9ca3af', fontSize: '14px' }}>
//               Click "Add Marks" to start recording student grades
//             </p>
//           </div>
//         ) : (
//           <div>
//             <div style={{
//               background: '#f9fafb',
//               padding: '15px 20px',
//               borderBottom: '1px solid #e5e7eb',
//               display: 'grid',
//               gridTemplateColumns: '1.5fr 1fr 1fr 100px 100px 100px 80px 120px',
//               fontWeight: '600',
//               color: '#374151'
//             }}>
//               <div>Student</div>
//               <div>Subject</div>
//               <div>Exam Type</div>
//               <div>Obtained</div>
//               <div>Total</div>
//               <div>%</div>
//               <div>Grade</div>
//               <div>Actions</div>
//             </div>

//             {filteredMarks.map((mark, index) => (
//               <div
//                 key={mark.id}
//                 style={{
//                   padding: '15px 20px',
//                   borderBottom: index < filteredMarks.length - 1 ? '1px solid #e5e7eb' : 'none',
//                   display: 'grid',
//                   gridTemplateColumns: '1.5fr 1fr 1fr 100px 100px 100px 80px 120px',
//                   alignItems: 'center',
//                   background: index % 2 === 0 ? 'white' : '#f9fafb'
//                 }}
//               >
//                 <div>
//                   <div style={{ fontWeight: '500', color: '#111827' }}>
//                     {getStudentName(mark.studentID)}
//                   </div>
//                   <div style={{ fontSize: '12px', color: '#6b7280' }}>
//                     {mark.studentID}
//                   </div>
//                 </div>
//                 <div style={{ color: '#374151' }}>{mark.subject}</div>
//                 <div style={{ color: '#6b7280', fontSize: '14px' }}>{mark.examType}</div>
//                 <div style={{ fontWeight: '600', color: '#111827' }}>{mark.marksObtained}</div>
//                 <div style={{ color: '#6b7280' }}>{mark.totalMarks}</div>
//                 <div style={{ fontWeight: '600', color: '#f59e0b' }}>
//                   {calculatePercentage(mark.marksObtained, mark.totalMarks)}%
//                 </div>
//                 <div style={{
//                   fontWeight: '600',
//                   color: parseFloat(calculatePercentage(mark.marksObtained, mark.totalMarks)) >= 60 ? '#10b981' : '#ef4444'
//                 }}>
//                   {getGradeFromPercentage(parseFloat(calculatePercentage(mark.marksObtained, mark.totalMarks)))}
//                 </div>
//                 <div>
//                   <button
//                     onClick={() => mark.id && handleDelete(mark.id)}
//                     style={{
//                       background: '#ef4444',
//                       color: 'white',
//                       padding: '6px 10px',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '12px'
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GradeManagement;









import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';

interface Student {
  id: string;
  studentID: string;
  firstName: string;
  lastName: string;
  grade: number;
}

interface Mark {
  id?: string;
  studentID: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  examType: 'Midterm' | 'Final' | 'Class Test' | 'Assignment' | 'Quiz';
  semester: string;
  date: string;
  comments?: string;
}

const GradeManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [showAddMarks, setShowAddMarks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState<Mark>({
    studentID: '',
    subject: '',
    marksObtained: 0,
    totalMarks: 100,
    examType: 'Class Test',
    semester: '',
    date: new Date().toISOString().split('T')[0],
    comments: ''
  });

  useEffect(() => {
    loadStudents();
    loadMarks();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await teacherAPI.getStudents();
      console.log('Students:', data);
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      setMessage({ type: 'error', text: 'Failed to load students' });
    } finally {
      setLoading(false);
    }
  };

  const loadMarks = async () => {
    try {
      const data = await teacherAPI.getMarks();
      console.log('Marks:', data);
      const formattedMarks = data.map((mark: any) => ({
        id: mark.id?.toString() || Date.now().toString(),
        studentID: mark.studentID,
        subject: mark.subject,
        marksObtained: Number(mark.marksObtained) || 0,
        totalMarks: Number(mark.totalMarks) || 100,
        examType: mark.examType as 'Midterm' | 'Final' | 'Class Test' | 'Assignment' | 'Quiz',
        semester: mark.semester,
        date: mark.date,
        comments: mark.comments || ''
      }));
      setMarks(formattedMarks);
      localStorage.setItem('teacher_marks', JSON.stringify(formattedMarks));
    } catch (error) {
      console.error('Error loading marks from API:', error);
      const savedMarks = localStorage.getItem('teacher_marks');
      if (savedMarks) {
        setMarks(JSON.parse(savedMarks));
      }
    }
  };

  const handleInputChange = (field: keyof Mark, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'marksObtained' || field === 'totalMarks' ? Number(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setFormData({
      studentID: '',
      subject: '',
      marksObtained: 0,
      totalMarks: 100,
      examType: 'Class Test',
      semester: '',
      date: new Date().toISOString().split('T')[0],
      comments: ''
    });
    setShowAddMarks(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    setSaving(true);
    try {
      await teacherAPI.addMarks(formData);
      const newMark = { ...formData, id: Date.now().toString() };
      const updatedMarks = [newMark, ...marks];
      setMarks(updatedMarks);
      localStorage.setItem('teacher_marks', JSON.stringify(updatedMarks));
      setMessage({ type: 'success', text: 'Marks added successfully!' });
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error adding marks:', error);
      setMessage({ type: 'error', text: 'Failed to add marks' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (markId: string) => {
    if (window.confirm('Are you sure you want to delete this mark entry?')) {
      try {
        await teacherAPI.deleteMark(markId);
        const updatedMarks = marks.filter(mark => mark.id !== markId);
        setMarks(updatedMarks);
        localStorage.setItem('teacher_marks', JSON.stringify(updatedMarks));
        setMessage({ type: 'success', text: 'Mark entry deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting mark:', error);
        setMessage({ type: 'error', text: 'Failed to delete mark' });
      }
    }
  };

  const getStudentName = (studentID: string) => {
    const student = students.find(s => s.studentID === studentID);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const calculatePercentage = (obtained: number, total: number) => {
    const validObtained = isNaN(obtained) || obtained === null ? 0 : obtained;
    const validTotal = isNaN(total) || total === null || total === 0 ? 100 : total;
    return ((validObtained / validTotal) * 100).toFixed(1);
  };

  const getGradeFromPercentage = (percentage: number) => {
    if (isNaN(percentage)) return 'F';
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const filteredStudents = selectedGrade === 'all' 
    ? students 
    : students.filter(student => student.grade.toString() === selectedGrade);

  const filteredMarks = selectedStudent
    ? marks.filter(mark => mark.studentID === selectedStudent)
    : marks;

  const getGroupedMarks = () => {
    const grouped: { [key: string]: any } = {};

    filteredMarks.forEach((mark) => {
      if (!grouped[mark.studentID]) {
        const student = students.find(s => s.studentID === mark.studentID);
        grouped[mark.studentID] = {
          studentID: mark.studentID,
          name: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          maths: null,
          science: null,
          physics: null
        };
      }
      if (mark.subject === 'Mathematics') grouped[mark.studentID].maths = mark;
      if (mark.subject === 'Science') grouped[mark.studentID].science = mark;
      if (mark.subject === 'Physics') grouped[mark.studentID].physics = mark;
    });

    return Object.values(grouped);
  };

  const groupedMarks = getGroupedMarks();

  const subjects = [
    'Mathematics', 'Science', 'English', 'Social Studies', 'History',
    'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Art', 'Music', 'Physical Education'
  ];

  const examTypes = ['Class Test', 'Assignment', 'Quiz', 'Midterm', 'Final'];
  const semesters = ['Spring 2024', 'Fall 2024', 'Spring 2025', 'Fall 2025'];
  const uniqueGrades = Array.from(new Set(students.map(student => student.grade))).sort();

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Grade Management</h1>
          <p style={{ color: '#6b7280' }}>Enter and manage student marks and grades</p>
        </div>
        
        <button
          onClick={() => setShowAddMarks(true)}
          style={{
            background: '#f59e0b',
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
          <span>+</span> Add Marks
        </button>
      </div>

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

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Student:
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '200px'
            }}
          >
            <option value="">All Students</option>
            {filteredStudents.map(student => (
              <option key={student.id} value={student.studentID}>
                {student.firstName} {student.lastName} ({student.studentID})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div style={{ marginLeft: 'auto', color: '#6b7280' }}>
            Showing marks for: {getStudentName(selectedStudent)}
          </div>
        )}
      </div>

      {showAddMarks && (
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
            maxWidth: '600px',
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
              <h2 style={{ margin: 0, color: '#1f2937' }}>Add Student Marks</h2>
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
                    Student *
                  </label>
                  <select
                    value={formData.studentID}
                    onChange={(e) => handleInputChange('studentID', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.studentID}>
                        {student.firstName} {student.lastName} ({student.studentID}) - Grade {student.grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Exam Type *
                    </label>
                    <select
                      value={formData.examType}
                      onChange={(e) => handleInputChange('examType', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      {examTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Marks Obtained *
                    </label>
                    <input
                      type="number"
                      value={formData.marksObtained}
                      onChange={(e) => handleInputChange('marksObtained', parseFloat(e.target.value) || 0)}
                      required
                      min="0"
                      max={formData.totalMarks}
                      step="0.5"
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
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => handleInputChange('totalMarks', parseFloat(e.target.value) || 100)}
                      required
                      min="1"
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
                      Percentage
                    </label>
                    <input
                      type="text"
                      value={calculatePercentage(formData.marksObtained, formData.totalMarks) + '%'}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: '#f9fafb',
                        color: '#6b7280'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Semester *
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => handleInputChange('semester', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Select Semester</option>
                      {semesters.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>

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
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Comments (Optional)
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Any additional comments about the performance..."
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
                    background: saving ? '#9ca3af' : '#f59e0b',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {saving ? 'Adding...' : 'Add Marks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading marks...
          </div>
        ) : groupedMarks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>
              No marks recorded yet
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Click "Add Marks" to start recording student grades
            </p>
          </div>
        ) : (
          <div>
            <div style={{
              background: '#f9fafb',
              padding: '15px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
              fontWeight: '600',
              color: '#374151'
            }}>
              <div>Student</div>
              <div>Mathematics</div>
              <div>Science</div>
              <div>Physics</div>
            </div>

            {groupedMarks.map((group: any, index: number) => (
              <div
                key={group.studentID}
                style={{
                  padding: '15px 20px',
                  borderBottom: index < groupedMarks.length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#f9fafb'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', color: '#111827' }}>
                    {group.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {group.studentID}
                  </div>
                </div>
                <div style={{ color: group.maths && parseFloat(calculatePercentage(group.maths.marksObtained, group.maths.totalMarks)) >= 60 ? '#10b981' : '#ef4444' }}>
                  {group.maths ? `${group.maths.marksObtained}/${group.maths.totalMarks} (${calculatePercentage(group.maths.marksObtained, group.maths.totalMarks)}%)` : 'N/A'}
                </div>
                <div style={{ color: group.science && parseFloat(calculatePercentage(group.science.marksObtained, group.science.totalMarks)) >= 60 ? '#10b981' : '#ef4444' }}>
                  {group.science ? `${group.science.marksObtained}/${group.science.totalMarks} (${calculatePercentage(group.science.marksObtained, group.science.totalMarks)}%)` : 'N/A'}
                </div>
                <div style={{ color: group.physics && parseFloat(calculatePercentage(group.physics.marksObtained, group.physics.totalMarks)) >= 60 ? '#10b981' : '#ef4444' }}>
                  {group.physics ? `${group.physics.marksObtained}/${group.physics.totalMarks} (${calculatePercentage(group.physics.marksObtained, group.physics.totalMarks)}%)` : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeManagement;