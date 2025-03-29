import { Fragment } from 'react';

interface DividerProps {
  orientation?: 'vertical' | 'horizontal';
}
export default function Divider(props: DividerProps) {
  const { orientation = 'horizontal' } = props;
  return (
    <Fragment>
      {orientation === 'horizontal' && (
        <hr className='divider border-b-0.5 my-1' />
      )}
      {orientation === 'vertical' && (
        <div className='h-full divider border-l-0.5 w-0.5'></div>
      )}
    </Fragment>
  );
}
