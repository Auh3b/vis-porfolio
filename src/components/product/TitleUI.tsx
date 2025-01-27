import { Skeleton, Typography } from '@mui/material';

interface TitleUIProps {
  title: string;
}

export default function TitleUI(props: TitleUIProps) {
  const { title } = props;
  return (
    <Typography
      variant='h6'
      mb={4}>
      {title}
    </Typography>
  );
}

export function TitleUILoading() {
  return (
    <Typography
      variant='h5'
      mb={4}>
      {<Skeleton animation={'wave'} />}
    </Typography>
  );
}
