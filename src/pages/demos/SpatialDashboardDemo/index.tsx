import MapboxMapContainer from '../../../components/map/mapbox/MapboxMapContainer';
import { Layer, Marker, Source, useMap } from 'react-map-gl';
import { Fragment } from 'react/jsx-runtime';
import { useDashboardStore } from './store';
import { deepOrange } from '@mui/material/colors';
import { useEffect } from 'react';
import useDashboard from './useDashboard';
import ShopsPerTown from './indicators/ShopsPerTown';
import ProductTypeRegistration from './indicators/ProductTypeRegistration';
import ProductTypeSales from './indicators/ProductTypeSales';
import ProductTax from './indicators/ProductTax';
import { bbox } from '@turf/turf';

const data = [
  {
    name: 'shops',
    type: 'table',
    url: 'https://raw.githubusercontent.com/Auh3b/vis-demos-data/refs/heads/main/demos/spatial-dashboard/connecticut-cannabis/data/output/ct_shops.json',
  },
  {
    name: 'counties',
    type: 'geojson',

    url: 'https://raw.githubusercontent.com/Auh3b/vis-demos-data/refs/heads/main/demos/spatial-dashboard/connecticut-cannabis/data/output/ct_counties.geojson',
  },
  {
    type: 'table',
    name: 'monthly_taxes',
    url: 'https://raw.githubusercontent.com/Auh3b/vis-demos-data/refs/heads/main/demos/spatial-dashboard/connecticut-cannabis/data/output/ct_monthly_tax.json',
  },
  {
    name: 'monthly_sales',

    type: 'table',
    url: 'https://raw.githubusercontent.com/Auh3b/vis-demos-data/refs/heads/main/demos/spatial-dashboard/connecticut-cannabis/data/output/ct_monthly_prod_sale.json',
  },
  {
    name: 'monthly_regs',
    type: 'table',
    url: 'https://raw.githubusercontent.com/Auh3b/vis-demos-data/refs/heads/main/demos/spatial-dashboard/connecticut-cannabis/data/output/ct_monthly_reg_type.json',
  },
];

export default function SpatialDashboardDemo() {
  const setData = useDashboardStore((state) => state.setDataset);
  useEffect(() => {
    Promise.all(data.map((d) => fetch(d.url)))
      .then((res) => Promise.all(res.map((d) => d.json())))
      .then((datasets) => {
        datasets.forEach((d, i) =>
          // @ts-ignore
          setData(data[i].name, { type: data[i].type, data: d }),
        );
      });
  }, []);

  return (
    <div className='grow p-4 flex flex-col overflow-hidden'>
      <span>Conniticut Weed Industry | Spatial Dashboard</span>
      <div className='grow gap-4 grid grid-cols-1 md:grid-cols-2'>
        <LeftChartsPanel />
        <div className='w-full h-84 md:h-full order-first md:order-0'>
          <MapboxMapContainer
            className='p-2 border border-gray-200'
            mapStyle={'mapbox://styles/robertchiko/cl9la8m2h002j14qd610lf66k'}>
            <CountLayer />
            <ShopLayer />
          </MapboxMapContainer>
        </div>
      </div>
    </div>
  );
}

function CountLayer() {
  const id = 'county-layer';
  const datasetId = 'counties';
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
  const datasetId = 'shops';
  const { getDataset } = useDashboard();
  const shops = getDataset(id, datasetId);
  return (
    <Fragment>
      {shops &&
        // @ts-ignore
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
