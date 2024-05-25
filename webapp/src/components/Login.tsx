import { useContext, useEffect } from 'react';
import { AuthContext } from '../actions/Auth';
import { Button } from '@material-ui/core';
import theme from './theme';
import { Typography } from '@mui/material';

function Login() {
  const { getOAuthUrl, verifyAuth} = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
        await verifyAuth();
      };
    checkAuth();
  });

  const handleLogin = () => {
    getOAuthUrl();
  };

  const handleRefresh = () => {
    window.location.reload();
  }

  return (
    <div style={{background: 'linear-gradient(45deg, #6b3d94 30%, #e4a7c9 90%)', height: '100vh'}}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h4" style={{marginBottom: 20}}>
         <b>Mentium Code Challenge</b>
        </Typography>
        {/* Simple auth flow for demonstration purposes */}
        <Button variant="contained" color="primary" onClick={handleLogin} style={{backgroundColor: theme.palette.primary.main, marginTop: 20}}>
        Authorize Email
        </Button>
        <Button variant="contained" color="default" onClick={handleRefresh} style={{marginTop: 20}}>
        Authorized? Go to Dashboard
        </Button>
    </div>
    </div>
  );
}

export default Login;