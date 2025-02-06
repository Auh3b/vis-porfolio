import { Fragment, useCallback, useMemo } from 'react';
import { useDashboardStore } from '../store';
import useDashboard from '../useDashboard';
import { flatRollup } from 'd3';
import BarChart from '../../../../components/charts/d3/BarChart';

export default function ShopsPerTown() {
  const id = 'shopPerTown';
  const column = 'county';
  const datasetId = 'shops';

  const { getFilterValues, getDataset } = useDashboard();

  const shops = getDataset(id, datasetId);

  const setFilter = useDashboardStore((state) => state.setFilter);

  const selectedValues = getFilterValues(id) || [];

  const data = useMemo(() => {
    if (!shops) return null;
    const group = flatRollup(
      shops,
      (v) => v.length,
      (d) => d[column],
    );
    return group.map(([label, value]) => ({ label, value }));
  }, [shops]);

  const onSelection = useCallback(
    (label: string) => {
      if (!selectedValues.length) {
        setFilter(id, {
          type: 'in',
          column,
          values: [label],
        });
        return;
      }
      if (selectedValues.includes(label)) {
        setFilter(id, {
          type: 'in',
          column,
          values: selectedValues.filter((d) => d !== label),
        });
        return;
      }
      setFilter(id, {
        type: 'in',
        column,
        values: [...selectedValues, label],
      });
    },
    [selectedValues],
  );
  return (
    <Fragment>
      {data && (
        <BarChart
          data={data}
          onSelection={onSelection}
          selectedValues={selectedValues}
        />
      )}
    </Fragment>
  );
}
