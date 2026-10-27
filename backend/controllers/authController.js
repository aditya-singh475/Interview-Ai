const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryStore = require('../config/inMemoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'interviewai_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let existingUser = null;
    if (isDbConnected()) {
      try {
        existingUser = await User.findOne({ email });
      } catch (e) {
        existingUser = inMemoryStore.getUserByEmail(email);
      }
    } else {
      existingUser = inMemoryStore.getUserByEmail(email);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      targetRole: targetRole || 'Full Stack Developer',
      experienceLevel: experienceLevel || 'Intermediate',
      preferredPersonality: 'Professional',
      theme: 'dark',
      createdAt: new Date()
    };

    if (isDbConnected()) {
      try {
        const created = await User.create(newUser);
        newUser._id = created._id.toString();
      } catch (e) {
        console.warn('[Auth Controller DB Warning]: Using in-memory fallback store');
      }
    }

    // Always maintain in-memory record for fast access
    inMemoryStore.createUser(newUser);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      targetRole: newUser.targetRole,
      experienceLevel: newUser.experienceLevel,
      token: generateToken(newUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let user = null;
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: cleanEmail });
      } catch (e) {
        user = inMemoryStore.getUserByEmail(cleanEmail);
      }
    }

    if (!user) {
      user = inMemoryStore.getUserByEmail(cleanEmail);
    }

    // Support Demo credentials (demo1234 or password123)
    const isDemoEmail = cleanEmail === 'demo@interviewai.com';
    const isDemoPass = password === 'demo1234' || password === 'password123';

    if (isDemoEmail && isDemoPass) {
      if (!user) user = inMemoryStore.getUserByEmail('demo@interviewai.com');
      return res.json({
        _id: user ? user._id : 'usr_demo_123',
        name: user ? user.name : 'Demo Candidate',
        email: 'demo@interviewai.com',
        targetRole: user ? user.targetRole : 'Full Stack Developer',
        token: generateToken(user ? user._id : 'usr_demo_123')
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let isMatch = false;
    if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }
    if (!isMatch && user.secondaryHash) {
      isMatch = await bcrypt.compare(password, user.secondaryHash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole || 'Full Stack Developer',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = null;

    if (isDbConnected()) {
      try {
        user = await User.findById(userId).select('-passwordHash');
      } catch (e) {
        user = inMemoryStore.getUserById(userId);
      }
    }

    if (!user) {
      user = inMemoryStore.getUserById(userId);
    }

    if (!user) {
      user = {
        _id: userId,
        name: 'Demo Candidate',
        email: 'candidate@interviewai.com',
        targetRole: 'Full Stack Developer',
        experienceLevel: 'Intermediate',
        preferredPersonality: 'Professional'
      };
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole || 'Full Stack Developer',
      experienceLevel: user.experienceLevel || 'Intermediate',
      preferredPersonality: user.preferredPersonality || 'Professional'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
