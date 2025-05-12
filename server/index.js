const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Student = require("./student.model");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/StudentInformationSystem");

const app = express();
app.use(cors());
app.use(express.json());

const port = 1337;
const userFile = path.join(__dirname, "user.json");

let students = [];

function logStudentData(action, student) {
    console.log(`${action} Student:`);
    Object.entries(student).forEach(([key, value]) => console.log(`  ${key}: ${value}`));
    console.log();
}

app.get("/", (req, res) => {
    res.send("User Management API");
});

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
        return res.status(201).json({ message: "Student added successfully", student: newStudent });
    } catch (error) {
        console.error("Error adding student:", error);
        return res.status(500).json({ message: "Error adding student" });
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
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

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

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        logStudentData("Deleted", deletedStudent);
        res.json({ message: "Student deleted successfully", student: deletedStudent });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Error deleting student" });
    }
});

// User Management
function loadUsers() {
    try {
        return fs.existsSync(userFile) ? JSON.parse(fs.readFileSync(userFile)) : [];
    } catch (error) {
        console.error("Error reading user data:", error);
        return [];
    }
}

function saveUsers(data) {
    try {
        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

app.get("/fetchusers", (req, res) => {
    const users = loadUsers();
    res.json(users);
});

app.post("/adduser", (req, res) => {
    const users = loadUsers();
    const newUser = { ...req.body };

    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});

app.put("/updateuser/:id", (req, res) => {
    const users = loadUsers();
    const index = users.findIndex(user => user.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users[index] = { ...users[index], ...req.body };
    saveUsers(users);
    res.json(users[index]);
});

app.delete("/deleteuser/:id", (req, res) => {
    let users = loadUsers();
    const index = users.findIndex(user => user.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users.splice(index, 1);
    saveUsers(users);
    res.json({ message: "User deleted successfully" });
});

app.use(express.json());

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const users = loadUsers();

    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
