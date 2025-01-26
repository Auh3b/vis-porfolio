import { Box, Grid2 } from '@mui/material';
import Logo from './common/Logo';
import { useLocation } from 'react-router';

export default function Header() {
  const { pathname } = useLocation();
  const alignSelf = pathname === '/' ? 'center' : 'start';
  return (
    <Grid2
      container
      direction={'column'}
      p={2}
      width={'100%'}>
      <Box sx={{ alignSelf }}>
        <Logo />
      </Box>
    </Grid2>
  );
}
