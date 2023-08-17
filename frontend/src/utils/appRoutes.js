import { Route, Routes } from 'react-router-dom';
import AuthProvider from '../components/AuthProvider';
import PrivateRoute from '../components/PrivateRoute';
import ChatPage from '../components/ChatPage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import SignUpPage from '../components/SignUpPage';

const AppRoutes = () => (
  <AuthProvider>
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<ChatPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  </AuthProvider>
);

export default AppRoutes;
