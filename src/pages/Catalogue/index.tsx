import PageContainer from '../../components/common/PageContainer';
import { Button, Grid2 } from '@mui/material';
import SlidePanel from '../../components/common/SlidePanel';
import { useEffect, useState } from 'react';
import supabase, { CatalogueSchema } from '../../utils/supabase';
import TitleUI from '../../components/product/TitleUI';
import TagsUI from '../../components/product/TagsUI';
import DotArrow from '../../components/customIcons/DotArrow';
import { Link } from 'react-router';
import ProductLoading from '../../components/product/ProductLoading';

export default function Catalogue() {
  const [catalogue, setCatalogue] = useState<CatalogueSchema[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCatalogue = async () => {
    setIsLoading(true);
    let { data: catalogue } = await supabase
      .from('catalogue')
      .select('*')
      .returns<CatalogueSchema[]>();
    setCatalogue(catalogue);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  return (
    <PageContainer>
      <div className='flex w-full h-full flex-col md:flex-row'>
        <SlidePanel></SlidePanel>
        <CatalogueItems
          isLoading={isLoading}
          data={catalogue}
        />
      </div>
    </PageContainer>
  );
}

interface CatalogueProps {
  isLoading?: boolean;
  data: CatalogueSchema[] | null;
}

function CatalogueItems(props: CatalogueProps) {
  const { isLoading, data } = props;
  return (
    <div className='flex flex-col p-4'>
      <p className='text-2xl uppercase mb-4'>Catalogue</p>
      <div className='grid gap-8  md:grid-cols-2 lg:grid-cols-4'>
        {!isLoading && data
          ? data.map((d) => (
              <CatalogueProduct
                key={d.id}
                {...d}
              />
            ))
          : Array(4)
              .fill('a')
              .map((_d, i) => <ProductLoading key={i} />)}
      </div>
    </div>
  );
}

function CatalogueProduct(props: CatalogueSchema) {
  const { id, name, technologies } = props;
  return (
    <Grid2
      container
      direction={'column'}>
      <TitleUI title={name} />
      <TagsUI tags={technologies?.split(',') || []} />
      <Button
        endIcon={<DotArrow />}
        sx={{ alignSelf: 'end' }}
        component={Link}
        to={id}>
        Explore
      </Button>
    </Grid2>
  );
}
