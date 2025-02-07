import { Fragment, useMemo } from 'react';
import useDashboard from '../useDashboard';
import LineChart from '../../../../components/charts/d3/LineChart';
import { ascending, descending, sum } from 'd3';
import { endOfMonth } from 'date-fns';

const id = 'product-tax-indicator';
const datasetId = 'monthly_taxes';

export default function ProductTax() {
  const { getDataset } = useDashboard();
  const _data = getDataset(id, datasetId);
  const data = useMemo(() => {
    if (!_data) return null;
    console.log(_data);
    return _data
      .sort((a, b) => ascending(a, b))
      .map((d) => {
        const value = sum([
          d['plant_material_tax'],
          d['edible_products_tax'],
          d['other_cannabis__tax'],
        ]);
        const label = endOfMonth(
          new Date(`1 ${d['month']} ${d['year']}`),
        ).toString();
        return {
          value,
          label,
        };
      });
  }, [_data]);
  console.log(data);
  return <Fragment>{data && <LineChart data={data} />}</Fragment>;
}
