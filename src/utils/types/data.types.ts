export interface DataLoadConfig {
  name: string;
  type: 'geojson' | 'table';
  format: 'json' | 'csv' | 'geojson';
  url: string;
}
