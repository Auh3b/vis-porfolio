import { useMemo } from 'react';
import useDashboard from '../useDashboard';
import { flatRollup, sum } from 'd3';
import PieChart from '../../../../components/charts/d3/PieChart';
import useElementSize from '../../../../hooks/useElementSize';
import IndicatorContainer from '../../../../components/charts/common/IndicatorContainer';
const id = 'product-type-sale';
const column = 'Product Type';
const title = 'Sales by Product Type';
const datasetId = 'monthly_sales';

export default function ProductTypeSales() {
  const [ref, size] = useElementSize();
  const { getDataset } = useDashboard();
  const _data = getDataset(id, datasetId);
  const data = useMemo(() => {
    if (!_data) return null;
    const output = flatRollup(
      _data,
      (v) => sum(v, (d) => d['Retail Sales Amount']),
      (d) => d[column],
    );
    return output.map(([label, value]) => ({ label, value }));
  }, [_data]);

  return (
    <IndicatorContainer
      chartRef={ref}
      title={title}>
      {data && (
        <PieChart
          data={data}
          {...size}
        />
      )}
    </IndicatorContainer>
  );
}
