import {
  axisBottom,
  axisLeft,
  brushX,
  descending,
  line,
  max,
  scaleLinear,
  scaleTime,
  select,
} from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { ChartProps, DataItem } from './utils/chart.types';

export default function LineChart(props: ChartProps<DataItem, Date[] | null>) {
  const {
    width = 300,
    height = 150,
    margin = {
      top: 20,
      bottom: 20,
      left: 44,
      right: 20,
    },
    data: _data,
    onSelection,
  } = props;
  const gx = useRef();
  const gy = useRef();
  const brushRef = useRef();

  const data = useMemo(
    () =>
      _data
        .map(({ value, label }) => ({ value, label: new Date(label) }))
        .sort((a, b) => descending(a.label, b.label)),
    [_data],
  );
  console.log(data);
  const xScale = scaleTime()
    .domain([new Date(2023, 0, 1), new Date(2024, 11, 31)])
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain([0, max(_data, (d) => d.value)])
    .range([height - margin.bottom, margin.top]);

  const lineGenerator = line()
    .x((d) => xScale(d.label))
    .y((d) => yScale(d.value));
  // .curve(curveStep);

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
    <div className='relative w-full h-44 md:h-full'>
      <svg
        width={width}
        height={height}>
        <g ref={brushRef}></g>
        <g>
          {_data.map(({ value, label }) => (
            <circle
              className='fill-indigo-700'
              key={label}
              r={3}
              cx={xScale(new Date(label))}
              cy={yScale(value)}
            />
          ))}
        </g>
        {data && (
          <g>
            <path
              className='stroke-indigo-700'
              fill='none'
              d={lineGenerator(data)}
            />
          </g>
        )}
        <g
          ref={gy}
          transform={`translate(${margin.left}, 0)`}></g>
        <g
          ref={gx}
          transform={`translate(0, ${height - margin.bottom})`}></g>
      </svg>
    </div>
  );
}
