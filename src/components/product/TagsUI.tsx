import { Chip, Grid2, Skeleton } from '@mui/material';

interface TagsUIProps {
  tags: string[];
}

export default function TagsUI(props: TagsUIProps) {
  const { tags } = props;
  return (
    <Grid2
      container
      mb={2}
      gap={2}>
      {tags.map((d) => (
        <Chip
          sx={{
            borderRadius: 0,
          }}
          key={d}
          label={d}
        />
      ))}
    </Grid2>
  );
}

export function TagsUILoading() {
  return (
    <Grid2
      container
      gap={2}>
      {Array(3)
        .fill('a')
        .map((_d) => (
          <Chip
            sx={{ width: 50, borderRadius: 0 }}
            label={
              <Skeleton
                variant={'rectangular'}
                animation={'wave'}
              />
            }
          />
        ))}
    </Grid2>
  );
}
