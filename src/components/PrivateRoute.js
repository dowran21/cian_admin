import BgLoader from './BgLoader';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isLogged, isLoading } = useSelector(state => state.auth);
  if (isLoading) {
    return <BgLoader loading={isLoading}/>;
  }
  if (!isLogged) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
};

export default PrivateRoute;