import { Fragment, PropsWithChildren } from 'react';
import Divider from '../common/Divider';

interface MapContentTitleProps {
  title: string;
  wrapperClasses?: string;
}

export default function MapContentTitle(
  props: PropsWithChildren<MapContentTitleProps>,
) {
  const { title, wrapperClasses = '', children } = props;
  return (
    <div className={`${wrapperClasses}`}>
      <span className='map-content-title'>{title}</span>
      {children && (
        <Fragment>
          <Divider />
          <div className='map-content-description-wrapper'>{children}</div>
        </Fragment>
      )}
    </div>
  );
}
