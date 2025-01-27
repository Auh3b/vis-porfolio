import { Box, Button, Grid2 } from '@mui/material';
import Logo from './common/Logo';
import { Link } from 'react-router';

export default function Header() {
  return (
    <Grid2
      container
      p={2}
      wrap='nowrap'
      justifyContent={'space-between'}
      width={'100%'}>
      <Logo />
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
