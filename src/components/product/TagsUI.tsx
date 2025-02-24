interface TagsUIProps {
  tags: string[];
}

export default function TagsUI(props: TagsUIProps) {
  const { tags } = props;
  return (
    <div className='flex mb-2 gap-2'>
      {tags.map((d) => (
        <span
          key={d}
          className='p-2 bg-gray-400'>
          {d}
        </span>
      ))}
    </div>
  );
}

export function TagsUILoading() {
  return (
    <div className='flex gap-2 w-full h-8'>
      {Array(3)
        .fill('a')
        .map((_d) => (
          <div className='w-full animate-pulse bg-gray-400'></div>
        ))}
    </div>
  );
}
