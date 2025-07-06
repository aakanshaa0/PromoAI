import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../main';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function RedditCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      login(token);
      navigate('/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [location, login, navigate]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress color="primary" />
    </Box>
  );
} 