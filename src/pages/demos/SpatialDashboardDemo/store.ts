import { FeatureCollection } from 'geojson';
import { create } from 'zustand';

export interface GeoJsonData {
  type: 'geojson';
  data: FeatureCollection;
}

export interface TabularData {
  type: 'table';
  data: { [key: string]: any }[];
}

export type DataSet = TabularData | GeoJsonData;

interface DataSets {
  [k: string]: DataSet;
}

export interface FilterItem {
  type: 'in' | 'between';
  column: string;
  values: any[];
}

export interface Filters {
  [k: string]: FilterItem;
}

interface DashboardState {
  dataset: DataSets;
  filters: Filters;
}

interface DashboardActions {
  setDataset: (id: string, data: DataSet) => void;
  setFilter: (id: string, filter: FilterItem) => void;
  removeFilter: (id: string) => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set) => ({
    dataset: {},
    filters: {},
    setDataset: (id, data) =>
      set((state) => ({
        dataset: {
          ...state.dataset,
          [id]: data,
        },
      })),
    setFilter: (id, filter) =>
      set((state) => ({
        filters: {
          ...state.filters,
          [id]: filter,
        },
      })),
    removeFilter: (id) =>
      set((state) => {
        const remaining = state.filters;
        delete remaining[id];
        return {
          filters: {
            ...remaining,
          },
        };
      }),
  }),
);
