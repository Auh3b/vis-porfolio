import React, { useCallback } from 'react';
import { useDashboardStore } from './store';
import { processFilters } from '../../../utils/filterHandlers';

export default function useDashboard() {
  const state = useDashboardStore((state) => state);
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

  return {
    getDataset,
    getFilterValues,
  };
}
