import React, { useState, useRef, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import assets from "../assets/atlasacademy.jpg";
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { TextField } from "@mui/material";

function Dashboard() {
  const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function zeroPadding(num, digit) {
    return String(num).padStart(digit, "0");
  }

  function updateTime() {
    const now = new Date();

    if (document.getElementById("time") && document.getElementById("date")) {
      document.getElementById("time").innerText =
        zeroPadding(now.getHours(), 2) + ":" +
        zeroPadding(now.getMinutes(), 2) + ":" +
        zeroPadding(now.getSeconds(), 2) + " " +
        week[now.getDay()];

      document.getElementById("date").innerText =
        now.getFullYear() + "/" +
        zeroPadding(now.getMonth() + 1, 2) + "/" +
        zeroPadding(now.getDate(), 2);
    }
  }

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleLogout = () => {
    // Clear user session (example: remove token from localStorage)
    localStorage.removeItem("userToken");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="dash">
      <h1>Welcome to Atlas University!</h1>
      <div className="clock">
        <h2 id="time"></h2>
        <h2 id="date"></h2>
      </div>
      <img src={assets} alt="Rice" className="rice-image" />
      <Sidebar />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;
