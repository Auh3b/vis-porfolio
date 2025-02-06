import React from 'react';
import { ChartProps, DataItem } from './utils/chart.types';
import { arc, descending, extent, pie, scaleLinear, scaleOrdinal } from 'd3';
import { grey } from '@mui/material/colors';

export default function PieChart(props: ChartProps) {
  const {
    width = 300,
    height = 225,
    margin = {
      top: 20,
      bottom: 20,
      left: 70,
      right: 0,
    },
    data: _data,
    selectedValues = [],
    onSelection,
  } = props;

  const radius = Math.min(width, height) / 2;

  const pieGenerator = pie<any, DataItem>()
    .sort(null)
    .value((d) => d.value);

  const arcGenerator = arc();

  const colorScale = scaleLinear()
    .domain(extent(_data, (d) => d.value))
    .range([grey[300], 'black']);

  const arcs = pieGenerator(
    _data.sort((a, b) => descending(a.value, b.value)),
  ).map(({ startAngle, endAngle, value }) => ({
    fill: colorScale(value),
    d: arcGenerator({
      startAngle,
      endAngle,
      innerRadius: radius * 0.67,
      outerRadius: radius - 5,
    }),
  }));

  return (
    <svg
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      width={width}
      height={height}>
      <g>
        {arcs.map((d, i) => (
          <path
            {...d}
            key={i}
          />
        ))}
      </g>
    </svg>
  );
}
