interface TitleUIProps {
  title: string;
}

export default function TitleUI(props: TitleUIProps) {
  const { title } = props;
  return <p className='text-xl'>{title}</p>;
}

export function TitleUILoading() {
  return <div className='w-full animate-pulse h-4 bg-gray-400'></div>;
}
