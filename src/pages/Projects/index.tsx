import { useEffect, useState } from 'react';
import supabase, { ProjectSchema } from '../../utils/supabase';
import { Button, Grid2 } from '@mui/material';
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
      <div className='flex w-full h-full flex-col md:flex-row'>
        <SlidePanel />
        <div className='p-4 flex flex-col'>
          <p className='uppercase text-2xl mb-4'>Projects</p>
          <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
          </div>
        </div>
      </div>
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
