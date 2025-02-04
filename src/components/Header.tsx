import { Box, Button, Grid2 } from '@mui/material';
import Logo from './customIcons/Logo';
import { Link } from 'react-router';

export default function Header() {
  return (
    <Grid2
      container
      p={2}
      wrap='nowrap'
      alignItems={'center'}
      justifyContent={'space-between'}
      width={'100%'}>
      <Box
        component={Link}
        to={'/'}
        sx={{
          '&:hover': {
            cursor: 'pointer',
          },
        }}>
        <Logo />
      </Box>
      <Nav />
    </Grid2>
  );
}

const pages = ['projects', 'catalogue'];

function Nav() {
  return (
    <Box>
      {pages.map((d) => (
        <Button
          key={d}
          component={Link}
          to={d}>
          {d}
        </Button>
      ))}
    </Box>
  );
}
