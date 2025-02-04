import { Box } from '@mui/material';
import { Map, MapProps, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PropsWithChildren } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapboxMapContainer(props: PropsWithChildren<MapProps>) {
  const { children, ...restProps } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* @ts-ignore */}
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        {...restProps}>
        <NavigationControl />
        {children}
      </Map>
    </Box>
  );
}
