export default function Logo() {
  return (
    <svg
      width='140'
      height='60'
      className='fill-indigo-600'
      xmlns='http://www.w3.org/2000/svg'>
      <rect
        width={20}
        height={20}
      />
      <rect
        width={100}
        height={20}
        x={20}
        y={20}
      />
      <rect
        width={20}
        height={20}
        x={120}
        y={40}
      />
    </svg>
  );
}
