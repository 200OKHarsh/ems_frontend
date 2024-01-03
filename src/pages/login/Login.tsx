import { Toaster } from '@/components/ui/toaster';
import LoginForm from './LoginForm';

const Register = () => {
  return (
    <div className="space-y-6 w-1/2 p-4 mx-auto mt-5">
      <LoginForm />
      <Toaster />
    </div>
  );
};

export default Register;
