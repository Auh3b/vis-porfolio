import { useLocation } from 'react-router';

export default function Project() {
  const { pathname } = useLocation();
  console.log(pathname);
  return <div>index</div>;
}
