import { BeatLoader } from 'react-spinners';

const PageLoader = ({ loading = true, size = 12, color = '#7c3aed' }) => {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <BeatLoader color={color} size={size} />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
