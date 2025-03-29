import { useCallback } from 'react';
import { ImMinus, ImPlus } from 'react-icons/im';
import { MapRef } from 'react-map-gl';

interface CustomNavigationPanelProps {
  mapRef?: MapRef;
}

export default function CustomNavigationPanel(
  props: CustomNavigationPanelProps,
) {
  const { mapRef } = props;
  const handleZoomIn = useCallback(() => {
    if (!mapRef) return;
    mapRef.zoomIn();
  }, [mapRef]);

  const handleZoomOut = useCallback(() => {
    if (!mapRef) return;
    mapRef.zoomOut();
  }, [mapRef]);

  return (
    <div className='paper absolute right-4 top-4 flex flex-col'>
      <button
        className='p-3 button'
        onClick={handleZoomIn}>
        <ImPlus />
      </button>
      <hr className='border-b-0.5 border-gray-600' />
      <button
        className='p-3 button'
        onClick={handleZoomOut}>
        <ImMinus />
      </button>
    </div>
  );
}
