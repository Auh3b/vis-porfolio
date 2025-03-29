import { deepOrange } from '@mui/material/colors';
import { bbox } from '@turf/turf';
import { flatRollup } from 'd3';
import { useEffect, useMemo } from 'react';
import { Layer, Marker, Source, useMap } from 'react-map-gl';
import { Fragment } from 'react/jsx-runtime';
import Divider from '../../../components/common/Divider';
import MapboxMapContainer from '../../../components/map/mapbox/MapboxMapContainer';
import MapContentTitle from '../../../components/map/MapContentTitle';
import { DATA_FORMAT } from '../../../utils/data-loaders';
import { DataLoadConfig } from '../../../utils/types/data.types';
import ProductTax from './indicators/ProductTax';
import ProductTypeRegistration from './indicators/ProductTypeRegistration';
import ProductTypeSales from './indicators/ProductTypeSales';
import ShopsPerTown from './indicators/ShopsPerTown';
import { useDashboardStore } from './store';
import useDashboard from './useDashboard';
import { DATASET_NAME } from './utils';

const data: DataLoadConfig[] = [
  {
    name: DATASET_NAME.COUNTIES,
    type: 'geojson',
    format: DATA_FORMAT.GEOJSON,
    url: 'https://raw.githubusercontent.com/Auh3b/vis-demos-data/refs/heads/main/demos/spatial-dashboard/connecticut-cannabis/data/output/ct_counties.geojson',
  },
  {
    name: DATASET_NAME.CONSOLIDATED_DATA,
    type: 'table',
    format: DATA_FORMAT.CSV,
    url: 'https://raw.githubusercontent.com/Auh3b/vis-demos-data/refs/heads/main/demos/spatial-dashboard/connecticut-cannabis/data/output/merge_data.csv',
  },
];

export default function SpatialDashboardDemo() {
  const setData = useDashboardStore((state) => state.setDataset);
  const { getLoadFunc } = useDashboard();
  useEffect(() => {
    Promise.all(data.map((d) => getLoadFunc(d))).then((datasets) => {
      datasets.forEach((d, i) =>
        // @ts-ignore
        setData(data[i].name, { ...data[i], data: d }),
      );
    });
  }, []);

  return (
    <div className='grow p-4 flex flex-col overflow-hidden'>
      <MapContentTitle title='Connecticut Cannibus Business' />
      <div className='flex flex-col md:flex-row gap-4 w-full h-full'>
        <FilterPanel />
        <div className='grow gap-4 grid grid-cols-1 md:grid-cols-2'>
          <LeftChartsPanel />
          <div className='w-full h-84 md:h-full order-first md:order-0'>
            <MapboxMapContainer
              className='p-2 border border-gray-200'
              mapStyle={
                'mapbox://styles/robertchiko/cm7qs6um9007d01sdetwq575s'
              }>
              <CountLayer />
              <ShopLayer />
            </MapboxMapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountLayer() {
  const id = 'county-layer';
  const datasetId = DATASET_NAME.COUNTIES;
  const { getDataset } = useDashboard();
  const counties = getDataset(id, datasetId);
  const { current: map } = useMap();
  useEffect(() => {
    if (counties && map) {
      // @ts-ignore
      const bounds = bbox(counties);
      const [minX, minY, maxX, maxY] = bounds;
      map.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        { padding: 20 },
      );
    }
  }, [counties]);
  return (
    <Fragment>
      {counties && (
        <Source
          id='counties-source'
          type='geojson'
          data={counties}>
          <Layer
            type={'fill'}
            source='counties-source'
            id='counties-layer'
            paint={{ 'fill-color': deepOrange[400], 'fill-opacity': 0.5 }}
          />
        </Source>
      )}
    </Fragment>
  );
}

function ShopLayer() {
  const id = 'shops-layer';
  const { getDataset } = useDashboard();
  const datasetId = DATASET_NAME.CONSOLIDATED_DATA;
  const _shops = getDataset(id, datasetId);
  const shops = useMemo(() => {
    if (!_shops) return null;
    return flatRollup(
      _shops?.data,
      (v) => v.length,
      (d) => d['longitude'],
      (d) => d['latitude'],
      (d) => d['business'],
    ).map((d) => ({ longitude: d[0], latitude: d[1], business: d[2] }));
  }, [_shops]);

  return (
    <Fragment>
      {shops &&
        shops.map(({ latitude, longitude }, i) => (
          <Marker
            key={i}
            latitude={latitude}
            longitude={longitude}
          />
        ))}
    </Fragment>
  );
}

function LeftChartsPanel() {
  return (
    <div className='grid gap-4 grid-rows-2'>
      <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
        <ShopsPerTown />
        <ProductTypeRegistration />
        <ProductTypeSales />
      </div>
      <ProductTax />
    </div>
  );
}

function FilterPanel() {
  return (
    <div className='flex flex-col gap-2'>
      <span>Filters</span>
      <Divider />
    </div>
  );
}
