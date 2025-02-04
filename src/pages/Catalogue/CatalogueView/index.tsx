import { useLocation } from 'react-router';
import supabase, { CatalogueSchema } from '../../../utils/supabase';
import { useEffect, useState } from 'react';
import { Box, Button, Chip, Grid2, Typography } from '@mui/material';
import PageContainer from '../../../components/common/PageContainer';
import SlidePanel from '../../../components/common/SlidePanel';
import { LeftDotArrow } from '../../../components/customIcons/DotArrow';
import { Link } from 'react-router';

export default function CatalogueView() {
  const [data, setData] = useState<CatalogueSchema | null>(null);
  const { pathname } = useLocation();
  const id = pathname.split('/').at(-1);

  useEffect(() => {
    if (id)
      (async function () {
        const { data: result } = await supabase
          .from('catalogue')
          .select()
          .eq('id', id)
          .returns<CatalogueSchema[]>();
        if (result) setData(result[0]);
      })();
  }, [id]);

  return (
    <PageContainer>
      <Grid2
        container
        width={'100%'}
        height={'100%'}>
        <SlidePanel>
          <Button
            component={Link}
            to={'/catalogue'}
            startIcon={<LeftDotArrow />}>
            Back to Catalogue
          </Button>
        </SlidePanel>
        <Grid2>
          {data && (
            <>
              <Typography
                variant='h4'
                mb={4}>
                {data.name}
              </Typography>
              <Typography mb={2}>{data.description}</Typography>
              <Grid2
                container
                gap={2}>
                {data.technologies?.split(',').map((d) => (
                  <Chip
                    sx={{
                      borderRadius: 0,
                    }}
                    key={d}
                    label={d}
                  />
                ))}
              </Grid2>
              <Typography sx={{ mt: 2 }}>Options:</Typography>
              <Grid2
                container
                direction={'column'}>
                {data.options?.split(';').map((d) => (
                  <Box key={d}>
                    <Typography variant='caption'>- {d}</Typography>
                  </Box>
                ))}
              </Grid2>
            </>
          )}
        </Grid2>
      </Grid2>
    </PageContainer>
  );
}
