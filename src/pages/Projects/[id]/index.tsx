import { useLocation } from 'react-router';
import supabase, { ProjectSchema } from '../../../utils/supabase';
import { useEffect, useState } from 'react';
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
      <div className='flex flex-col md:flex-row w-full h-full'>
        <SlidePanel>
          <Link
            to={'/projects'}
            className='flex gap-2'>
            <LeftDotArrow />
            Back to projects
          </Link>
        </SlidePanel>
        <div className='pr-4'>
          {!isLoading && data ? <ProjectView {...data} /> : <ProductLoading />}
        </div>
        <div className='w-full'>
          <ProductImage title={data?.name} />
        </div>
      </div>
    </PageContainer>
  );
}

function ProjectView(props: ProjectSchema) {
  const { name, tags } = props;
  return (
    <div className='p-4'>
      <p className='text-3xl mb-4'>{name}</p>
      <p className='mb-2'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea explicabo
        laudantium perferendis enim quo maxime rem at soluta error est, corrupti
        optio ipsam similique consequatur. Quibusdam sed odio soluta ab.
      </p>
      <div className='flex gap-4'>
        {tags?.split(',').map((d) => (
          <span className='p-2 bg-gray-700'>{d}</span>
        ))}
      </div>
    </div>
  );
}
