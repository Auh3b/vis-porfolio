import { useLocation } from 'react-router';
import supabase, { ProjectSchema } from '../../../utils/supabase';
import { useEffect, useState } from 'react';
import { Chip, Grid2, Typography } from '@mui/material';
import PageContainer from '../../../components/common/PageContainer';

export default function Project() {
  const [data, setData] = useState<ProjectSchema | null>(null);

  const { pathname } = useLocation();

  const id = pathname.split('/').at(-1);

  useEffect(() => {
    if (id)
      (async function () {
        const { data: result } = await supabase
          .from('projects')
          .select()
          .eq('id', id)
          .returns<ProjectSchema[]>();
        if (result) setData(result[0]);
      })();
  }, [id]);
  console.log(data);
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
              <Typography mb={2}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea
                explicabo laudantium perferendis enim quo maxime rem at soluta
                error est, corrupti optio ipsam similique consequatur. Quibusdam
                sed odio soluta ab.
              </Typography>
              <Grid2
                container
                gap={2}>
                {data.tags?.split(',').map((d) => (
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
