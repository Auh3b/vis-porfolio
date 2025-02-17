import { useEffect, useMemo, useRef } from 'react';
import { ChartProps, DataItem } from './utils/chart.types';
import { Box } from '@mui/material';
import {
  axisBottom,
  axisLeft,
  brushX,
  max,
  scaleLinear,
  scaleTime,
  select,
} from 'd3';
import { parse } from 'date-fns';

export default function LineChart(props: ChartProps<DataItem, Date[] | null>) {
  const {
    width = 300,
    height = 150,
    margin = {
      top: 20,
      bottom: 20,
      left: 70,
      right: 20,
    },
    data: _data,
    onSelection,
  } = props;
  const gx = useRef();
  const gy = useRef();
  const brushRef = useRef();

  const parseDate = (value: string) => parse(value, 'dd-MM-yyyy', new Date());

  const xScale = scaleTime()
    .domain([new Date(2023, 0, 1), new Date(2024, 11, 31)])
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain([0, max(_data, (d) => d.value)])
    .range([height - margin.bottom, margin.top]);

  useEffect(
    () => void select(gx.current).call(axisBottom(xScale).ticks(5)),
    [gx, xScale],
  );

  useEffect(
    () => void select(gy.current).call(axisLeft(yScale).ticks(5, '.2s')),
    [gy, yScale],
  );

  const handleSelection = ({ selection }: any) => {
    if (!onSelection) return;
    if (selection) {
      return onSelection(selection.map((x: number) => xScale.invert(x)));
    }
  };

  const brush = useMemo(
    () =>
      brushX()
        .extent([
          [margin.left, 0.5],
          [width - margin.right, height - margin.bottom],
        ])
        .on('brush', handleSelection),
    [width, height],
  );

  useEffect(() => {
    select(brushRef.current).call(brush);
  }, [brushRef]);

  return (
    <Box>
      <svg
        width={width}
        height={height}>
        <g ref={brushRef}></g>
        <g>
          {_data.map(({ value, label }) => (
            <circle
              key={label}
              r={2}
              cx={xScale(new Date(label))}
              cy={yScale(value)}
            />
          ))}
        </g>
        <g
          ref={gy}
          transform={`translate(${margin.left}, 0)`}></g>
        <g
          ref={gx}
          transform={`translate(0, ${height - margin.bottom})`}></g>
      </svg>
    </Box>
  );
}
