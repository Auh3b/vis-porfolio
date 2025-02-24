import { TitleUILoading } from './TitleUI';
import { TagsUILoading } from './TagsUI';

export default function ProductLoading() {
  return (
    <div className='flex flex-col gap-4'>
      <TitleUILoading />
      <TagsUILoading />
    </div>
  );
}
