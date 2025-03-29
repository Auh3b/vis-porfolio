import { flatRollup, sum } from 'd3';
import { useMemo } from 'react';
import IndicatorContainer from '../../../../components/charts/common/IndicatorContainer';
import PieChart from '../../../../components/charts/d3/PieChart';
import useElementSize from '../../../../hooks/useElementSize';
import useDashboard from '../useDashboard';
import { DATASET_NAME } from '../utils';
const id = 'product-type-sale';
const column = 'Product Type';
const title = 'Sales by Product Type';
export default function ProductTypeSales() {
  const [ref, size] = useElementSize();
  const { getDataset } = useDashboard();
  const datasetId = DATASET_NAME.CONSOLIDATED_DATA;
  const _data = getDataset(id, datasetId);
  const data = useMemo(() => {
    if (!_data?.data) return null;
    const output = flatRollup(
      _data.data,
      (v) => sum(v, (d) => d['Registrations']),
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
