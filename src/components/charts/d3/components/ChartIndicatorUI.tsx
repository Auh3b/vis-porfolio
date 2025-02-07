import { Box, Grid2, Paper, Typography } from '@mui/material';
import { AttributeIndicatorItems } from '../utils/chart.types';
import { format } from 'd3';

export default function ChartIndicatorUI(props: AttributeIndicatorItems) {
  const { x, y, value, label, color } = props;
  return (
    <Box
      sx={{
        zIndex: 1000,
        position: 'absolute',
        width: 200,
        top: y + 'px',
        left: 20 + x + 'px',
      }}>
      <Paper sx={{ px: 1 }}>
        <Grid2
          wrap='nowrap'
          container
          gap={2}
          alignItems={'center'}>
          <Box
            sx={{
              backgroundColor: color,
              width: 10,
              height: 10,
            }}
          />
          <Typography
            noWrap={true}
            sx={{ flexGrow: 1 }}
            variant='overline'>
            {label}
          </Typography>
          <Typography variant='overline'>{format('.2s')(+value)}</Typography>
        </Grid2>
      </Paper>
    </Box>
  );
}
