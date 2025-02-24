import { Fragment, PropsWithChildren, useState } from 'react';
import DotArrow, { DownDotArrow } from '../customIcons/DotArrow';

export default function SlidePanel(props: PropsWithChildren) {
  return (
    <Fragment>
      <Desktop>{props.children}</Desktop>
      <Mobile>{props.children}</Mobile>
    </Fragment>
  );
}

function Desktop(props: PropsWithChildren) {
  return (
    <div className='hidden md:block h-full min-w-80'>{props.children}</div>
  );
}

function Mobile(props: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className='md:hidden w-full relative'>
      <button
        className='p-2 border-gray-500 border-t border-b w-full flex gap-2 items-center hover:cursor-pointer'
        onClick={handleClick}>
        {open ? <DownDotArrow /> : <DotArrow />}
        Menu
      </button>
      <div
        className={` pr-2 pl-10 transition-all duration-300  border-gray-500 bg-gray-800  absolute w-full z-50 overflow-hidden ${
          open ? 'h-full border-b' : 'h-0'
        }`}>
        {props.children}
      </div>
    </div>
  );
}
