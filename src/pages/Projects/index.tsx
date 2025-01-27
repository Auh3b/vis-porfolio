import { useEffect, useState } from 'react';
import supabase, { ProjectSchema } from '../../utils/supabase';
import { Box, Button, Chip, Grid2, Typography } from '@mui/material';
import PageContainer from '../../components/common/PageContainer';
import { Link } from 'react-router';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectSchema[] | null>(null);

  const fetchProjects = async () => {
    let { data: projects } = await supabase
      .from('projects')
      .select('*')
      .returns<ProjectSchema[]>();
    setProjects(projects);
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  console.log(projects);
  return (
    <PageContainer>
      <Grid2
        container
        wrap='nowrap'
        width={'100%'}
        height={'100%'}>
        <Box width={350}> </Box>
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
            {projects &&
              projects.map(({ id, name, tags }) => (
                <Box key={id}>
                  <Typography
                    variant='subtitle1'
                    mb={2}>
                    {name}
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
                  <Button
                    component={Link}
                    to={`${id}`}>
                    Explore
                  </Button>
                </Box>
              ))}
          </Grid2>
        </Grid2>
      </Grid2>
    </PageContainer>
  );
}
