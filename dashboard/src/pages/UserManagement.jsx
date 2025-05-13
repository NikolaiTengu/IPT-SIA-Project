import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./UserManagement.css";
import {
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const idRef = useRef();
  const fnameRef = useRef();
  const mnameRef = useRef();
  const lnameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();

  const [editFormData, setEditFormData] = useState({
    id: "",
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await axios.get("http://localhost:1337/fetchusers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function handleAddUser() {
    const newUser = {
      id: idRef.current.value,
      fname: fnameRef.current.value,
      mname: mnameRef.current.value,
      lname: lnameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      role: roleRef.current.value,
    };

    try {
      const response = await axios.post("http://localhost:1337/adduser", newUser);
      // If backend returns the created user, use it; otherwise, use newUser
      setUsers((prev) => [...prev, response.data || newUser]);
      resetForm();
      setOpenModalAdd(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async function handleEditUser() {
    if (!selectedUser) return;
    try {
      await axios.put(`http://localhost:1337/updateuser/${selectedUser.id}`, editFormData);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...editFormData } : u))
      );
      setOpenModalEdit(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;
    try {
      await axios.delete(`http://localhost:1337/deleteuser/${selectedUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setOpenModalDelete(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  function resetForm() {
    if (idRef.current) idRef.current.value = "";
    if (fnameRef.current) fnameRef.current.value = "";
    if (mnameRef.current) mnameRef.current.value = "";
    if (lnameRef.current) lnameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
    if (roleRef.current) roleRef.current.value = "";
  }

  function handleOpenEditModal(user) {
    setSelectedUser(user);
    setEditFormData({
      id: user.id,
      fname: user.fname,
      mname: user.mname,
      lname: user.lname,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    setOpenModalEdit(true);
  }

  function handleEditInputChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleOpenDeleteModal(user) {
    setSelectedUser(user);
    setOpenModalDelete(true);
  }

  function handleCloseAddModal() {
    setOpenModalAdd(false);
    resetForm();
  }

  function handleCloseEditModal() {
    setOpenModalEdit(false);
    setSelectedUser(null);
  }

  function handleCloseDeleteModal() {
    setOpenModalDelete(false);
    setSelectedUser(null);
  }

  return (
    <div className="user-management-container">
      <Sidebar />
      <main className="content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginTop: '40px', marginBottom: '20px' }}>
          <Typography variant="h4">User Management</Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenModalAdd(true)}>
            Add User
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>FirstName</strong></TableCell>
                <TableCell><strong>MiddleName</strong></TableCell>
                <TableCell><strong>LastName</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Password</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Settings</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.fname}</TableCell>
                    <TableCell>{user.mname}</TableCell>
                    <TableCell>{user.lname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenEditModal(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteModal(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openModalAdd} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <TextField inputRef={idRef} label="ID" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={fnameRef} label="FirstName" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={mnameRef} label="MiddleName" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={lnameRef} label="LastName" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={emailRef} label="Email" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={passwordRef} label="Password" variant="outlined" margin="normal" fullWidth required />
            <TextField inputRef={roleRef} label="Role" variant="outlined" margin="normal" fullWidth required />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddModal} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddUser}>
              Add User
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openModalEdit} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField name="id" label="ID" variant="outlined" margin="normal" fullWidth value={editFormData.id} disabled />
            <TextField name="fname" label="FirstName" variant="outlined" margin="normal" fullWidth value={editFormData.fname} onChange={handleEditInputChange} />
            <TextField name="mname" label="MiddleName" variant="outlined" margin="normal" fullWidth value={editFormData.mname} onChange={handleEditInputChange} />
            <TextField name="lname" label="LastName" variant="outlined" margin="normal" fullWidth value={editFormData.lname} onChange={handleEditInputChange} />
            <TextField name="email" label="Email" variant="outlined" margin="normal" fullWidth value={editFormData.email} onChange={handleEditInputChange} />
            <TextField name="password" label="Password" variant="outlined" margin="normal" fullWidth value={editFormData.password} onChange={handleEditInputChange}/>
            <TextField name="role" label="Role" variant="outlined" margin="normal" fullWidth value={editFormData.role} onChange={handleEditInputChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal} variant="contained" color="error">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEditUser}>
              Update User
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openModalDelete} onClose={handleCloseDeleteModal} maxWidth="sm" fullWidth>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} variant="contained">
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default UserManagement;
