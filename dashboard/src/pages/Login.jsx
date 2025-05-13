import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  async function handleLoginBtn() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1337/login", { email, password });
      if (response.data.success) {
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  }

  async function handleSignupSubmit() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (signupData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1337/signup", signupData);
      if (response.data.success) {
        setSignupModalOpen(false);
        navigate("/dashboard");
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="loginPage">
      <div className="ring">
        <i></i>
        <i></i>
        <i></i>
      </div>

      <div className="login">
        <h1>Login</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <input
          className="inputText"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="inputText"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
          }
          label="Show Password"
        />

        <div className="actionButtons">
          <Button variant="contained" onClick={handleLoginBtn}>Signin</Button>
          <Button variant="contained" onClick={() => setSignupModalOpen(true)}>Signup</Button>
        </div>
      </div>

      <Dialog open={signupModalOpen} onClose={() => setSignupModalOpen(false)}>
        <DialogTitle>Signup</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            value={signupData.firstname}
            onChange={(e) => setSignupData({ ...signupData, firstname: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={signupData.lastname}
            onChange={(e) => setSignupData({ ...signupData, lastname: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Middle Name"
            fullWidth
            value={signupData.middlename}
            onChange={(e) => setSignupData({ ...signupData, middlename: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type={showSignupPassword ? "text" : "password"}
            fullWidth
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showSignupPassword}
                onChange={(e) => setShowSignupPassword(e.target.checked)}
              />
            }
            label="Show Password"
          />
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              value={signupData.role}
              onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
            >
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="employee" control={<Radio />} label="Employee" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignupModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSignupSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Login;