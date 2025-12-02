import React from "react";
import { Box, Container, Typography, Stack, Link, Divider } from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from "@mui/icons-material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        mt: "auto",
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2}>
          {/* Main Footer Content */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            {/* About Section */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Clinic App
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Your trusted healthcare partner
              </Typography>
            </Box>

            {/* Quick Links */}
            <Stack direction="row" spacing={2}>
              <Link href="/patient/doctors" color="inherit" underline="hover" variant="body2">
                Find Doctors
              </Link>
              <Link href="/patient/appointments" color="inherit" underline="hover" variant="body2">
                Appointments
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">
                Help
              </Link>
            </Stack>

            {/* Contact & Social */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={0.5}>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  color="inherit"
                  sx={{ "&:hover": { opacity: 0.7 } }}
                >
                  <Facebook fontSize="small" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  color="inherit"
                  sx={{ "&:hover": { opacity: 0.7 } }}
                >
                  <Twitter fontSize="small" />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  color="inherit"
                  sx={{ "&:hover": { opacity: 0.7 } }}
                >
                  <Instagram fontSize="small" />
                </Link>
              </Stack>
            </Stack>
          </Stack>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

          {/* Bottom Footer */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              © {currentYear} Clinic App. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="#" color="inherit" underline="hover" variant="caption">
                Privacy
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="caption">
                Terms
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
