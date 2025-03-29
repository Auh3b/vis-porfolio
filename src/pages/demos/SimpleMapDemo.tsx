import { purple } from '@mui/material/colors';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import {
  AttributionControl,
  Layer,
  LayerProps,
  MapMouseEvent,
  MapRef,
  Source,
} from 'react-map-gl';
import CustomNavigationPanel from '../../components/map/CustomNavigationPanel';
import MapboxMapContainer from '../../components/map/mapbox/MapboxMapContainer';
import MapContentTitle from '../../components/map/MapContentTitle';

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
    <div className='grow'>
      <div className='flex flex-col w-full h-full'>
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
          mapStyle={'mapbox://styles/robertchiko/cm7qs6um9007d01sdetwq575s'}>
          <MapContentTitle
            title='UNHAS Helicopter Landing Sites'
            wrapperClasses='p-2 paper absolute top-4 left-4 shadow w-1/2 md:w-1/3'>
            <MapInfo />
          </MapContentTitle>
          <CustomNavigationPanel mapRef={mapRef.current} />
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
      </div>
    </div>
  );
}

function MapInfo() {
  const [open, setOpen] = useState(true);
  const handleClick = () => setOpen((prev) => !prev);
  return (
    <div className='flex items-start'>
      <button
        className='px-2 pt-0 button'
        onClick={handleClick}>
        {open ? (
          <MdKeyboardArrowRight fontSize={20} />
        ) : (
          <MdKeyboardArrowDown fontSize={20} />
        )}
      </button>
      <p
        className={`text-xs transition-all duration-500 ${
          open ? 'h-4 overflow-hidden' : 'h-auto'
        }`}>
        The United Nations Humanitarian Air Service (UNHAS), managed by the
        World Food Programme (WFP), offers safe, reliable, cost-efficient and
        effective passenger and light cargo transport for the wider humanitarian
        community to and from areas of crisis. It is the only humanitarian air
        service that gives equal access to all humanitarian entities. UNHAS
        responds to the need for access to the world's most remote and
        challenging locations, often under precarious security conditions, where
        no safe surface transport or other viable commercial aviation options
        are available.
      </p>
    </div>
  );
}

function HoverInfo(props: { coords: number[]; name: string }) {
  const {
    name,
    coords: [x, y],
  } = props;
  return (
    <div
      className='paper p-2'
      style={{
        position: 'absolute',
        transform: `translate(${x + 10}px, ${y + 10}px)`,
      }}>
      {name} 🚁
    </div>
  );
}

const circleFill: LayerProps = {
  id: LAYERS.LANDING_LAYER,
  type: 'circle',
  source: 'airports',
  filter: ['!has', 'point_count'],
  paint: {
    'circle-radius': 10,
    'circle-color': purple[600],
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
    'circle-color': purple[600],
    'circle-stroke-color': purple[600],
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
