import { useLocation } from 'react-router';
import supabase, { ProjectSchema } from '../../../utils/supabase';
import { useEffect, useState } from 'react';
import { Box, Button, Chip, Grid2, Typography } from '@mui/material';
import PageContainer from '../../../components/common/PageContainer';
import SlidePanel from '../../../components/common/SlidePanel';
import { LeftDotArrow } from '../../../components/customIcons/DotArrow';
import { Link } from 'react-router';
import ProductLoading from '../../../components/product/ProductLoading';
import ProductImage from '../../../components/product/ProductImage';

export default function Project() {
  const [data, setData] = useState<ProjectSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { pathname } = useLocation();

  const id = pathname.split('/').at(-1);

  useEffect(() => {
    if (id)
      (async function () {
        setIsLoading(true);
        const { data: result } = await supabase
          .from('projects')
          .select()
          .eq('id', id)
          .returns<ProjectSchema[]>();
        if (result) setData(result[0]);
        setIsLoading(false);
      })();
  }, [id]);

  return (
    <PageContainer>
      <Grid2
        container
        width={'100%'}
        height={'100%'}
        wrap='nowrap'>
        <SlidePanel>
          <Button
            component={Link}
            to={'/projects'}
            startIcon={<LeftDotArrow />}>
            Back to projects
          </Button>
        </SlidePanel>
        <Grid2 sx={{ pr: 4 }}>
          {!isLoading && data ? <ProjectView {...data} /> : <ProductLoading />}
        </Grid2>
        <Box sx={{ width: 350 }}>
          <ProductImage title={data?.name} />
        </Box>
      </Grid2>
    </PageContainer>
  );
}

function ProjectView(props: ProjectSchema) {
  const { name, tags } = props;
  return (
    <Box>
      <Typography
        variant='h4'
        mb={4}>
        {name}
      </Typography>
      <Typography mb={2}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea explicabo
        laudantium perferendis enim quo maxime rem at soluta error est, corrupti
        optio ipsam similique consequatur. Quibusdam sed odio soluta ab.
      </Typography>
      <Grid2
        container
        gap={2}>
        {tags?.split(',').map((d) => (
          <Chip
            sx={{
              borderRadius: 0,
            }}
            key={d}
            label={d}
          />
        ))}
      </Grid2>
    </Box>
  );
}
