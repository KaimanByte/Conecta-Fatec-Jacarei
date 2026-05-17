import { Navigate, Outlet } from 'react-router-dom';
import { usePrivateAccess, type AccessValidator } from '../hooks/usePrivateAccess';
import { LoadingState } from './common/LoadingState';

type PrivateRouteProps = {
  validator: AccessValidator;
  setToken?: (value: string | null) => void;
};

const PrivateRoute = ({ validator, setToken }: PrivateRouteProps) => {
  const status = usePrivateAccess(validator, setToken);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
