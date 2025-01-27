import { Grid2, Modal, Paper } from '@mui/material';
import { IframeHTMLAttributes, useEffect, useRef } from 'react';

interface ProductViewModalProps extends ViewProps {
  open: boolean;
  type: 'images' | 'link';
}
export default function ProductViewModal(props: ProductViewModalProps) {
  const { open, type, ...rest } = props;
  return (
    <Modal open={open}>
      <Grid2
        container
        justifyContent={'center'}
        alignItems={'center'}
        height={'100%'}>
        <Paper sx={{ width: '95%', height: '95%', p: 2 }}>
          {type === 'link' ? <LinkView {...rest} /> : <ImageView {...rest} />}
        </Paper>
      </Grid2>
    </Modal>
  );
}

interface ViewProps {
  src: string;
  title: string;
}

function LinkView(props: ViewProps) {
  const iframeRef = useRef<IframeHTMLAttributes<HTMLHtmlElement> | null>();
  useEffect(() => {
    if (iframeRef.current) {
      console.log(iframeRef.current.content);
    }
  }, [iframeRef]);
  return (
    <iframe
      ref={iframeRef}
      style={{ border: 0 }}
      width={'100%'}
      height={'100%'}
      {...props}></iframe>
  );
}

function ImageView(props: ViewProps) {
  const { src, title } = props;
  return (
    <img
      src={src}
      alt={title}
      width={'100%'}
      height={'100%'}
      loading={'lazy'}
    />
  );
}
