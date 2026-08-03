import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Mail, Lock, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginWithPassword, clearError } from '../../store/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import loginBg from '../../assets/login-bg.png';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' or 'super_admin'
  const [formErrors, setFormErrors] = useState({});

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when switching roles
  useEffect(() => {
    dispatch(clearError());
    setFormErrors({});
  }, [selectedRole, dispatch]);

  // Clear errors when user types
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await dispatch(loginWithPassword({ email: email.trim(), password, role: selectedRole })).unwrap();
      // Navigation is handled by the useEffect hook
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Side: Visual / Info */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        <img
          src={loginBg}
          alt="Real Estate"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-t from-indigo-950 via-transparent to-transparent opacity-90"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-1">
            <img src={logo} alt="Squar Ft" className="h-12 w-auto" />
            <span className="font-bold text-xl tracking-tight text-white uppercase">Squar Ft</span>
          </div>

          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-4 leading-tight"
            >
              Real Estate <br /> Management Redefined.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-indigo-100 text-base leading-relaxed mb-6"
            >
              The enterprise solution for property developers and estate managers.
            </motion.p>
          </div>

          <div className="text-indigo-300 text-xs flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>© 2024 Squar Ft</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src={logo} alt="Squar Ft" className="h-8 w-auto" />
            <span className="font-bold text-lg tracking-tight text-gray-800 uppercase">Squar Ft</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 font-display">Sign In</h1>
            <p className="text-gray-500 text-xs">
              Select your account type and enter your email and password.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6 relative">
            <motion.div
              layoutId="role-bg"
              className="absolute top-1 bottom-1 left-1 right-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm z-0"
              animate={{ x: selectedRole === 'admin' ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all relative z-10 ${selectedRole === 'admin' ? 'text-brand' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User size={16} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('super_admin')}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all relative z-10 ${selectedRole === 'super_admin' ? 'text-brand' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Shield size={16} />
              Super Admin
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <p className="text-xs font-medium text-red-900">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-gray-600 ml-0.5">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                error={formErrors.email}
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-gray-600 ml-0.5">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                error={formErrors.password}
                disabled={loading}
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-2" disabled={loading}>
              {loading ? 'Signing in...' : `Sign In as ${selectedRole === 'admin' ? 'Admin' : 'Super Admin'}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
