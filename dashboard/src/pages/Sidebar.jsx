import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="navbar">
      <div className="navbarlink">
        <Link to="/dashboard" className="nav-item">
          <HomeIcon className="icon" /> Home
        </Link>
        <Link to="/addstudent" className="nav-item">
          <InfoIcon className="icon" /> Student Menu
        </Link>
        <Link to="/usermanagement" className="nav-item">
          <ManageAccountsIcon className="icon" /> Employee Management
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
