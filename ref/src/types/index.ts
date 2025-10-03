export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface LoginCredentials {
  id: string;
  password: string;
}

export interface Student extends User {
  _id?: string;
  studentID: string;
  grade: number;
  fathersName: string;
  mothersName: string;
  address: string;
  section?: string;
}

export interface Teacher extends User {
  _id?: string;
  teacherID: string;
  address: string;
  phone: string;
  subject: string;
  assignedClasses: string[];
}

export interface Admin extends User {
  adminID: string;
}

export interface Attendance {
  id: string;
  date: Date;
  studentID: string;
  status: 'Present' | 'Absent';
}

export interface Homework {
  id: string;
  studentID: string;
  title: string;
  description: string;
  assignDate: Date;
  dueDate: Date;
}

export interface Marks {
  id: string;
  studentID: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  examType: 'Midterm' | 'Final' | 'Class Test';
  semester: string;
  date: Date;
}

export interface Notice {
  id: string;
  studentID: string;
  title: string;
  description: string;
  date: Date;
}

export interface CalendarEvent {
  _id?: string;
  id?: string;
  studentID?: string;
  title: string;
  description: string;
  date: Date;
  category: 'Holiday' | 'Exam' | 'Event' | 'Reminder' | 'Other';
}

export interface Timetable {
  id: string;
  classId: string;
  timetable: DaySchedule[];
}

export interface Class {
  _id?: string;
  className: string;
  grade: number;
  section: string;
  teacherId?: Teacher;
  students: Student[];
  subjects: {
    subject: string;
    teacherId?: Teacher;
  }[];
  academicYear: string;
}

export interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: Period[];
}

export interface Period {
  subject: string;
  startTime: string;
  endTime: string;
}