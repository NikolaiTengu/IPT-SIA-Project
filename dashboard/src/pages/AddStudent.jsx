import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "./Sidebar";
import "./AddStudent.css";
import { Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";

function AddStudent() {
  const [student, setStud] = useState([]);
  const [openModalAdd, setModalOpenAdd] = useState(false); 
  const closeModalAdd = () => setModalOpenAdd(false);

  const [openModalEdit, setModalOpenEdit] = useState(false);
  const closeModalEdit = () => setModalOpenEdit(false);

  const [openModalDelete, setModalOpenDelete] = useState(false);
  const closeModalDelete = () => setModalOpenDelete(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const idnumRef = useRef();
  const fnRef = useRef();
  const mnRef = useRef();
  const lnRef = useRef();
  const courseRef = useRef();
  const yearRef = useRef();

  const [editFormData, setEditFormData] = useState({
    idnumber: "",
    firstname: "",
    middlename: "",
    lastname: "",
    course: "",
    year: ""
  });

  useEffect(() => {
    fetchStudent();
  }, []);

  async function handleAddStudent() {

    const newStudent = ({
      idnumber: idnumRef.current.value,
      firstname: fnRef.current.value,
      middlename: mnRef.current.value || "",
      lastname: lnRef.current.value,
      course: courseRef.current.value || "",
      year: yearRef.current.value || "",
    });
    
    try {
      await axios.post("http://localhost:1337/addstudentmongo", newStudent);
      fetchStudent();
      resetForm();
      closeModalAdd();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  }

  const resetForm = () => {
    [idnumRef, fnRef, mnRef, lnRef, courseRef, yearRef].forEach(ref => {
      if (ref.current) ref.current.value = "";
    });
  };

  async function fetchStudent() {
    try {
      const response = await axios.get("http://localhost:1337/fetchstudentsmongo");
      setStud(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }

  const handleOpenDeleteModal = (student) => {
    setSelectedStudent(student);
    setModalOpenDelete(true);
  };

  async function handleDeleteStudent() {
    if (!selectedStudent) return;
    
    try {
      await axios.delete(`http://localhost:1337/deletestudentmongo/${selectedStudent.idnumber}`);
      fetchStudent();
      closeModalDelete();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      idnumber: student.idnumber,
      firstname: student.firstname,
      middlename: student.middlename || "",
      lastname: student.lastname,
      course: student.course || "",
      year: student.year || ""
    });
    setModalOpenEdit(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  async function handleEditStudent() {
    try {
      await axios.put(
        (`http://localhost:1337/updatestudentmongo/${selectedStudent.idnumber}`), 
        editFormData
      );
      
      fetchStudent();
      closeModalEdit();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  }

  return (
    <div className="add-student-container">
      <Sidebar />
       <main className="content">

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: 'center', marginTop: '40px', marginBottom: '20px' }}>
              <Typography variant="h4">Student List</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setModalOpenAdd(true)}
              >
                Add Student
              </Button>
            </div>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>First Name</strong></TableCell>
                    <TableCell><strong>Middle Name</strong></TableCell>
                    <TableCell><strong>Last Name</strong></TableCell>
                    <TableCell><strong>Course</strong></TableCell>
                    <TableCell><strong>Year</strong></TableCell>
                    <TableCell><strong>Setting</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {student.length > 0 ? (
                    student.map((stud) => (
                      <TableRow key={stud.idnumber}>
                        <TableCell>{stud.idnumber}</TableCell>
                        <TableCell>{stud.firstname}</TableCell>
                        <TableCell>{stud.middlename}</TableCell>
                        <TableCell>{stud.lastname}</TableCell>
                        <TableCell>{stud.course}</TableCell>
                        <TableCell>{stud.year}</TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            aria-label="edit student"
                            onClick={() => handleOpenEditModal(stud)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            aria-label="delete student"
                            onClick={() => handleOpenDeleteModal(stud)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No Products found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
      
        
        {/* Add Student Modal */}
        <Dialog 
          open={openModalAdd} onClose={closeModalAdd} maxWidth="sm" fullWidth
        >
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <TextField 
              inputRef={idnumRef} 
              label="ID Number" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
            />
            
            <TextField 
              inputRef={fnRef} 
              label="First Name" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
            />
            
            <TextField 
              inputRef={mnRef} 
              label="Middle Name" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
            />
            
            <TextField 
              inputRef={lnRef} 
              label="Last Name" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
            />
            
            <TextField 
              inputRef={courseRef} 
              label="Course" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
            />
            
            <TextField 
              inputRef={yearRef} 
              label="Year" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModalAdd} color="secondary">
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleAddStudent} 
            >
              Add Student
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Student Modal */}
        <Dialog open={openModalEdit} onClose={closeModalEdit} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent>
            <TextField 
              name="idnumber"
              label="ID Number" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
              value={editFormData.idnumber}
              onChange={handleEditInputChange}
              disabled
            />
            
            <TextField 
              name="firstname"
              label="First Name" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
              value={editFormData.firstname}
              onChange={handleEditInputChange}
            />
            
            <TextField 
              name="middlename"
              label="Middle Name" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              value={editFormData.middlename}
              onChange={handleEditInputChange}
            />
            
            <TextField 
              name="lastname"
              label="Last Name" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              required
              value={editFormData.lastname}
              onChange={handleEditInputChange}
            />
            
            <TextField 
              name="course"
              label="Course" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              value={editFormData.course}
              onChange={handleEditInputChange}
            />
            
            <TextField 
              name="year"
              label="Year" 
              variant="outlined" 
              margin="normal" 
              fullWidth
              value={editFormData.year}
              onChange={handleEditInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModalEdit} color="error">
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={handleEditStudent} 
            >
              Update Student
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Student Modal */}
        <Dialog open={openModalDelete} onClose={closeModalDelete} maxWidth="sm" fullWidth>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this student ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModalDelete} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeleteStudent} variant='contained' color='error'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}

export default AddStudent;