import { useLocation } from 'react-router';
import supabase, { CatalogueSchema } from '../../../utils/supabase';
import { useEffect, useState } from 'react';
import { Chip, Grid2, Typography } from '@mui/material';
import PageContainer from '../../../components/common/PageContainer';

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
        height={'100%'}
        wrap='nowrap'>
        <Grid2 width={350}></Grid2>
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
            </>
          )}
        </Grid2>
      </Grid2>
    </PageContainer>
  );
}
