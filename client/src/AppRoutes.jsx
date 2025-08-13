import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/index.jsx';
import Login from './pages/login/index.jsx';
import Signup from './pages/signup/index.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

 const AppRoutes = () => {

  return (
    <Routes>
            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            }>
            </Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
            {/* <Route path="*" element={<Default />}></Route> */}
    </Routes>
  );
}

export default AppRoutes;
