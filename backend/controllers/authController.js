
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config(); // Load the dotenv configuration
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');



const login = async (req, res, jwtSecret) => {
  const { username, password } = req.body;

  console.log('Received username:', username);
  console.log('Received password:', password);
  console.log('JWT_SECRET value:', JWT_SECRET);

  try {
    const user = await User.findOne({ username });

    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    console.log('User found:', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('bcrypt.compare result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      console.log('Provided password:', password);
      console.log('Stored hashed password:', user.password);
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
  // Regenerate the token with a new expiration time
  const token = jwt.sign({ id: user._id }, jwtSecret, {
    expiresIn: (30 * 24 * 60 * 60) - 300, // 30 days in seconds minus 5 minutes buffer
  });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const signup = async (req, res, jwtSecret) => {
  const { username, password, email } = req.body;  // Also destructure email here

  try {
    const userExists = await User.findOne({ email });  // Check if user already exists using email too

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword,
      email  // Include email when creating the new User
    });

    const user = await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: (30 * 24 * 60 * 60) - 300, // 30 days in seconds minus 5 minutes buffer
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email  // Also include email in the response
      },
      token, // Include the token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendResetPasswordEmail = async (req, res, jwtSecret) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: '60d'
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.username,
      subject: 'Reset Password',
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset password email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
  };
  
  const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Received token:', token); // Add this line


  if (!token) {
  return res.status(401).send({ message: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) {
  return res.status(401).send({ message: 'Unauthorized!' });
  }
  console.log('Decoded token:', decoded); // Add this line

  req.userId = decoded.id;
  next();
  });
  };
  const refreshToken = async (req, res, jwtSecret) => {
    const { token } = req.body;
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
  
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const newToken = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: (30 * 24 * 60 * 60) - 300, // 30 days in seconds minus 5 minutes buffer
      });
  
      res.status(200).json({ token: newToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = {
    signup,
    login,
    sendResetPasswordEmail,
    verifyToken,
    refreshToken,
};
