import { flatRollup } from 'd3';
import { useCallback, useMemo } from 'react';
import IndicatorContainer from '../../../../components/charts/common/IndicatorContainer';
import BarChart from '../../../../components/charts/d3/BarChart';
import useElementSize from '../../../../hooks/useElementSize';
import { useDashboardStore } from '../store';
import useDashboard from '../useDashboard';
import { DATASET_NAME } from '../utils';

const id = 'shopPerTown';
const column = 'county';
const title = 'Shops Per Town';
const datasetId = 'shops';
export default function ShopsPerTown() {
  const [ref, size] = useElementSize();

  const { getFilterValues, getDataset } = useDashboard();

  const datasetId = DATASET_NAME.CONSOLIDATED_DATA;
  const _shops = getDataset(id, datasetId);

  const setFilter = useDashboardStore((state) => state.setFilter);

  const selectedValues = getFilterValues(id) || [];

  const data = useMemo(() => {
    if (!_shops?.data) return null;
    const group = flatRollup(
      _shops?.data,
      (v) => Array.from(new Set(v.map((d) => d['business']))).length,
      (d) => d[column],
    );
    return group.map(([label, value]) => ({ label, value }));
  }, [_shops]);

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
  console.log(data);
  return (
    <IndicatorContainer
      chartRef={ref}
      title={title}>
      {data && (
        <BarChart
          {...size}
          data={data}
          onSelection={onSelection}
          selectedValues={selectedValues}
        />
      )}
    </IndicatorContainer>
  );
}
