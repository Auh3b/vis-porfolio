import { useEffect, useState } from 'react';
import supabase, { ProjectSchema } from '../../utils/supabase';
import { Box, Button, Chip, Grid2, Typography } from '@mui/material';
import PageContainer from '../../components/common/PageContainer';
import { Link } from 'react-router';
import DotArrow from '../../components/customIcons/DotArrow';
import ProductLoading from '../../components/product/ProductLoading';
import TagsUI from '../../components/product/TagsUI';
import TitleUI from '../../components/product/TitleUI';
import SlidePanel from '../../components/common/SlidePanel';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectSchema[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    let { data: projects } = await supabase
      .from('projects')
      .select('*')
      .returns<ProjectSchema[]>();
    setProjects(projects);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <PageContainer>
      <Grid2
        container
        width={'100%'}
        height={'100%'}>
        <SlidePanel />
        <Grid2
          container
          direction={'column'}
          wrap='nowrap'>
          <Typography
            variant='h5'
            mb={4}
            textTransform={'uppercase'}>
            Projects
          </Typography>
          <Grid2
            container
            gap={8}>
            {!isLoading && projects
              ? projects.map((d) => (
                  <ProjectProduct
                    key={d.id}
                    {...d}
                  />
                ))
              : Array(4)
                  .fill('a')
                  .map((_d, i) => <ProductLoading key={i} />)}
          </Grid2>
        </Grid2>
      </Grid2>
    </PageContainer>
  );
}

function ProjectProduct(props: ProjectSchema) {
  const { id, name, tags } = props;
  return (
    <Grid2
      container
      direction={'column'}>
      <TitleUI title={name} />
      <TagsUI tags={tags?.split(',') || []} />
      <Button
        sx={{ alignSelf: 'end' }}
        endIcon={<DotArrow />}
        component={Link}
        to={`${id}`}>
        Explore
      </Button>
    </Grid2>
  );
}
