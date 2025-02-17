import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useDashboard from '../useDashboard';
import LineChart from '../../../../components/charts/d3/LineChart';
import { ascending, sum } from 'd3';
import { getUnixTime } from 'date-fns';
import { Box } from '@mui/material';
import useElementSize from '../../../../hooks/useElementSize';

const id = 'product-tax-indicator';
const datasetId = 'monthly_taxes';
const column = 'date';

export default function ProductTax() {
  const [size, setSize] = useState<null | { width: number; height: number }>(
    null,
  );
  const ref = useRef<HTMLDivElement>();

  const { getDataset, setFilter, removeFilter } = useDashboard();

  const _data = getDataset(id, datasetId);

  const data = useMemo(() => {
    if (!_data) return null;
    return _data
      .sort((a, b) => ascending(a, b))
      .map((d) => {
        const value = sum([
          d['plant_material_tax'],
          d['edible_products_tax'],
          d['other_cannabis__tax'],
        ]);
        const label = d['date'];
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

  useLayoutEffect(() => {
    if (ref.current) {
      const { clientHeight: height, clientWidth: width } = ref.current;
      setSize({ height, width });
    }
  }, [data]);

  console.log(size);

  return (
    <Box
      ref={ref}
      sx={{ flexGrow: 1 }}>
      {data && (
        <LineChart
          {...size}
          data={data}
          onSelection={onSelection}
        />
      )}
    </Box>
  );
}
