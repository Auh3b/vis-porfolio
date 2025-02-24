import { grey } from '@mui/material/colors';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';
import { useCallback, useEffect, useRef } from 'react';
import { ChartProps } from './utils/chart.types';

export default function BarChart(props: ChartProps) {
  const xAxisRef = useRef<SVGGElement>();
  const yAxisRef = useRef<SVGGElement>();

  const {
    width = 300,
    height = 200,
    margin = {
      top: 20,
      bottom: 20,
      left: 70,
      right: 0,
    },
    data,
    selectedValues = [],
    onSelection,
  } = props;
  const yScale = scaleBand()
    .domain(data.map(({ label }) => label))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1);
  const xScale = scaleLinear()
    .domain([0, max(data, ({ value }) => value)])
    .range([margin.left, width - margin.right]);

  useEffect(
    () => void select(xAxisRef.current).call(axisBottom(xScale)),
    [xAxisRef, xScale],
  );
  useEffect(
    () => void select(yAxisRef.current).call(axisLeft(yScale)),
    [yAxisRef, yScale],
  );

  const handleSelection = useCallback(
    (label: string) => {
      if (onSelection) onSelection(label);
    },
    [onSelection],
  );

  const getColor = useCallback(
    (label: string) => {
      if (!selectedValues.length) return 'black';
      if (selectedValues.includes(label)) return 'black';
      return grey[400];
    },
    [selectedValues],
  );

  return (
    <div className='h-64 md:h-full'>
      <svg
        width={width}
        height={height}
        className='fill-indigo-700'>
        <g>
          {data
            .sort((a, b) => b.value - a.value)
            .map(({ value, label }) => (
              <rect
                key={label}
                onClick={() => handleSelection(label)}
                fill={getColor(label)}
                y={yScale(label)}
                x={xScale(0)}
                className='fill-indigo-700'
                height={yScale.bandwidth()}
                width={xScale(value) - xScale(0)}
              />
            ))}
        </g>
        <g
          fill='white'
          textAnchor='end'>
          {data
            .sort((a, b) => b.value - a.value)
            .map(({ value, label }) => (
              <text
                x={xScale(value) + margin.right}
                y={yScale(label) + yScale.bandwidth() / 2}
                dy={`0.35em`}
                dx={-4}>
                {value}
              </text>
            ))}
        </g>
        <g
          ref={yAxisRef}
          transform={`translate(${margin.left}, 0)`}></g>
        <g
          ref={xAxisRef}
          transform={`translate(0, ${height - margin.bottom})`}></g>
      </svg>
    </div>
  );
}
