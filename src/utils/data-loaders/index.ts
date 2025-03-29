import { CSVLoader } from '@loaders.gl/csv';
import { JSONLoader, _GeoJSONLoader } from '@loaders.gl/json';

export const DATA_FORMAT = {
  JSON: 'json',
  GEOJSON: 'geojson',
  CSV: 'csv',
} as const;

export const DATA_LOADER = {
  [DATA_FORMAT.CSV]: CSVLoader,
  [DATA_FORMAT.JSON]: JSONLoader,
  [DATA_FORMAT.GEOJSON]: _GeoJSONLoader,
};
