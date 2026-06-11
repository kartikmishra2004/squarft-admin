import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import loginBg from '../../assets/login-bg.png';
import logo from '../../assets/logo.png';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' or 'super_admin'
  
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginStart());

    setTimeout(() => {
      if (selectedRole === 'admin' && mobileNumber === '+919988776655' && password === 'password') {
        dispatch(loginSuccess({ name: 'Kartik (Admin)', role: 'admin', mobile: mobileNumber, branchId: 'B02' }));
        navigate('/dashboard');
      } else if (selectedRole === 'super_admin' && mobileNumber === '+917788996655' && password === 'password') {
        dispatch(loginSuccess({ name: 'Owner (Super Admin)', role: 'super_admin', mobile: mobileNumber }));
        navigate('/dashboard');
      } else {
        dispatch(loginFailure(`Invalid ${selectedRole === 'admin' ? 'Admin' : 'Super Admin'} credentials`));
      }
    }, 1000);
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
            <p className="text-gray-500 text-xs">Please select your account type and enter credentials.</p>
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
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all relative z-10 ${selectedRole === 'admin' ? 'text-brand' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User size={16} />
              Admin
            </button>
            <button 
              type="button"
              onClick={() => setSelectedRole('super_admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all relative z-10 ${selectedRole === 'super_admin' ? 'text-brand' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Shield size={16} />
              Super Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Mobile Number"
              placeholder={selectedRole === 'admin' ? '+919988776655' : '+917788996655'}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              icon={Phone}
              error={error && !mobileNumber ? 'Mobile number is required' : null}
            />

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-gray-600 ml-0.5">Password</label>
              <Input 
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                error={error ? error : null}
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-2">
              Login as {selectedRole === 'admin' ? 'Admin' : 'Super Admin'}
            </Button>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="google" onClick={() => {}} className="py-2.5">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                <span className="text-[11px]">Google</span>
              </Button>
              <Button variant="outline" onClick={() => {}} className="py-2.5">
                <ArrowRight size={16} className="text-gray-400" />
                <span className="text-[11px]">SSO</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default Login;
