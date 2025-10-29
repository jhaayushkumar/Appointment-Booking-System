import React, { useState, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { api } from '../main';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Logout,
  Person,
  LocalHospital,
  CalendarToday
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('userName') || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleProfileClick = () => {
    const role = localStorage.getItem('role');
    if (role) {
      navigate(`/${role}/profile`);
    } else {
      navigate('/login');
    }
  };


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLogout = useCallback(async () => {
    try {
      const role = localStorage.getItem('role');
      if (role) {
        await api.post(`/api/auth/${role}/logout`);
      }
      
      // Show success message first
      setSnackbar({
        open: true,
        message: 'Successfully logged out',
        severity: 'success'
      });
      
      // Wait for the message to be shown to the user
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear local storage and navigate
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      
      // Navigate to login
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      setSnackbar({
        open: true,
        message: 'Error during logout',
        severity: 'error'
      });
    }
  }, [navigate]);

  // Removed menu components as they're no longer needed
  // The profile icon will now directly navigate to the profile page

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            onClick={handleProfileClick}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <LocalHospital />
            HealthCare
          </Typography>

{isMobile ? (
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              onClick={handleProfileClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to={`/${userRole}/dashboard`}
                startIcon={<Dashboard />}
              >
                Dashboard
              </Button>
              
              {userRole === 'patient' && (
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/appointments"
                  startIcon={<CalendarToday />}
                >
                  Appointments
                </Button>
              )}
              
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
              <IconButton
                size="large"
                edge="end"
                aria-label="View profile"
                onClick={handleProfileClick}
                color="inherit"
                sx={{ ml: 1, '&:hover': { bgcolor: 'transparent' } }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'secondary.main',
                    '&:hover': { transform: 'scale(1.05)' } // Subtle hover effect
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Navbar;
