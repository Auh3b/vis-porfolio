import PageContainer from '../../components/common/PageContainer';
import { Button, Grid2, Typography } from '@mui/material';
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
      <Grid2
        container
        height={'100%'}
        width={'100%'}
        wrap='nowrap'>
        <SlidePanel></SlidePanel>
        <CatalogueItems
          isLoading={isLoading}
          data={catalogue}
        />
      </Grid2>
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
    <Grid2
      container
      direction={'column'}>
      <Typography
        mb={4}
        textTransform={'uppercase'}
        variant='h5'>
        Catalogue
      </Typography>
      <Grid2
        container
        gap={6}>
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
      </Grid2>
    </Grid2>
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
