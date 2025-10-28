import React from "react";

import { Box, Typography, Button, Card, CardContent, Grid, Container } from "@mui/material";


const Patients = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Welcome to your Patient Portal!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Information
              </Typography>
              <Typography>
                You are successfully logged in as a Patient
              </Typography>
              <Typography>
                Access your medical records and appointments here
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
              >
                Book Appointment
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
              >
                View Appointments
              </Button>
              <Button variant="outlined" color="primary" fullWidth>
                Medical History
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Patients;
