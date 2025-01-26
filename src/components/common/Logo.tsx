import { Box, Grid2 } from '@mui/material';

export default function Logo() {
  return (
    <Grid2
      container
      width={(theme) => theme.spacing(16)}
      height={60}>
      <Box
        width={20}
        height={'33%'}
        bgcolor={'black'}
        alignSelf={'self-start'}></Box>
      <Box
        flexGrow={1}
        height={'33%'}
        bgcolor={'black'}
        alignSelf={'center'}></Box>
      <Box
        width={20}
        height={'33%'}
        bgcolor={'black'}
        alignSelf={'self-end'}></Box>
    </Grid2>
  );
}
