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
  Avatar,
  Stack,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Search, Person, Email, Phone, CalendarMonth } from "@mui/icons-material";
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            My Patients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your patient list
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* Stats */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary">
              {patients.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Patients
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {filteredPatients.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search Results
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : filteredPatients.length > 0 ? (
        <Grid container spacing={3}>
          {filteredPatients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 56,
                        height: 56,
                      }}
                    >
                      {patient.name?.charAt(0) || "P"}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {patient.name}
                      </Typography>
                      <Chip
                        label={patient.gender || "N/A"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Stack>

                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {patient.email}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {patient.phone || "N/A"}
                      </Typography>
                    </Stack>
                    {patient.age && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Age: {patient.age} years
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "background.default",
          }}
        >
          <Person sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={600}>
            No Patients Found
          </Typography>
          <Typography color="text.secondary">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No patients have booked appointments yet"}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DoctorPatients;
