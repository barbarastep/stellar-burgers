import { Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, ProtectedRoute } from '@components';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />

      {/* login / register / forgot / reset — доступны только НЕавторизованным */}
      <Route path="/login" element={
        <ProtectedRoute onlyUnAuth>
          <Login />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
  <ProtectedRoute onlyUnAuth>
    <Register />
  </ProtectedRoute>
} />
      <Route path="/forgot-password" element={
  <ProtectedRoute onlyUnAuth>
    <ForgotPassword />
  </ProtectedRoute>
} />
<Route path="/reset-password" element={
  <ProtectedRoute onlyUnAuth>
    <ResetPassword />
  </ProtectedRoute>
} />

      {/* profile / profile/orders — доступны только авторизованным */}
      <Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
<Route path="/profile/orders" element={
  <ProtectedRoute>
    <ProfileOrders />
  </ProtectedRoute>
} />

      <Route path='*' element={<NotFound404 />} />
    </Routes>
  </div>
);

export default App;
