import { Box, Grid2, Paper, Typography } from '@mui/material';
import MapboxMapContainer from '../../components/map/mapbox/MapboxMapContainer';
import { AttributionControl, Layer, LayerProps, Source } from 'react-map-gl';
import { PropsWithChildren, useEffect, useState } from 'react';
import { blue } from '@mui/material/colors';
import { MapMouseEvent } from 'mapbox-gl';

export default function SimpleMapDemo() {
  const [coord, setCoord] = useState<null | number[]>(null);
  const [name, setName] = useState('');
  const moveHandler = (e: MapMouseEvent) => {
    if (e.features && e.features?.length) {
      setCoord(Object.values(e.point));
      setName(e.features[0].properties.nameshort || '');
    } else {
      setCoord(null);
    }
  };
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid2
        container
        wrap='nowrap'
        direction={'column'}
        width={'100%'}
        height={'100%'}>
        <Typography mb={2}>Simple Map</Typography>
        <MapboxMapContainer
          attributionControl={false}
          interactiveLayerIds={['circle-fill-layer']}
          onMouseMove={moveHandler}
          mapStyle={'mapbox://styles/robertchiko/cl9la8m2h002j14qd610lf66k'}>
          <AttributionControl customAttribution={'WFP'} />
          {coord && (
            <HoverInfo
              name={name}
              coords={coord}
            />
          )}
          <PointSource>
            <CircleFillLayer />
          </PointSource>
        </MapboxMapContainer>
      </Grid2>
    </Box>
  );
}

function HoverInfo(props: { coords: number[]; name: string }) {
  const {
    name,
    coords: [x, y],
  } = props;
  return (
    <Box
      position={'absolute'}
      sx={{ transform: `translate(${x + 10}px, ${y + 10}px)` }}>
      <Paper sx={{ p: 1 }}>{name} ✈️</Paper>
    </Box>
  );
}

const circleFill: LayerProps = {
  id: 'circle-fill-layer',
  type: 'circle',
  source: 'airports',
  paint: {
    'circle-radius': 6,
    'circle-color': blue[600],
    'circle-opacity': 0.5,
    'circle-stroke-width': 1,
  },
};

function CircleFillLayer() {
  return <Layer {...circleFill} />;
}

function PointSource(props: PropsWithChildren) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/global_airports.geojson')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <Source
      id='airports'
      type='geojson'
      data={data}>
      {props.children}
    </Source>
  );
}
