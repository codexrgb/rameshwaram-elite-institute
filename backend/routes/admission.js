// Replace the entire admission route POST handler with this corrected version:
router.post('/', async (req, res) => {
  try {
    const { name, email, class: studentClass, password } = req.body;

    // Input validation
    if (!name || !email || !studentClass || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists with this email'
      });
    }

    // Create new student
    const student = new Student({
      name,
      email,
      class: studentClass,
      password
    });
    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admission successful! Please login with your credentials.',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        class: student.class
      }
    });
  } catch (error) {
    console.error('Admission error:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({ success: false, message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error during admission' });
  }
});
