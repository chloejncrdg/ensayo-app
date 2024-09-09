import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Login from './pages/Login';
import Modules from './pages/Modules';
import Practicals from './pages/Practicals';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Tools from './pages/Tools';
import Units from './pages/Units';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/modules/:courseId" element={<Modules />} />
            <Route path="/units/:courseId/:moduleId" element={<PrivateRoute><Units /></PrivateRoute>} />
            <Route path="/lessons/:courseId/:moduleId/:unitId" element={<PrivateRoute><Lessons /></PrivateRoute>} />
            <Route path="/tools/:courseId/:moduleId/:unitId/:toolGroupId" element={<PrivateRoute><Tools /></PrivateRoute>} />
            <Route path="/practicals/:courseId/:moduleId/:unitId/:practicalGroupId" element={<PrivateRoute><Practicals /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();

  // Paths that should not display the navbar and footer
  const hideNavbarAndFooter = ['/login', '/register', '/forgot-password', '/reset-password'];

  return (
    <>
      {!hideNavbarAndFooter.includes(location.pathname) && <Navbar />}
      {children}
      {!hideNavbarAndFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
