import { Link } from 'react-router';
import PageContainer from '../../components/common/PageContainer';
import { Button, Grid2, Typography } from '@mui/material';
import ContactBox from '../../components/common/ContactBox';

export default function Home() {
  return (
    <PageContainer>
      <Grid2
        container
        direction={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{ width: '100%', height: '100%' }}>
        <Typography
          variant={'h6'}
          sx={{ textTransform: 'uppercase' }}>
          Looking for data visualisation solution
        </Typography>
        <Button
          variant={'contained'}
          component={Link}
          to='projects'>
          Start Here
        </Button>
        <ContactBox />
      </Grid2>
    </PageContainer>
  );
}
