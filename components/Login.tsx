import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { APP_CONFIG } from '../constants';
import { Lock, Mail, Loader2, Info, CheckCircle2, User as UserIcon, Calendar, ArrowRight, KeyRound, Eye, EyeOff, Moon, Sun, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup' | 'forgot';

const Login = () => {
  const { login, signup, resetPassword, loginWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        const role = adminCode === 'ADMIN123' ? 'ADMIN' : 'STAFF';
        
        const result = await signup(email, password, {
          first_name: firstName,
          last_name: lastName,
          dob: dob,
          role: role
        });
        
        if (!result.success) {
          setError(result.message || 'Error creating account');
          toast.error(result.message || 'Error creating account');
        } else {
          setSuccessMsg('Account created successfully! You can now sign in.');
          toast.success('Account created successfully! You can now sign in.');
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(email);
        if (!result.success) {
          setError(result.message || 'Error sending reset link');
          toast.error(result.message || 'Error sending reset link');
        } else {
          setSuccessMsg('Password reset link sent to your email.');
          toast.success('Password reset link sent to your email.');
          setMode('login');
        }
      } else {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.message || 'Invalid email or password. Note: If you have not created an account, please sign up.');
          toast.error(result.message || 'Invalid email or password');
        } else {
          toast.success('Logged in successfully');
        }
      }
    } catch (err) {
      setError(`An error occurred during ${mode}`);
      toast.error(`An error occurred during ${mode}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast.error('Failed to log in with Google');
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-brand-500 selection:text-black">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-surface border border-surface-border text-slate-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-lg"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Left Side - Massive Typography & Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden bg-surface border-r border-surface-border">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-20 dark:opacity-40 mix-blend-overlay transition-all duration-1000"
          style={{
            backgroundImage: theme === 'dark' 
              ? 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop")'
              : 'url("https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[150px]"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="w-12 h-12 bg-brand-500 text-black rounded-none flex items-center justify-center mb-8 shadow-lg shadow-brand-500/20">
            <Boxes size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-[80px] leading-[0.85] font-bold tracking-tighter uppercase mb-6 text-foreground">
            Enterprise<br />
            <span className="text-brand-500">Control.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md font-mono">
            Advanced inventory management and supplier tracking system. Secure, fast, and reliable.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 text-sm font-mono text-slate-500 uppercase tracking-widest bg-surface/50 backdrop-blur-md p-4 border border-surface-border inline-flex">
            <span>System Status: <span className="text-brand-500 font-bold">Online</span></span>
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span>
            <span>v2.0.4</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {mode === 'login' && 'Enter your credentials to access the system.'}
              {mode === 'signup' && 'Fill in the details to get started.'}
              {mode === 'forgot' && 'Enter your email to receive a reset link.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm flex items-center gap-3"
                >
                  <Info size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-sm flex items-center gap-3"
                >
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">First Name</label>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input
                          type="text"
                          required={mode === 'signup'}
                          className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-600"
                          placeholder=""
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Last Name</label>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input
                          type="text"
                          required={mode === 'signup'}
                          className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-600"
                          placeholder=""
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Date of Birth</label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                      <input
                        type="date"
                        required={mode === 'signup'}
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:[color-scheme:dark]"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Admin Code (Optional)</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        placeholder="Leave blank for staff account"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout className="space-y-2">
              <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {mode !== 'forgot' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Password</label>
                    {mode === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => switchMode('forgot')}
                        className="text-xs text-brand-600 dark:text-brand-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required={mode !== 'forgot'}
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 bg-surface border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required={mode === 'signup'}
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 bg-surface border border-surface-border focus:border-brand-500 outline-none transition-all text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              layout
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-500 text-black py-3 font-bold hover:bg-brand-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8 shadow-lg shadow-brand-500/20"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'login' && 'Sign In'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {mode === 'login' && (
            <motion.div layout className="mt-6">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-surface-border"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-mono uppercase">Or continue with</span>
                <div className="flex-grow border-t border-surface-border"></div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full bg-surface border border-surface-border text-foreground py-3 font-medium hover:bg-surface-light transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </motion.button>
            </motion.div>
          )}
          
          <motion.div layout className="mt-8 pt-8 border-t border-surface-border text-center">
            {mode === 'login' ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Don't have an account?{' '}
                <button onClick={() => switchMode('signup')} className="text-brand-600 dark:text-brand-500 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Back to{' '}
                <button onClick={() => switchMode('login')} className="text-brand-600 dark:text-brand-500 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors">
                  Sign in
                </button>
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;