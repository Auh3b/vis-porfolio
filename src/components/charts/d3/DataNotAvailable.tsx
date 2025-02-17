import { Box, Typography } from '@mui/material';

export default function DataNotAvailable() {
  return (
    <Box
      width={'100%'}
      height={'100%'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Typography variant='caption'>No Data Available</Typography>
    </Box>
  );
}
