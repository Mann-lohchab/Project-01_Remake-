require('dotenv').config();//this loads up the environment variables
const PORT = process.env.BACKEND_PORT || 3001;

//CORE MODULES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Request logging middleware - MUST BE FIRST
app.use((req, res, next) => {
  console.log(`🌐 Incoming request: ${req.method} ${req.url}`);
  
  // Only log detailed headers in development
  if (process.env.NODE_ENV !== 'production') {
    const safeHeaders = { ...req.headers };
    // Redact sensitive headers
    if (safeHeaders.authorization) safeHeaders.authorization = '[REDACTED]';
    if (safeHeaders.cookie) safeHeaders.cookie = '[REDACTED]';
    console.log('📦 Headers:', safeHeaders);
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    // Redact all password fields
    Object.keys(safeBody).forEach(key => {
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        safeBody[key] = '[REDACTED]';
      }
    });
    console.log('📝 Body:', safeBody);
  }
  next();
});

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added to handle URL-encoded data
app.use(cookieParser()); // Parse cookies
// CORS configuration - secure by default
const corsOrigin = (origin, callback) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:5000', 'http://localhost:3000', 'http://localhost:3001'];
  
  // Allow requests with no origin (e.g., mobile apps, Postman)
  if (!origin) return callback(null, true);
  
  if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
console.log('✅ Static files serving enabled from /public');

//CONNECTION TO MONGODB
console.log('🔄 Attempting MongoDB connection...');
const connectDB = require('./config/database');
connectDB().then(connected => {
  if (connected) {
    console.log('✅ MongoDB connection initiated successfully');
  } else {
    console.log('⚠️  Server starting without database connection');
  }
}).catch(err => {
  console.error('❌ Database connection error:', err.message);
  console.log('⚠️  Server starting without database connection');
});

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB connection error:', err.message);
});

// STUDENT ROUTES
console.log('🔄 Loading API routes...');
const StudentAuth = require('./Routes/StudentAuth');
const Attendance = require('./Routes/Attendance');
const Calendar = require('./Routes/Calendar');
const Homework = require('./Routes/Homework');
const Marks = require('./Routes/Marks');
const Notice = require('./Routes/Notice');
const Timetable = require('./Routes/Timetable');

app.use('/api/students', StudentAuth);
app.use('/api/students/Attendance',Attendance);
app.use('/api/students/Calendar',Calendar);
app.use('/api/students/Homework',Homework);
app.use('/api/students/Marks',Marks);
app.use('/api/students/Notice',Notice);
app.use('/api/students/Timetable',Timetable);
console.log('✅ All API routes loaded');

//ADMIN ROUTES
const AdminAuth = require('./Routes/Admin/AdminAuth');
const AdminStudents = require('./Routes/Admin/Student');
const AdminTeachers = require('./Routes/Admin/Teacher');
const AdminCalendar = require('./Routes/Admin/Calendar');

app.use('/api/admin', AdminAuth);
app.use('/api/admin/students', AdminStudents);
app.use('/api/admin/teachers', AdminTeachers);
app.use('/api/admin/calendar', AdminCalendar);

console.log('✅ Admin routes loaded');

//TEACHER ROUTES
const TeacherAuth = require('./Routes/Teacher/TeacherAuth');
const TeacherAttendance = require('./Routes/Teacher/Attendance');
const TeacherCalendar = require('./Routes/Teacher/Calendar');
const TeacherHomework = require('./Routes/Teacher/Homework');
const TeacherMarks = require('./Routes/Teacher/Marks');
const TeacherTimetable = require('./Routes/Teacher/Timetable');
const TeacherNotice = require('./Routes/Teacher/Notice');

app.use('/api/teachers', TeacherAuth);
app.use('/api/teachers/Attendance', TeacherAttendance);
app.use('/api/teachers/Calendar', TeacherCalendar);
app.use('/api/teachers/Homework', TeacherHomework);
app.use('/api/teachers/Marks', TeacherMarks);
app.use('/api/teachers/Timetable', TeacherTimetable);
app.use('/api/teachers/Notice', TeacherNotice);

console.log('✅ Teacher routes loaded');


// Health check endpoint
app.get('/healthz', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'disconnected'
  };
  
  // Check MongoDB connection status
  if (mongoose.connection.readyState === 1) {
    health.database = 'connected';
  } else if (mongoose.connection.readyState === 2) {
    health.database = 'connecting';
  }
  
  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Default Route - Serve HTML file with logging
app.get('/', (req, res) => {
  console.log('📄 Serving landing page request');
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      console.log('❌ HTML file not found, sending fallback message');
      res.send('Student Portal API is running!');
    } else {
      console.log('✅ HTML file served successfully');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Public: http://0.0.0.0:${PORT}`);
  console.log('📊 Ready to accept requests...');
});



