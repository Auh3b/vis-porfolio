import { Box, Button, Typography } from '@mui/material';
import { LeftDotArrow } from '../components/customIcons/DotArrow';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography variant='h1'>404</Typography>
      <Button
        component={Link}
        to={'/'}
        startIcon={<LeftDotArrow />}>
        Back To Home
      </Button>
    </Box>
  );
}
