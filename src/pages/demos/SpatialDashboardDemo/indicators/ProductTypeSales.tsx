import React, { Fragment, useMemo } from 'react';
import useDashboard from '../useDashboard';
import { flatRollup, sum } from 'd3';
import PieChart from '../../../../components/charts/d3/PieChart';
const id = 'product-type-sale';
const column = 'Product Type';
const datasetId = 'monthly_sales';

export default function ProductTypeSales() {
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
  return <Fragment>{data && <PieChart data={data} />}</Fragment>;
}
