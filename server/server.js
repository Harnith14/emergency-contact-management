
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors({ origin: "http://localhost:5177" }));
app.use(express.json());

const Contact = mongoose.model("Contact", new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, default: "Family" }
}));

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: { type: String, required: true }
  })
);

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      message: "Registration failed"
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Login failed"
    });
  }
});

app.get("/", (req, res) => {
  res.send("Emergency Contact Management API is running!");
});

app.get("/api/contacts", async (req, res) => {
  try {
    res.json(await Contact.find());
  } catch {
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/api/contacts", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch {
    res.status(400).json({ message: "Could not save contact" });
  }
});

app.put("/api/contacts/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        relationship: req.body.relationship
      },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    console.error("Update contact error:", error);
    res.status(500).json({ message: "Could not update contact" });
  }
});

app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch {
    res.status(400).json({ message: "Could not delete contact" });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log("Backend running on http://localhost:5000");
    });
  })
  .catch(err => console.error("MongoDB connection failed:", err.message));
