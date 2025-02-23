import { useCallback, useMemo } from 'react';
import { useDashboardStore } from '../store';
import useDashboard from '../useDashboard';
import { flatRollup } from 'd3';
import BarChart from '../../../../components/charts/d3/BarChart';
import useElementSize from '../../../../hooks/useElementSize';
import IndicatorContainer from '../../../../components/charts/common/IndicatorContainer';

const id = 'shopPerTown';
const column = 'county';
const title = 'Shops Per Town';
const datasetId = 'shops';
export default function ShopsPerTown() {
  const [ref, size] = useElementSize();

  const state = useDashboardStore((state) => state);
  console.log(state);

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
