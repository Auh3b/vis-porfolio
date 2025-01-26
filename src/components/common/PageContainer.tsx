import { Box, SxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

interface PageContainerProps {
  boxProps?: SxProps;
}

export default function PageContainer(
  props: PropsWithChildren<PageContainerProps>,
) {
  const { boxProps, children } = props;
  return (
    <Box
      flexGrow={1}
      sx={boxProps}>
      {children}
    </Box>
  );
}
