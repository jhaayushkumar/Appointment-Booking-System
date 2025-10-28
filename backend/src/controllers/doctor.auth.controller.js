const prisma = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { name, email, phone, password, specialization} = req.body;

  try {
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (existingDoctor) {
      return res.status(409).json({ message: "Doctor already exists, please login" });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.doctor.create({
      data: {
        name,
        email,
        phone,
        password: hash,
        ...(specialization ? { specialization } : {})
      },
    });

    return res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error("Doctor SignUp Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found, please sign up" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: doctor.id, name: doctor.name,email: doctor.email, role: "doctor", isDoctor: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({ 
      message: "Login successful",
      token: token,
      user: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        role: "doctor"
      }
    });
  } catch (error) {
    console.error("Doctor Login Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  signUp,
  login,
  logout,
};