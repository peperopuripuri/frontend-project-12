import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import ChatPage from './ChatPage';
import LoginPage from './LoginPage';
import NotFoundPage from './NotFoundPage';
import SignUpPage from './SignUpPage';
import appRoutes from '../utils/appRoutes';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path={appRoutes.home} element={<ChatPage />} />
        </Route>
        <Route path={appRoutes.login} element={<LoginPage />} />
        <Route path={appRoutes.error} element={<NotFoundPage />} />
        <Route path={appRoutes.signup} element={<SignUpPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
