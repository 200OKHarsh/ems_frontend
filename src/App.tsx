import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/login/Login';
import Register from '@/pages/register/Register';
import Layout from './components/Layout';
import PageNotFound from './pages/PageNotFound';
import EditProfile from './pages/EditProfile';
import { useContext } from 'react';
import { AuthContext } from './context/auth-context';
import Leave from './pages/leave/Leave';

export default function App() {
  const { authenticated } = useContext(AuthContext);
  return (
    <div>
      <Routes>
        {!authenticated && <Route path="login" element={<Login />} />}
        <Route path="/" element={<Layout />}>
          {authenticated && <Route index element={<Dashboard />} />}
          {authenticated && <Route path="register" element={<Register />} />}
          {authenticated && <Route path="user/:userId" element={<EditProfile />} />}
          {authenticated && <Route path="leave" element={<Leave />} />}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
