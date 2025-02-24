import ViewIcon from '../customIcons/ViewIcon';
import ProductViewModal from './ProductViewModal';
import { useState } from 'react';

interface ProductImageProps {
  src?: string;
  link?: string;
  title?: string;
}

export default function ProductImage(props: ProductImageProps) {
  const { src, link, title } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className='flex flex-col w-full px-4'>
      <img
        src={src}
        alt={title}
        width={'100%'}
        className='h-80 border border-gray-700'
        style={{ marginBottom: '16px' }}
      />
      <button
        onClick={() => setOpen(true)}
        className='flex gap-2 items-center ml-auto hover:cursor-pointer'>
        view
        {<ViewIcon />}
      </button>
      <ProductViewModal
        onClose={() => setOpen(false)}
        src={'https://30-day-map-challenge.netlify.app/'}
        title={title || ''}
        open={open}
        type={'link'}
      />
    </div>
  );
}
