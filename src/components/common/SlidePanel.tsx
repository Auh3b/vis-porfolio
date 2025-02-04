import { Box, Button, Collapse, SxProps, useMediaQuery } from '@mui/material';
import { Fragment, PropsWithChildren, useState } from 'react';
import DotArrow, { DownDotArrow } from '../customIcons/DotArrow';

interface SlidePanelProps {
  boxProps?: SxProps;
}

export default function SlidePanel(props: PropsWithChildren<SlidePanelProps>) {
  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  return <Fragment>{lg ? <Desktop /> : <Mobile />}</Fragment>;
}

function Desktop(props: PropsWithChildren<SlidePanelProps>) {
  return (
    <Box
      minWidth={350}
      height={'100%'}
      sx={{ px: 2, ...props.boxProps }}>
      {props.children}
    </Box>
  );
}

function Mobile(props: PropsWithChildren<SlidePanelProps>) {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Button
        sx={{
          width: '100%',
          height: 'fit-content',
          justifyContent: 'start',
          borderTop: '1px solid',
          borderBottom: '1px solid',
        }}
        onClick={() => setOpen((prev) => !prev)}
        startIcon={open ? <DownDotArrow /> : <DotArrow />}>
        Menu
      </Button>
      <Collapse in={open}>dsadsa{props.children}</Collapse>
    </Fragment>
  );
}
