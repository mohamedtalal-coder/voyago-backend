const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Validation helpers

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required', errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  const weakPasswords = [
    'password', 'password123', '12345678', 'qwerty123', 'letmein',
    'welcome', 'admin123', 'abc12345', 'password1', '123456789'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger one');
  }
  
  return {
    isValid: errors.length === 0,
    error: errors[0] || null,
    errors
  };
};

const validateName = (name, fieldName = 'Name') => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }
  
  const nameRegex = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }
  
  if (/(.)\1{3,}/.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} contains invalid repeated characters` };
  }
  
  return { isValid: true, error: null };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Route handlers

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate all fields
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ 
        message: nameValidation.error,
        field: 'name'
      });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        message: emailValidation.error,
        field: 'email'
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: passwordValidation.error,
        errors: passwordValidation.errors,
        field: 'password'
      });
    }

    // Sanitize and normalize inputs
    const sanitizedName = sanitizeInput(name.trim());
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ 
        message: "An account with this email already exists.",
        field: 'email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12); // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: sanitizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "An account with this email already exists.",
        field: 'email'
      });
    }
    
    res.status(500).json({ message: "Server error during registration." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        message: emailValidation.error,
        field: 'email'
      });
    }

    // Basic password validation (not full strength check for login)
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ 
        message: "Password is required.",
        field: 'password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters.",
        field: 'password'
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    // Check if the user exists AND if the password is correct
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      // Success: Send back user data and a new token
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else if (user && user.googleId && !user.password) {
      // User exists but registered with Google
      res.status(401).json({ 
        message: "This account was created with Google. Please sign in with Google.",
        field: 'email'
      });
    } else {
      // Failure: User not found or password incorrect
      // Use generic message to prevent user enumeration
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized." });
    }
    
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const { name, avatar } = req.body;
    const updates = {};

    // Validate and add name if provided
    if (name !== undefined) {
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        return res.status(400).json({ 
          message: nameValidation.error,
          field: 'name'
        });
      }
      updates.name = sanitizeInput(name.trim());
    }

    // Add avatar if provided (can be empty string to remove)
    if (avatar !== undefined) {
      // Avatar can be a base64 string or empty to remove
      updates.avatar = avatar || null;
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error during profile update." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  generateToken,
};
