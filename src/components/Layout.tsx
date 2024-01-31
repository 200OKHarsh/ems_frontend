import { Menu } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Toaster } from './ui/toaster';
import { AuthContext } from '@/context/auth-context';
import { useToast } from './ui/use-toast';

const Layout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [navMenu, setNavMenu] = useState<boolean>(false);
  const { authenticated, setAuthenticated, setToken } = useContext(AuthContext);
  const isAdmin = JSON.parse(localStorage.getItem('user') || '{}');
  const intials = isAdmin?.user?.name.split(' ').map((name: string) => name[0]).join('').toUpperCase() ?? '';
  const menus = [
    { title: 'Login', path: '/login', visible: !authenticated },
    { title: 'Dashboard', path: '/', visible: authenticated },
    { title: 'Register', path: '/register', visible: authenticated && isAdmin.user.role === 'admin' },
    { title: 'Leave', path: '/leave', visible: authenticated },
  ];
  const logout = () => {
    try {
      toast({
        variant: 'success',
        title: 'Logged Out!',
      });
      setToken('');
      setAuthenticated(false);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };
  if (!authenticated) return <Navigate to="/login" replace />;

  return (
    <div>
      <nav className="bg-white w-full border-b md:border-0">
        <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Link to="/">
              <h1 className="text-3xl font-bold text-primary">EMS</h1>
            </Link>
            <div className="md:hidden">
              <button
                className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                onClick={() => setNavMenu(!navMenu)}
              >
                <Menu />
              </button>
            </div>
          </div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              navMenu ? 'block' : 'hidden'
            }`}
          >
            <ul className="justify-end items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {authenticated && (
                <li className="text-gray-600 hover:text-primary">
                  <button onClick={logout}>Log Out</button>
                </li>
              )}
              {menus
                .filter((item) => item.visible)
                .map((item, idx) => (
                  <li key={idx} className="text-gray-600 hover:text-primary">
                    <Link to={item.path}>{item.title}</Link>
                  </li>
                ))}
              <Link to={`/user/${isAdmin.user.userId}`}>
              <Avatar>
                <AvatarFallback>{intials}</AvatarFallback>
              </Avatar></Link>
            </ul>
          </div>
        </div>
      </nav>

      <hr />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default Layout;
