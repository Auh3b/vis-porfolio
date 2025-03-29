import { load } from '@loaders.gl/core';
import { useCallback } from 'react';
import { DATA_LOADER } from '../../../utils/data-loaders';
import { processFilters } from '../../../utils/filterHandlers';
import { DataLoadConfig } from '../../../utils/types/data.types';
import { useDashboardStore } from './store';

export default function useDashboard() {
  const state = useDashboardStore((state) => state);
  const setFilter = state.setFilter;
  const removeFilter = state.removeFilter;
  const getExclusiveFilters = useCallback(
    (id: string) => {
      const filters = Object.entries(state.filters);
      return filters
        .filter(([name]) => name !== id)
        .map(([_name, filter]) => filter);
    },
    [state],
  );

  const getDataset = useCallback(
    (id: string, datasetId: string) => {
      const filters = getExclusiveFilters(id);
      const data = state.dataset[datasetId];
      let filteredData = processFilters(data, filters);
      return filteredData;
    },
    [state],
  );

  const getFilterValues = useCallback(
    (id: string) => {
      return state.filters[id]?.values;
    },
    [state],
  );

  const getLoadFunc = (
    dataset: DataLoadConfig,
    loaderOptions?: { [key: string]: any },
  ) => {
    const { format, url } = dataset;
    const loader = DATA_LOADER[format];
    return load(url, loader, loaderOptions || {});
  };

  return {
    removeFilter,
    setFilter,
    getDataset,
    getFilterValues,
    getLoadFunc,
  };
}
