import { Button, Grid2, Paper, TextField, Typography } from '@mui/material';

export default function ContactBox() {
  return (
    <Paper
      sx={{ p: 2, my: 4 }}
      variant={'outlined'}>
      <Typography
        mb={2}
        textAlign={'center'}>
        Contact
      </Typography>
      <Grid2 container>
        <TextField
          label='email'
          type='email'
          size='small'
        />
        <Button variant='outlined'>Send Mail</Button>
      </Grid2>
    </Paper>
  );
}
