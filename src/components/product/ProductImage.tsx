import { Button, Grid2 } from '@mui/material';
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
    <Grid2
      container
      direction={'column'}
      width={'100%'}
      pr={4}>
      <img
        src={src}
        alt={title}
        width={'100%'}
        height={'250px'}
        style={{ marginBottom: '16px' }}
      />
      <Button
        onClick={() => setOpen(true)}
        endIcon={<ViewIcon />}
        sx={{ ml: 'auto' }}>
        view
      </Button>
      <ProductViewModal
        onClose={() => setOpen(false)}
        src={'https://30-day-map-challenge.netlify.app/'}
        title={title || ''}
        open={open}
        type={'link'}
      />
    </Grid2>
  );
}
