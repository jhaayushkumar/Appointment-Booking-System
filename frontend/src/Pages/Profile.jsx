import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../main';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Button, 
  CircularProgress,
  Alert
} from '@mui/material';     
import { Person as PersonIcon } from '@mui/icons-material';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/auth/${role}/me`);
        
        // Handle both response formats: { patient: {...} } and { doctor: {...} }
        let userData = response.data[role] || response.data;
        
        // If we still don't have user data, try to get it from the first key
        if (!userData && typeof response.data === 'object') {
          const firstKey = Object.keys(response.data)[0];
          userData = response.data[firstKey];
        }
        
        setUser(userData);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
        // Redirect to login if not authenticated
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, role]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              bgcolor: 'secondary.main',
              fontSize: '2rem'
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1">
              {user.role === 'doctor' ? `Dr. ${user.name}` : user.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {user.email}
            </Typography>
            {user.role === 'doctor' && user.specialization && (
              <Typography variant="body1" color="primary">
                {user.specialization}
              </Typography>
            )}
          </Box>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Profile Information</Typography>
          <Box component="dl" sx={{ 
            '& > div': { 
              display: 'flex', 
              mb: 2,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none'
              }
            } 
          }}>
            {/* Name */}
            <div>
              <Typography component="dt" sx={{ minWidth: 150, color: 'text.secondary', fontWeight: 'medium' }}>Name:</Typography>
              <Typography component="dd">{user.name || 'Not provided'}</Typography>
            </div>
            
            {/* Email */}
            <div>
              <Typography component="dt" sx={{ minWidth: 150, color: 'text.secondary', fontWeight: 'medium' }}>Email:</Typography>
              <Typography component="dd">{user.email || 'Not provided'}</Typography>
            </div>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;;