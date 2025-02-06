import React, { Fragment, useMemo } from 'react';
import useDashboard from '../useDashboard';
import { flatRollup, sum } from 'd3';
import PieChart from '../../../../components/charts/d3/PieChart';
const id = 'product-type-registration';
const column = 'Product Type';
const datasetId = 'monthly_regs';

export default function ProductTypeRegistration() {
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
  return <Fragment>{data && <PieChart data={data} />}</Fragment>;
}
