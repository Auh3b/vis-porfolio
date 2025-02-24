import { SvgIcon, SxProps } from '@mui/material';

interface SVGSxProps {
  sxProps?: SxProps;
}

export default function DotArrow(props: SVGSxProps) {
  const { sxProps } = props;
  return (
    <SvgIcon
      viewBox='0 0 40 60'
      className='fill-indigo-600'
      sx={sxProps}>
      <rect
        width={10}
        height={10}
      />
      <rect
        width={10}
        height={10}
        x={0}
        y={20}
      />
      <rect
        width={10}
        height={10}
        x={30}
        y={20}
      />
      <rect
        width={10}
        height={10}
        x={0}
        y={40}
      />
    </SvgIcon>
  );
}

export function LeftDotArrow(props: SVGSxProps) {
  return (
    <DotArrow sxProps={{ transform: 'rotate(0.5turn)', ...props.sxProps }} />
  );
}

export function UpDotArrow(props: SVGSxProps) {
  return (
    <DotArrow sxProps={{ transform: 'rotate(0.75turn)', ...props.sxProps }} />
  );
}

export function DownDotArrow(props: SVGSxProps) {
  return (
    <DotArrow sxProps={{ transform: 'rotate(0.75turn)', ...props.sxProps }} />
  );
}
