const prisma = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  
  const { name, email, phone, password, age, gender } = req.body;

  try {
    const existingpatient = await prisma.patient.findUnique({
      where: {
        email,
      },
    });

    if (existingpatient) {
      return res.status(409).json({ message: "Patient already exists, please login" });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.patient.create({
      data: {
        name,
        email,
        phone,
        password: hash,
        age,
        gender,
      },
    });
    
    return res.status(201).json({ message: "Patient registered successfully" });
    
  } catch (error) {
    console.error('Patient SignUp Error:', error);
    return res.status(500).json({message: "Something went wrong"});
  }
};

const login = async (req, res) => {
  
  const { email, password } = req.body;

  try {
    const patient = await prisma.patient.findUnique({
      where: {
        email,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found, please sign up" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: patient.id, 
        name: patient.name,
        email: patient.email, 
        role: "patient", 
        isPatient: true 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({ 
      message: "Login successful",
      token: token,
      user: {
        id: patient.id,
        email: patient.email,
        name: patient.name,
        role: "patient"
      }
    });

  } catch (error) {
    console.error('Patient Login Error:', error);
    return res.status(500).json({ message: "Something went wrong"});
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  signUp,
  login,
  logout
};