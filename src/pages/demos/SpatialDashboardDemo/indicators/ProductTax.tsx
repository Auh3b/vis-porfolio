import { ascending, sum } from 'd3';
import { getUnixTime } from 'date-fns';
import { useCallback, useMemo } from 'react';
import IndicatorContainer from '../../../../components/charts/common/IndicatorContainer';
import LineChart from '../../../../components/charts/d3/LineChart';
import useElementSize from '../../../../hooks/useElementSize';
import useDashboard from '../useDashboard';
import { DATASET_NAME } from '../utils';

const id = 'product-tax-indicator';
const title = 'Monthly Tax Revenue';
const datasetId = DATASET_NAME.CONSOLIDATED_DATA;
const column = 'date';

export default function ProductTax() {
  const [ref, size] = useElementSize();

  const { getDataset, setFilter, removeFilter } = useDashboard();

  const _data = getDataset(id, datasetId);

  const data = useMemo(() => {
    if (!_data?.data) return null;
    return _data?.data
      .sort((a, b) => ascending(a, b))
      .map((d) => {
        const value = sum([
          d['plant_material_tax'],
          d['edible_products_tax'],
          d['other_cannabis__tax'],
        ]);
        const label = d['date'].split('/').reverse();
        return {
          value,
          label,
        };
      });
  }, [_data]);

  const onSelection = useCallback((selection: Date[] | null) => {
    if (!selection) {
      removeFilter(id);
      return;
    }

    setFilter(id, {
      type: 'between',
      values: selection.map((d) => getUnixTime(d)),
      column,
    });
  }, []);
  console.log(data);
  return (
    <IndicatorContainer
      title={title}
      chartRef={ref}>
      {data && (
        <LineChart
          {...size}
          data={data}
          onSelection={onSelection}
        />
      )}
    </IndicatorContainer>
  );
}
