import { Grid2 } from '@mui/material';
import { TitleUILoading } from './TitleUI';
import { TagsUILoading } from './TagsUI';

export default function ProductLoading() {
  return (
    <Grid2
      container
      width={250}
      direction={'column'}>
      <TitleUILoading />
      <TagsUILoading />
    </Grid2>
  );
}
