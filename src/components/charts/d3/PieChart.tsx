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
import { grey } from '@mui/material/colors';
import ChartIndicatorUI from './components/ChartIndicatorUI';
import { Box } from '@mui/material';

export default function PieChart(props: ChartProps) {
  const [element, setElement] = useState<AttributeIndicatorItems | null>(null);

  const containerRef = useRef<HTMLDivElement>();

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
  ).map(({ startAngle, endAngle, value, index }) => {
    const label = _data.sort((a, b) => descending(a.value, b.value))[index]
      .label;

    const fill = colorScale(value);

    const d = arcGenerator({
      startAngle,
      endAngle,
      innerRadius: radius * 0.5,
      outerRadius: radius - 20,
    });

    const [x, y] = arcGenerator.centroid({
      startAngle,
      endAngle,
      innerRadius: radius,
      outerRadius: radius - 10,
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
    <Box
      position={'relative'}
      ref={containerRef}>
      <svg
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        width={width}
        height={height}>
        <g>{arcs}</g>
      </svg>
      {element && <ChartIndicatorUI {...element} />}
    </Box>
  );
}
