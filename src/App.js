import {Suspense, lazy} from 'react';
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute';
import { LoadUser } from './application/middlewares/auth';
import { useEffect } from 'react';
import {useDispatch} from 'react-redux'
import { Toaster } from 'react-hot-toast';
import BgLoader from './components/BgLoader';


const Auth = lazy(() => import('./pages/Login/index'));
const Home = lazy(() => import('./pages/index'))

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(LoadUser());
  }, []);
  
  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      <Suspense fallback={<BgLoader loading={true}/>}>
        <Routes>
          <Route path="login" element={<Auth />}/>
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<div>Not found</div>}/>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
