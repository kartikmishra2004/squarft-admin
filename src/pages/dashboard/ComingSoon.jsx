import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import Button from '../../components/Button';

const ComingSoon = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mb-4">
        <Construction size={40} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-gray-500 max-w-sm mx-auto font-medium">
          We are currently working hard to bring this feature to life. Stay tuned for updates!
        </p>
      </div>

      <div className="pt-4">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ComingSoon;
