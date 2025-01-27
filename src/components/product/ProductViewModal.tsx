import { Modal, Paper } from '@mui/material';

interface ProductViewModalProps extends ViewProps {
  open: boolean;
  type: 'images' | 'link';
}
export default function ProductViewModal(props: ProductViewModalProps) {
  const { open, type, ...rest } = props;
  return (
    <Modal open={open}>
      <Paper>
        {type === 'link' ? <LinkView {...rest} /> : <ImageView {...rest} />}
      </Paper>
    </Modal>
  );
}

interface ViewProps {
  src: string;
  title: string;
}

function LinkView(props: ViewProps) {
  return (
    <iframe
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
