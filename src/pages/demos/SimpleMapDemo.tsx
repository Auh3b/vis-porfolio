import { Box, Grid2, Paper, Typography } from '@mui/material';
import MapboxMapContainer from '../../components/map/mapbox/MapboxMapContainer';
import {
  AttributionControl,
  Layer,
  LayerProps,
  Source,
  MapMouseEvent,
  MapRef,
} from 'react-map-gl';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { blue } from '@mui/material/colors';

const LAYERS = {
  CLUSTER_LAYER: 'cluster-layer',
  LANDING_LAYER: 'landing-layer',
};

export default function SimpleMapDemo() {
  const mapRef = useRef<MapRef | undefined>();
  const [cursor, setCursor] = useState('');
  const [coord, setCoord] = useState<null | number[]>(null);
  const [name, setName] = useState('');
  const moveHandler = (e: MapMouseEvent) => {
    if (!e.features?.length) return setCoord(null);
    const feature = e.features[0];
    const layerId = feature.layer?.id;
    if (layerId !== LAYERS.LANDING_LAYER) return;
    setCoord(Object.values(e.point));
    setName(feature.properties?.nameshort || '');
  };
  const handleEnter = () => {
    setCursor('pointer');
  };
  const handleLeave = () => {
    setCursor('');
  };
  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      if (!e.features?.length) return;
      const layerId = e.features[0].layer?.id;
      if (layerId !== LAYERS.CLUSTER_LAYER) return;
      const { lat, lng } = e.lngLat;
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: mapRef.current.getZoom() + 1,
      });
    },
    [mapRef.current],
  );
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid2
        container
        wrap='nowrap'
        direction={'column'}
        width={'100%'}
        height={'100%'}>
        <Typography mb={2}>WFP Landing Sites | Simple Map Demo</Typography>
        <MapboxMapContainer
          // @ts-ignore
          mapRef={mapRef}
          cursor={cursor}
          attributionControl={false}
          interactiveLayerIds={Object.values(LAYERS)}
          onClick={handleClick}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
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
  id: LAYERS.LANDING_LAYER,
  type: 'circle',
  source: 'airports',
  filter: ['!has', 'point_count'],
  paint: {
    'circle-radius': 10,
    'circle-color': blue[600],
    'circle-opacity': 0.5,
    'circle-stroke-width': 1,
  },
};

const clusterFill: LayerProps = {
  id: LAYERS.CLUSTER_LAYER,
  type: 'circle',
  filter: ['has', 'point_count'],
  source: 'airports',
  paint: {
    'circle-color': blue[600],
    'circle-stroke-color': blue[600],
    'circle-opacity': 0.5,
    'circle-stroke-width': 2,
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      10,
      5,
      15,
      20,
      30,
      50,
      40,
    ],
  },
};
const clusterText: LayerProps = {
  id: 'cluster-text-layer',
  type: 'symbol',
  filter: ['has', 'point_count'],
  source: 'airports',
  layout: {
    'text-field': ['get', 'point_count'],
    'text-anchor': 'center',
    'text-size': ['step', ['get', 'point_count'], 16, 10, 18, 20, 24, 50, 32],
  },
  paint: {
    'text-color': 'white',
  },
};

function CircleFillLayer() {
  return (
    <>
      <Layer {...circleFill} />;
      <Layer {...clusterFill} />;
      <Layer {...clusterText} />;
    </>
  );
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
      data={data}
      cluster={true}
      clusterMaxZoom={10}>
      {props.children}
    </Source>
  );
}
