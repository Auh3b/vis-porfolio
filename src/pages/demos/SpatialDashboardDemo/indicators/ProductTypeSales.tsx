import { useMemo, useRef } from 'react';
import useDashboard from '../useDashboard';
import { flatRollup, sum } from 'd3';
import PieChart from '../../../../components/charts/d3/PieChart';
import { Box } from '@mui/material';
import useElementSize from '../../../../hooks/useElementSize';
const id = 'product-type-sale';
const column = 'Product Type';
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
    <Box sx={{ p: 1, flexGrow: 1 }}>{data && <PieChart data={data} />}</Box>
  );
}
