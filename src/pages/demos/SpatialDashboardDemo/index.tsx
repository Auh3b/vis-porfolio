import { Box, Grid2, Typography } from '@mui/material';
import MapboxMapContainer from '../../../components/map/mapbox/MapboxMapContainer';
import { Layer, Marker, Source } from 'react-map-gl';
import { Fragment } from 'react/jsx-runtime';
import { useDashboardStore } from './store';
import { deepOrange } from '@mui/material/colors';
import { useEffect } from 'react';
import useDashboard from './useDashboard';
import ShopsPerTown from './indicators/ShopsPerTown';
import ProductTypeRegistration from './indicators/ProductTypeRegistration';
import ProductTypeSales from './indicators/ProductTypeSales';

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
    <Box
      flexGrow={1}
      p={1}>
      <Grid2
        container
        direction={'column'}
        width={'100%'}
        height={'100%'}>
        <Typography>Spatial Dashboard</Typography>
        <Grid2
          flexGrow={1}
          container>
          <LeftChartsPanel />
          <MapboxMapContainer
            mapStyle={'mapbox://styles/robertchiko/cl9la8m2h002j14qd610lf66k'}>
            <CountLayer />
            <ShopLayer />
          </MapboxMapContainer>
        </Grid2>
      </Grid2>
    </Box>
  );
}

function CountLayer() {
  const id = 'county-layer';
  const datasetId = 'counties';
  const { getDataset } = useDashboard();
  const counties = getDataset(id, datasetId);
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
    <Grid2
      container
      width={350}
      gap={2}
      direction={'column'}>
      <ShopsPerTown />
      <ProductTypeRegistration />
      <ProductTypeSales />
    </Grid2>
  );
}
