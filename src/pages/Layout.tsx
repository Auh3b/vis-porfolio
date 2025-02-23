import { Outlet } from 'react-router';
import Header from '../components/Header';
import { Suspense } from 'react';
import Loading from '../components/common/loading';
import { LoadingType } from '../utils/types/component.types';

export default function Layout() {
  return (
    <div className='flex flex-col w-screen h-screen overflow-x-hidden overflow-y-scroll md:overflow-y-hidden'>
      <Header />
      <div className='relative flex grow'>
        <Suspense fallback={<Loading type={LoadingType.CHART} />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
