import { Grid2, IconButton, Modal, Paper, Typography } from '@mui/material';
import { IframeHTMLAttributes, useEffect, useRef } from 'react';
import CloseIcon from '../customIcons/CloseIcon';

interface ProductViewModalProps extends ViewProps {
  open: boolean;
  type: 'images' | 'link';
  onClose: () => void;
}
export default function ProductViewModal(props: ProductViewModalProps) {
  const { open, type, onClose, ...rest } = props;
  return (
    <Modal open={open}>
      <Grid2
        container
        justifyContent={'center'}
        alignItems={'center'}
        height={'100%'}>
        <Paper sx={{ width: '95%', height: '95%', p: 2 }}>
          <Grid2
            container
            wrap='nowrap'
            direction={'column'}
            height={'100%'}>
            <Grid2
              container
              justifyContent={'space-between'}>
              <Typography>{rest.title}</Typography>
              <IconButton
                color={'error'}
                onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Grid2>
            {type === 'link' ? <LinkView {...rest} /> : <ImageView {...rest} />}
          </Grid2>
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
      // @ts-expect-error
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
