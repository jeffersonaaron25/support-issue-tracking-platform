import { styled, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Chart from './Chart';
import Tickets from './Tickets';
import OpenCount from './OpenCount';
import theme from './theme';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../actions/Auth';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        MentiumCodeChallenge
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const AppBar = styled(MuiAppBar, {})<MuiAppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));


export default function Dashboard() {
  const {logout, verifyAuth} = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
        const status = await verifyAuth();
        if (!status) window.location.reload();
      };
    
    checkAuth();
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar
            sx={{
              pr: '24px',
              background: 'linear-gradient(45deg, #6b3d94 30%, #e4a7c9 90%)',
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, color: 'white'}}
            >
              Dashboard | MentiumCodeChallenge | Issue Tracking System
            </Typography>
            {/* logout */}
            <Typography color="inherit" variant="h6" component="h1" sx={{ cursor: 'pointer', flexGrow: 1, textAlign: 'right', color: 'white'}}
            onClick={logout}>
              <b>Logout</b>
            </Typography>

          </Toolbar>
        </AppBar>
        
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.background.default,
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                  style={{background: 'linear-gradient(45deg, rgba(107, 61, 148, 0.1) 30%, rgba(228, 167, 201, 0.1) 90%)'}}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Open Tickets Count */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                  style={{background: 'linear-gradient(45deg, rgba(107, 61, 148, 0.1) 30%, rgba(228, 167, 201, 0.1) 90%)'}}
                >
                  <OpenCount />
                </Paper>
              </Grid>
              {/* Tickets */}
              <Grid item xs={12}>
                <Paper 
                sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                style={{background: 'linear-gradient(45deg, rgba(107, 61, 148, 0.1) 30%, rgba(228, 167, 201, 0.1) 90%)'}}
                >
                  <Tickets />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}