import { Box, SxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

interface SlidePanelProps {
  boxProps?: SxProps;
}

export default function SlidePanel(props: PropsWithChildren<SlidePanelProps>) {
  return (
    <Box
      minWidth={350}
      height={'100%'}
      sx={props.boxProps}>
      {props.children}
    </Box>
  );
}
