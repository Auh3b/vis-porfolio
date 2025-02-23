import { MutableRefObject, PropsWithChildren } from 'react';

interface IndicatorContainerProps {
  title: string;
  chartRef: MutableRefObject<HTMLDivElement | null>;
}

export default function IndicatorContainer(
  props: PropsWithChildren<IndicatorContainerProps>,
) {
  const { title, chartRef, children } = props;
  return (
    <div className='flex flex-col p-2 border border-gray-200'>
      <span className='text-sm font-medium'>{title}</span>
      <div
        ref={chartRef}
        className='grow'>
        {children}
      </div>
    </div>
  );
}
