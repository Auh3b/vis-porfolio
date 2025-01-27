import { Skeleton, Typography } from '@mui/material';

interface DescriptionUIProps {
  content: string;
}

export default function DescriptionUI(props: DescriptionUIProps) {
  const { content } = props;
  return <Typography mb={4}>{content}</Typography>;
}
export function DescriptionUILoading() {
  return (
    <>
      {Array(4)
        .fill('a')
        .map(() => (
          <Typography mb={4}>
            <Skeleton animation={'wave'} />
          </Typography>
        ))}
    </>
  );
}
