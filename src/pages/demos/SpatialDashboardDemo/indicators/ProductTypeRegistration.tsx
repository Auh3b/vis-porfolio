import { useMemo } from 'react';
import useDashboard from '../useDashboard';
import { flatRollup, sum } from 'd3';
import PieChart from '../../../../components/charts/d3/PieChart';
import DataNotAvailable from '../../../../components/charts/d3/DataNotAvailable';
import useElementSize from '../../../../hooks/useElementSize';
import IndicatorContainer from '../../../../components/charts/common/IndicatorContainer';
const id = 'product-type-registration';
const column = 'Product Type';
const title = 'Product Type';
const datasetId = 'monthly_regs';

export default function ProductTypeRegistration() {
  const [ref, size] = useElementSize();
  const { getDataset } = useDashboard();
  const _data = getDataset(id, datasetId);
  const data = useMemo(() => {
    if (!_data) return null;
    const output = flatRollup(
      _data,
      (v) => sum(v, (d) => d['Registrations']),
      (d) => d[column],
    );
    return output.map(([label, value]) => ({ label, value }));
  }, [_data]);
  return (
    <IndicatorContainer
      title={title}
      chartRef={ref}>
      {data && data.length ? (
        <PieChart
          data={data}
          {...size}
        />
      ) : (
        <DataNotAvailable />
      )}
    </IndicatorContainer>
  );
}
