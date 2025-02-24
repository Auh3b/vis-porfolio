import React, {
  Fragment,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  AttributeIndicatorItems,
  ChartProps,
  DataItem,
} from './utils/chart.types';
import { arc, descending, extent, format, pie, pointer, scaleLinear } from 'd3';
import { grey, indigo } from '@mui/material/colors';
import ChartIndicatorUI from './components/ChartIndicatorUI';

export default function PieChart(props: ChartProps) {
  const [element, setElement] = useState<AttributeIndicatorItems | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDataAttrubute = useCallback(
    (e: MouseEvent<SVGElement>) => {
      if (containerRef.current) {
        const [x, y] = pointer(e, containerRef.current);
        const { color = '', value = 0, label = '' } = e.currentTarget.dataset;
        setElement({ x, y, color, value, label });
      }
    },
    [containerRef.current],
  );

  const {
    width = 250,
    height = 200,
    margin = {
      top: 20,
      bottom: 20,
      left: 10,
      right: 10,
    },
    data: _data,
  } = props;

  const radius = Math.min(width, height) / 2;

  const pieGenerator = pie<any, DataItem>()
    .sort(null)
    .value((d) => d.value);

  const arcGenerator = arc();

  const colorScale = scaleLinear()
    .domain(extent(_data, (d) => d.value))
    .range([indigo[100], indigo[900]]);

  const arcs = pieGenerator(
    _data.sort((a, b) => descending(a.value, b.value)),
  ).map(({ startAngle, endAngle, value, index }) => {
    const label = _data.sort((a, b) => descending(a.value, b.value))[index]
      .label;

    const fill = colorScale(value);

    const d = arcGenerator({
      startAngle,
      endAngle,
      innerRadius: radius * 0.5,
      outerRadius: radius - margin.top - margin.left,
    });

    const [x, y] = arcGenerator.centroid({
      startAngle,
      endAngle,
      innerRadius: radius,
      outerRadius: radius - margin.top - margin.left,
    });
    return (
      <g>
        <path
          onMouseMove={handleDataAttrubute}
          onMouseLeave={() => setElement(null)}
          data-color={fill}
          data-value={value}
          data-label={label}
          fill={fill}
          d={d}
        />
        <text
          textAnchor={'middle'}
          x={x}
          y={y}
          dominantBaseline={'middle'}
          fontSize={10}>
          {format('.2s')(value)}
        </text>
      </g>
    );
  });

  return (
    <div
      className='relative h-64 md:h-full'
      ref={containerRef}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}>
        <g transform={`translate(${width / 2.1}, ${height / 2})`}>{arcs}</g>
      </svg>
      {element && <ChartIndicatorUI {...element} />}
    </div>
  );
}
