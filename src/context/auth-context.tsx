import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  children?: ReactNode;
};

type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void;
  token: string;
  setToken: (newState: string) => void;
  userId: string;
  setuserId: (newState: string) => void;
  userRole: string;
  setuserRole: (newState: string) => void;
};

const initialValue = {
  authenticated: false,
  setAuthenticated: () => {},
  token: '',
  setToken: () => {},
  userId: '',
  setuserId: () => {},
  userRole: '',
  setuserRole: () => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue.authenticated
  );
  const [token, setToken] = useState(initialValue.token);
  const [userId, setuserId] = useState(initialValue.userId);
  const [userRole, setuserRole] = useState(initialValue.userRole);

  const navigate = useNavigate();
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('user') || '{}');
    if (Object.keys(localData).length !== 0) {
      setAuthenticated(true);
      setToken(localData.token);
      setuserId(localData.userId);
      setuserRole(localData.role);
      navigate('/');
    } else {
      setAuthenticated(false);
    }
  }, [authenticated]);
  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        token,
        setToken,
        userId,
        setuserId,
        userRole,
        setuserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
