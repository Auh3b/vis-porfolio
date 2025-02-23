import { ReactNode } from 'react';
import {
  LoadingType,
  LoadingUIProps,
} from '../../../utils/types/component.types';
import { useSpring, animated, useSprings } from '@react-spring/web';
import { curveStep, line, randomInt, scaleLinear } from 'd3';

const loadingComponent: { [k: string]: ReactNode } = {
  [LoadingType.PAGE]: <PageLoading />,
  [LoadingType.COMPONENT]: <LetteredLoading />,
  [LoadingType.CHART]: <ChartLoading />,
};

export default function Loading(props: LoadingUIProps) {
  const { type } = props;

  return (
    <div className='absolute w-full h-full flex items-center justify-center'>
      {loadingComponent[type]}
    </div>
  );
}

function PageLoading() {
  const topRectSprings = useSpring({
    from: {
      x: 0,
      y: 0,
    },
    to: [{ x: 120 }, { y: 40 }, { x: 0 }, { y: 0 }],
    loop: true,
  });
  const bottomRectSprings = useSpring({
    from: {
      x: 120,
      y: 40,
    },
    to: [{ x: 0 }, { y: 0 }, { x: 120 }, { y: 40 }],
    loop: true,
  });
  return (
    <svg
      width='140'
      height='60'
      xmlns='http://www.w3.org/2000/svg'>
      <animated.rect
        width={20}
        height={20}
        {...topRectSprings}
      />
      <rect
        width={100}
        height={20}
        x={20}
        y={20}
      />
      <animated.rect
        width={20}
        height={20}
        {...bottomRectSprings}
      />
    </svg>
  );
}

function LetteredLoading() {
  const width = 100;
  const height = 10;
  const [props] = useSprings(5, (i) => ({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    delay: i * 250,
    loop: {
      reverse: true,
      delay: 250,
    },
  }));
  return (
    <div className='flex gap-1 items-end'>
      <span>Loading</span>
      <svg
        width={width}
        height={height}>
        {props.map((prop, i) => (
          <animated.rect
            key={i}
            width={10}
            height={10}
            x={i * 15}
            {...prop}
          />
        ))}
      </svg>
    </div>
  );
}

function ChartLoading() {
  const height = 40;
  const width = 84;
  const padding = 5;
  const length = 10;
  const max = 50;
  const values = Array(length)
    .fill(0)
    .map(() =>
      Array(length)
        .fill(0)
        .map((_d, i) => [(i / length) * max, randomInt(max)()]),
    );
  const xScale = scaleLinear()
    .domain([0, max])
    .range([padding, width - padding]);

  const yScale = scaleLinear()
    .domain([0, max])
    .range([padding, height - padding]);

  const lineGenerator = line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(curveStep);

  const paths = values.map((l) => ({ d: lineGenerator(l) || ' ' }));

  const start = paths[0];

  const tos = paths.filter((_d, i) => i);

  const path = useSpring({
    from: start,
    to: tos,
    loop: true,
  });
  return (
    <svg
      width={width}
      height={height}
      className='border-b-2'>
      <animated.path
        fill={'none'}
        stroke={'black'}
        strokeWidth={2}
        {...path}
      />
    </svg>
  );
}
