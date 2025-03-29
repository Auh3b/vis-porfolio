import { deepOrange, deepPurple, grey } from '@mui/material/colors';
import { bbox, booleanIntersects, buffer, featureCollection } from '@turf/turf';
import { FeatureCollection } from 'geojson';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LuSquare, LuSquareCheck, LuTrainTrack } from 'react-icons/lu';
import { RiShapeLine, RiShipFill } from 'react-icons/ri';
import { Layer, MapMouseEvent, MapRef, Source, useMap } from 'react-map-gl';
import CustomNavigationPanel from '../../../components/map/CustomNavigationPanel';
import MapboxMapContainer from '../../../components/map/mapbox/MapboxMapContainer';
import MapContentTitle from '../../../components/map/MapContentTitle';

type PopupObject = { layerId: string; [key: string]: any } | null;

const LAYERS = {
  STATE_LAYER: 'state-layer',
  RAIL_LAYER: 'rail-layer',
  PORT_LAYER: 'port-layer',
  PORT_CLUSTERS_LAYER: 'port-cluster-layer',
};

const layerProps = {
  [LAYERS.STATE_LAYER]: [
    { lookup: 'name', label: 'State' },
    { lookup: 'region', label: 'Region' },
  ],
  [LAYERS.RAIL_LAYER]: [{ lookup: 'sov_a3', label: 'Country' }],
  [LAYERS.PORT_LAYER]: [
    { lookup: 'name', label: 'Name' },
    { lookup: 'website', label: 'Website' },
  ],
};

const layerIcons = {
  [LAYERS.PORT_LAYER]: <RiShipFill size={24} />,
  [LAYERS.RAIL_LAYER]: <LuTrainTrack size={24} />,
  [LAYERS.STATE_LAYER]: <RiShapeLine size={24} />,
};

const interactiveLayerIds = [...Object.values(LAYERS)];

export default function ComplexMapDemo() {
  const mapRef = useRef<MapRef | undefined>();
  const [visibleLayers, setVisibleLayers] = useState<string[]>([
    'railways',
    'ports',
    'states',
  ]);

  const [cursor, setCursor] = useState('');
  const [preview, setPreview] = useState<null | PopupObject>(null);

  const clickHandler = useCallback(
    (e: MapMouseEvent) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      const layerId = feature.layer?.id || '';
      if (layerId !== LAYERS.PORT_CLUSTERS_LAYER) return;
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
        zoom: mapRef.current.getZoom() + 1,
      });
    },
    [mapRef.current],
  );

  const moveHandler = (e: MapMouseEvent) => {
    if (!e.features?.length) return;
    const feature = e.features[0];
    const layerId = feature.layer?.id || '';
    if (layerId === LAYERS.PORT_CLUSTERS_LAYER) return;
    setPreview({ layerId, ...feature.properties });
  };

  const leaveHandler = () => {
    setPreview(null);
    setCursor('');
  };
  const handleVisibility = (e: string) => {
    const value = e;
    setVisibleLayers((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    );
  };

  return (
    <div className='grow '>
      <div className='flex flex-col w-full h-full'>
        <MapboxMapContainer
          cursor={cursor}
          // @ts-ignore
          mapRef={mapRef}
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={leaveHandler}
          onMouseMove={moveHandler}
          onClick={clickHandler}
          interactiveLayerIds={interactiveLayerIds}
          mapStyle={'mapbox://styles/robertchiko/cm7qs6um9007d01sdetwq575s'}>
          <MapContentTitle
            title=' US Land and Water Transport'
            wrapperClasses='paper p-3 absolute top-4 left-4'>
            <CustomPopup preview={preview} />
          </MapContentTitle>
          <CustomNavigationPanel mapRef={mapRef.current} />
          <PointLayer visibleLayers={visibleLayers} />
          <PolygonLayer visibleLayers={visibleLayers} />
          <LineLayer visibleLayers={visibleLayers} />
          <Legend
            visibleLayers={visibleLayers}
            onVisibilityChange={handleVisibility}
          />
        </MapboxMapContainer>
      </div>
    </div>
  );
}

function CustomPopup(props: { preview: PopupObject }) {
  const { preview } = props;
  const data = useMemo(() => {
    if (preview) return preview;
    return null;
  }, [preview]);
  return (
    <div className='px-2 py-2 bg-gray-800  '>
      {data ? (
        <Highlight value={data} />
      ) : (
        <span>Hover a feature to few highlights</span>
      )}
    </div>
  );
}

interface LayerProps {
  visibleLayers: string[];
}

function PolygonLayer(props: LayerProps) {
  const { visibleLayers } = props;
  const [data, setData] = useState(null);
  const mapRef = useMap();
  useEffect(() => {
    fetch(
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces.geojson',
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  useEffect(() => {
    if (mapRef.current && data) {
      const bounds = bbox(data);
      const [minX, minY, maxX, maxY] = bounds;
      mapRef.current.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        { padding: 20 },
      );
    }
  }, [mapRef.current, data]);
  return (
    <Source
      id='states-source'
      type='geojson'
      data={data}>
      <Layer
        id={LAYERS.STATE_LAYER}
        source='states-source'
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
        id={LAYERS.RAIL_LAYER}
        source='railway-source'
        type='line'
        layout={{
          visibility: visibleLayers.includes('railways') ? 'visible' : 'none',
        }}
        paint={{
          'line-color': grey[200],
          'line-width': 1,
          'line-dasharray': [2, 2],
        }}
      />
    </Source>
  );
}

function PointLayer(props: LayerProps) {
  const { visibleLayers } = props;
  const [data, setData] = useState<FeatureCollection | null>(null);
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
        const targetFeatures =
          ports.features.filter((port) =>
            // @ts-ignore
            booleanIntersects(port, bufferZone),
          ) || [];
        const portsCollection = featureCollection(targetFeatures);
        setData(portsCollection);
      });
  }, []);
  return (
    <Source
      id='ports-source'
      type='geojson'
      data={data}
      cluster={true}
      clusterRadius={10}
      clusterMaxZoom={16}>
      <Layer
        id={LAYERS.PORT_CLUSTERS_LAYER}
        source='ports-source'
        type='circle'
        filter={['has', 'point_count']}
        layout={{
          visibility: visibleLayers.includes('ports') ? 'visible' : 'none',
        }}
        paint={{
          'circle-color': deepPurple[400],
          'circle-opacity': 0.5,
          'circle-stroke-color': deepPurple[400],
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
        }}
      />
      <Layer
        id='ports-layer-cluster-text'
        source='ports-source'
        type='symbol'
        filter={['has', 'point_count']}
        layout={{
          visibility: visibleLayers.includes('ports') ? 'visible' : 'none',
          'text-field': ['get', 'point_count'],
          'text-anchor': 'center',
          'text-size': [
            'step',
            ['get', 'point_count'],
            16,
            10,
            18,
            20,
            24,
            50,
            32,
          ],
        }}
        paint={{
          'text-color': 'white',
        }}
      />
      <Layer
        id={LAYERS.PORT_LAYER}
        source='ports-source'
        type='circle'
        filter={['!has', 'point_count']}
        layout={{
          visibility: visibleLayers.includes('ports') ? 'visible' : 'none',
        }}
        paint={{
          'circle-color': deepPurple[400],
          'circle-stroke-width': 1,
          'circle-opacity': 0.5,
          'circle-radius': 5,
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
    color: grey[200],
  },
];

function Legend(props: {
  onVisibilityChange: (e: string) => void;
  visibleLayers: string[];
}) {
  const { visibleLayers, onVisibilityChange } = props;
  const isVisible = (value: string) => visibleLayers.includes(value);
  return (
    <div className='bg-gray-800 absolute bottom-6 right-4 w-52 min-h-16 pb-2'>
      <span className='p-2 mb-2 block border-b border-gray-400'>Legend</span>
      {Legenditems.map(({ value, label, color }) => (
        <div
          onClick={() => onVisibilityChange(value)}
          key={label}
          className={`hover:cursor-pointer hover:bg-gray-600 px-2 py-1 flex items-center justify-between`}>
          <div className='flex items-center gap-4'>
            {isVisible(value) ? (
              <LuSquareCheck size={16} />
            ) : (
              <LuSquare size={16} />
            )}
            <span>{label}</span>
          </div>
          <div
            className={`w-2 h-2`}
            style={{ backgroundColor: color }}></div>
        </div>
      ))}
    </div>
  );
}

interface HighlightProps {
  value: PopupObject;
}
function Highlight(props: HighlightProps) {
  const { value } = props;
  const keys = useMemo(
    () => (value?.layerId ? layerProps[value.layerId] : []),
    [value],
  );
  return (
    <div className='w-full flex gap-2 flex-col sm:flex-row'>
      <div>{value?.layerId && layerIcons[value.layerId]}</div>
      <div className='border-l pl-2 grow'>
        {keys.map(({ label, lookup }) => (
          <div
            className='text-xs mb-2'
            key={label}>
            <div className='flex gap-2'>
              <span className='font-semibold'>{label}:</span>
            </div>
            <span className='text-pretty'>{value?.[lookup]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
