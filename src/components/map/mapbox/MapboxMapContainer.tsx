import 'mapbox-gl/dist/mapbox-gl.css';
import { MutableRefObject, PropsWithChildren } from 'react';
import { Map, MapProps, MapRef } from 'react-map-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapboxMapContainerProps {
  className?: string;
  mapRef?: MutableRefObject<MapRef>;
}

export default function MapboxMapContainer(
  props: PropsWithChildren<MapProps & MapboxMapContainerProps>,
) {
  const { children, mapRef, className, ...restProps } = props;
  return (
    <div className={`w-full h-full ${className}`}>
      {/* @ts-ignore */}
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        {...restProps}>
        {/* <NavigationControl /> */}
        {children}
      </Map>
    </div>
  );
}
