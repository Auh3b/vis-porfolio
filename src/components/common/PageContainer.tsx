import { PropsWithChildren } from 'react';

export default function PageContainer(props: PropsWithChildren) {
  const { children } = props;
  return <div className='grow'>{children}</div>;
}
