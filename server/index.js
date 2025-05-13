const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/student.model");
const User = require("./models/user.model");

mongoose.connect("mongodb://localhost:27017/StudentInformationSystem")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
const port = 1337;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions));

// Logging function
function logStudentData(action, student) {
    console.log(`${action} Student:`);
    Object.entries(student).forEach(([key, value]) =>
        console.log(`  ${key}: ${value}`)
    );
    console.log();
}

// ---------------------- Student Routes ----------------------
app.get("/fetchstudentsmongo", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

app.post("/addstudentmongo", async (req, res) => {
    try {
        const { idnumber, firstname, lastname, middlename, course, year } = req.body;
        const newStudent = new Student({ idnumber, firstname, lastname, middlename, course, year });
        await newStudent.save();
        res.status(201).json({ message: "Student added successfully", student: newStudent });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "Error adding student" });
    }
});

app.put("/updatestudentmongo/:idnumber", async (req, res) => {
    try {
        const { idnumber } = req.params;
        const { firstname, lastname, middlename, course, year } = req.body;
        const updatedStudent = await Student.findOneAndUpdate(
            { idnumber },
            { firstname, lastname, middlename, course, year },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Error updating student" });
    }
});

app.delete("/deletestudentmongo/:idnumber", async (req, res) => {
    try {
        const { idnumber } = req.params;
        const deletedStudent = await Student.findOneAndDelete({ idnumber });
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });

        logStudentData("Deleted", deletedStudent);
        res.json({ message: "Student deleted successfully", student: deletedStudent });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Error deleting student" });
    }
});

// ---------------------- User Routes (MongoDB) ----------------------
app.get("/fetchusers", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

app.post("/adduser", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Error adding user" });
    }
});

app.put("/updateuser/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});

app.delete("/deleteuser/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// ---------------------- Auth Routes ----------------------
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (user) {
            res.json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { email, password, firstname, lastname, middlename, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const newUser = new User({
            email,
            password,
            firstname,
            lastname,
            middlename,
            role: role || "user"
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

// ---------------------- Health Check ----------------------
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
    res.send("User Management API");
});

// ---------------------- Global Error Handler ----------------------
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ 
        success: false, 
        message: "Internal server error", 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// ---------------------- Start Server ----------------------
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
