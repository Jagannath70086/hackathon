import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Student from '../models/student.js';
import Teacher from '../models/teacher.js';

const router = express.Router();

router.post('/student/register', async (req, res) => {
  console.log("Student register route hit with body:", req.body);
  
  if (!req.body) {
    return res.status(400).send({ success: false, message: 'Request body is missing' });
  }
  
  const { name, regdNo, password } = req.body;
  
  if (!name || !regdNo || !password) {
    return res.status(400).send({ 
      success: false, 
      message: 'Name, registration number, and password are required' 
    });
  }

  try {
    const existingStudent = await Student.findOne({ regdNo });
    if (existingStudent) {
      return res.status(400).send({ success: false, message: 'Registration number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newStudent = new Student({ 
      name, 
      regdNo,
      password: hashedPassword
    });
    
    const savedStudent = await newStudent.save();
    console.log("Student saved to database:", savedStudent);

    const token = jwt.sign({ id: savedStudent._id, regdNo: savedStudent.regdNo, name: savedStudent.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send({ 
      success: true, 
      message: 'Student registered successfully!',
      studentId: savedStudent._id ,
      token
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).send({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

router.post('/teacher/register', async (req, res) => {
  console.log("Teacher register route hit with body:", req.body);
  
  if (!req.body) {
    return res.status(400).send({ success: false, message: 'Request body is missing' });
  }
  
  const { name, phoneNo, password, department } = req.body;
  
  if (!name || !phoneNo || !password || !department) {
    return res.status(400).send({ 
      success: false, 
      message: 'Name, phone number, password, and department are required' 
    });
  }

  try {
    const existingTeacher = await Teacher.findOne({ phoneNo });
    if (existingTeacher) {
      return res.status(400).send({ success: false, message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newTeacher = new Teacher({ 
      name, 
      phoneNo,
      password: hashedPassword,
      department
    });
    
    const savedTeacher = await newTeacher.save();
    console.log("Teacher saved to database:", savedTeacher);

    const token = jwt.sign({ id: savedTeacher._id, phoneNo: savedTeacher.phoneNo, name: savedTeacher.name, department: savedTeacher.department }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send({ 
      success: true, 
      message: 'Teacher registered successfully!',
      teacherId: savedTeacher._id,
      token
    });
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(500).send({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

router.post('/student/login', async (req, res) => {
  console.log("Student login route hit with body:", req.body);
  
  if (!req.body) {
    return res.status(400).send({ success: false, message: 'Request body is missing' });
  }
  
  const { regdNo, password } = req.body;
  
  if (!regdNo || !password) {
    return res.status(400).send({ 
      success: false, 
      message: 'Registration number and password are required' 
    });
  }

  try {
    const student = await Student.findOne({ regdNo });

    if (student && await bcrypt.compare(password, student.password)) {
      const studentResponse = student.toObject();
      delete studentResponse.password;

      const token = jwt.sign({ id: student._id, regdNo: student.regdNo, name: student.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.send({ 
        success: true,
        message: 'Login successful',
        userType: 'student',
        user: studentResponse,
        token
      });
    } else {
      res.status(401).send({ 
        success: false, 
        message: 'Invalid registration number or password' 
      });
    }
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).send({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.post('/teacher/login', async (req, res) => {
  console.log("Teacher login route hit with body:", req.body);
  
  if (!req.body) {
    return res.status(400).send({ success: false, message: 'Request body is missing' });
  }
  
  const { phoneNo, password } = req.body;
  
  if (!phoneNo || !password) {
    return res.status(400).send({ 
      success: false, 
      message: 'Phone number and password are required' 
    });
  }

  try {
    const teacher = await Teacher.findOne({ phoneNo });

    if (teacher && await bcrypt.compare(password, teacher.password)) {
      const teacherResponse = teacher.toObject();
      delete teacherResponse.password;

      const token = jwt.sign({ id: teacher._id, phoneNo: teacher.phoneNo, name: teacher.name, department: teacher.department }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.send({ 
        success: true,
        message: 'Login successful',
        userType: 'teacher',
        user: teacherResponse,
        token
      });
    } else {
      res.status(401).send({ 
        success: false, 
        message: 'Invalid phone number or password' 
      });
    }
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).send({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

export default router;