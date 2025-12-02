import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getDoctorPatients } from "../api/doctor.api";

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getDoctorPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Typography>Loading patients...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Patients
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id} hover>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone || "N/A"}</TableCell>
                  <TableCell>
                    {patient.lastVisit
                      ? new Date(patient.lastVisit).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={patient.status || "Active"}
                      color={
                        patient.status === "Active" ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorPatients;
