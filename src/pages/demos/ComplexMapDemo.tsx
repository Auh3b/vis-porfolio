import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import MapboxMapContainer from '../../components/map/mapbox/MapboxMapContainer';
import { Layer, MapMouseEvent, Popup, Source } from 'react-map-gl';
import { ChangeEvent, useEffect, useState } from 'react';
import { deepOrange, deepPurple, grey } from '@mui/material/colors';
import { FeatureCollection } from 'geojson';
import { booleanIntersects, buffer } from '@turf/turf';

interface PopupObject {
  position: number[];
  properties: { [key: string]: any };
}

export default function ComplexMapDemo() {
  const [visibleLayers, setVisibleLayers] = useState<string[]>([
    'railways',
    'ports',
    'states',
  ]);
  const [cursor, setCursor] = useState('');
  const [popup, setPopup] = useState<null | PopupObject>(null);
  const clickHandler = (e: MapMouseEvent) => {
    setPopup({
      position: Object.values(e.lngLat),
      properties: e?.features?.[0].properties || {},
    });
  };
  const handleVisibility = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVisibleLayers((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid2
        container
        width={'100%'}
        height={'100%'}
        direction={'column'}
        wrap='nowrap'>
        <Box>
          <Typography>Complex Map</Typography>
        </Box>
        <MapboxMapContainer
          cursor={cursor}
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={() => setCursor('')}
          onClick={clickHandler}
          interactiveLayerIds={['railway-layer', 'ports-layer', 'states-layer']}
          mapStyle={'mapbox://styles/robertchiko/cl9la8m2h002j14qd610lf66k'}>
          {popup && (
            <CustomPopup
              {...popup}
              onClose={() => setPopup(null)}
            />
          )}
          <PointLayer visibleLayers={visibleLayers} />
          <PolygonLayer visibleLayers={visibleLayers} />
          <LineLayer visibleLayers={visibleLayers} />
          <Legend
            visibleLayers={visibleLayers}
            onVisibilityChange={handleVisibility}
          />
        </MapboxMapContainer>
      </Grid2>
    </Box>
  );
}

function CustomPopup(props: PopupObject & { onClose: () => void }) {
  const {
    position: [x, y],
    properties,
    onClose,
  } = props;

  return (
    <Popup
      closeOnClick
      onClose={onClose}
      closeOnMove
      closeButton={false}
      latitude={y}
      longitude={x}>
      <Paper sx={{ maxHeight: 250, overflowY: 'scroll', overflowX: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(properties).map(([prop, value]) => (
              <TableRow key={prop}>
                <TableCell>{prop}</TableCell>
                <TableCell sx={{ maxWidth: 100, overflowX: 'auto' }}>
                  {value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Popup>
  );
}

interface LayerProps {
  visibleLayers: string[];
}

function PolygonLayer(props: LayerProps) {
  const { visibleLayers } = props;
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces.geojson',
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  return (
    <Source
      id='states-source'
      type='geojson'
      data={data}>
      <Layer
        beforeId='railway-layer'
        id='states-layer'
        source='railway-source'
        type='fill'
        layout={{
          visibility: visibleLayers.includes('states') ? 'visible' : 'none',
        }}
        paint={{ 'fill-color': deepOrange[400], 'fill-opacity': 0.5 }}
      />
    </Source>
  );
}

function LineLayer(props: LayerProps) {
  const { visibleLayers } = props;
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_railroads_north_america.geojson',
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  return (
    <Source
      id='railway-source'
      type='geojson'
      data={data}>
      <Layer
        id='railway-layer'
        source='railway-source'
        type='line'
        layout={{
          visibility: visibleLayers.includes('railways') ? 'visible' : 'none',
        }}
        paint={{ 'line-color': grey[800] }}
      />
    </Source>
  );
}

function PointLayer(props: LayerProps) {
  const { visibleLayers } = props;
  const [data, setData] = useState(null);
  useEffect(() => {
    Promise.all([
      fetch(
        'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces.geojson',
      ),
      fetch(
        'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson',
      ),
    ])
      .then((value) =>
        Promise.all<FeatureCollection>(value.map((d) => d.json())),
      )
      .then(([states, ports]) => {
        const bufferZone = buffer(states, 10, { units: 'kilometers' });
        setData({
          ...ports,
          features: ports.features.filter((port) =>
            booleanIntersects(port, bufferZone),
          ),
        });
      });
  }, []);
  return (
    <Source
      id='ports-source'
      type='geojson'
      data={data}>
      <Layer
        id='ports-layer'
        source='ports-source'
        type='circle'
        layout={{
          visibility: visibleLayers.includes('ports') ? 'visible' : 'none',
        }}
        paint={{
          'circle-color': deepPurple[400],
          'circle-stroke-width': 1,
          'circle-opacity': 0.5,
        }}
      />
    </Source>
  );
}

const Legenditems: { value: string; label: string; color: string }[] = [
  {
    value: 'states',
    label: 'States',
    color: deepOrange[400],
  },
  {
    value: 'ports',
    label: 'Ports',
    color: deepPurple[400],
  },
  {
    value: 'railways',
    label: 'Railways',
    color: grey[800],
  },
];

function Legend(props: {
  onVisibilityChange: (e: ChangeEvent<HTMLInputElement>) => void;
  visibleLayers: string[];
}) {
  const { visibleLayers, onVisibilityChange } = props;
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 24,
        right: 10,
        width: 200,
        minHeight: 150,
      }}>
      <Paper sx={{ width: '100%', height: '100%' }}>
        <Typography p={1}>Legend</Typography>
        <Divider />
        {Legenditems.map(({ value, label, color }) => (
          <Box
            key={label}
            p={1}>
            <FormControlLabel
              sx={{ width: '100%' }}
              control={
                <Checkbox
                  checked={visibleLayers.includes(value)}
                  value={value}
                  onChange={onVisibilityChange}
                />
              }
              disableTypography
              label={
                <Grid2
                  width={'100%'}
                  flexGrow={1}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  container>
                  <Typography variant='overline'>{label}</Typography>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: color,
                      border: '2px solid black',
                    }}
                  />
                </Grid2>
              }
            />
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
