import { Outlet } from 'react-router';
import Header from '../components/Header';
import { Grid2 } from '@mui/material';

export default function Layout() {
  return (
    <Grid2
      container
      wrap='nowrap'
      direction={'column'}
      sx={{
        width: '100vw',
        height: '100vh',
      }}>
      <Header />
      <Outlet />
    </Grid2>
  );
}
