require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/database');
const Student = require('../Models/Student');
const Timetable = require('../Models/Timetable');
const Notice = require('../Models/Notice');

const createSampleData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Hash password
    const saltRounds = 10;
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Create sample student if not exists
    let sampleStudent = await Student.findOne({ studentID: 'ST001' });
    if (!sampleStudent) {
      sampleStudent = new Student({
        studentID: 'ST001',
        firstName: 'John',
        lastName: 'Doe',
        fathersName: 'Father Doe',
        mothersName: 'Mother Doe',
        Address: '123 Test Street',
        grade: 10,
        classId: 'testclass',
        email: 'john.doe@example.com',
        password: hashedPassword,
        lastLoginAt: new Date()
      });

      await sampleStudent.save();
      console.log('Sample student created:', sampleStudent.studentID);
    } else {
      console.log('Sample student already exists:', sampleStudent.studentID);
    }

    // Create sample timetable for testclass if not exists
    let sampleTimetable = await Timetable.findOne({ classId: 'testclass' });
    if (!sampleTimetable) {
      sampleTimetable = new Timetable({
        classId: 'testclass',
        timetable: [
          {
            day: 'Monday',
            periods: [
              { subject: 'Math', startTime: '09:00', endTime: '10:00' },
              { subject: 'Science', startTime: '10:00', endTime: '11:00' },
              { subject: 'English', startTime: '11:00', endTime: '12:00' }
            ]
          },
          {
            day: 'Tuesday',
            periods: [
              { subject: 'History', startTime: '09:00', endTime: '10:00' },
              { subject: 'Geography', startTime: '10:00', endTime: '11:00' },
              { subject: 'Math', startTime: '11:00', endTime: '12:00' }
            ]
          },
          {
            day: 'Wednesday',
            periods: [
              { subject: 'Science', startTime: '09:00', endTime: '10:00' },
              { subject: 'English', startTime: '10:00', endTime: '11:00' },
              { subject: 'Art', startTime: '11:00', endTime: '12:00' }
            ]
          },
          {
            day: 'Thursday',
            periods: [
              { subject: 'Math', startTime: '09:00', endTime: '10:00' },
              { subject: 'History', startTime: '10:00', endTime: '11:00' },
              { subject: 'PE', startTime: '11:00', endTime: '12:00' }
            ]
          },
          {
            day: 'Friday',
            periods: [
              { subject: 'English', startTime: '09:00', endTime: '10:00' },
              { subject: 'Science', startTime: '10:00', endTime: '11:00' },
              { subject: 'Music', startTime: '11:00', endTime: '12:00' }
            ]
          }
        ]
      });

      await sampleTimetable.save();
      console.log('Sample timetable created for class:', sampleTimetable.classId);
    } else {
      console.log('Sample timetable already exists for class:', sampleTimetable.classId);
    }

    // Create sample notices for testclass if not exists
    const existingNotice = await Notice.findOne({ classId: 'testclass' });
    if (!existingNotice) {
      const sampleNotices = [
        {
          title: "School Holiday Announcement",
          description: "School will be closed on October 5th for Gandhi Jayanti. Enjoy the holiday!",
          classId: 'testclass',
          date: new Date('2025-10-02')
        },
        {
          title: "Math Competition Next Week",
          description: "Inter-class Math Competition scheduled for October 10th. Participation is encouraged for all grade 10 students.",
          classId: 'testclass',
          date: new Date('2025-10-01')
        },
        {
          title: "Parent-Teacher Meeting",
          description: "PTM for grade 10 parents on October 15th at 3 PM in the school auditorium. Attendance is mandatory.",
          classId: 'testclass',
          date: new Date('2025-09-30')
        },
        {
          title: "Library Books Due",
          description: "Reminder: All library books must be returned by October 7th. Late returns will be fined.",
          classId: 'testclass',
          date: new Date('2025-09-29')
        },
        {
          title: "Uniform Policy Update",
          description: "New uniform policy effective from October 1st. Students must wear full uniform daily.",
          classId: 'testclass',
          date: new Date('2025-09-28')
        }
      ];

      for (const noticeData of sampleNotices) {
        await new Notice(noticeData).save();
      }
      console.log('Sample notices created for class: testclass');
    } else {
      console.log('Sample notices already exist for class: testclass');
    }

    console.log('Sample data creation completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

createSampleData();