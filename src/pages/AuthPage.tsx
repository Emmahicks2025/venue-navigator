import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LogIn, UserPlus, Ticket, Phone, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

type SignupStep = 'form' | 'verify-phone';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signupStep, setSignupStep] = useState<SignupStep>('form');
  const [verificationId, setVerificationId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const isSigningUp = useRef(false);
  const { user, loading, signIn, signUp, sendPhoneVerification, verifyPhoneCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (!loading && user && signupStep === 'form' && !isSigningUp.current) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo, signupStep]);

  const formatPhoneNumber = (val: string) => {
    // Ensure it starts with + for international format
    const cleaned = val.replace(/[^\d+]/g, '');
    if (cleaned && !cleaned.startsWith('+')) return '+1' + cleaned;
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!isLogin && (!firstName || !lastName)) {
      toast.error('Please enter your first and last name');
      return;
    }
    if (!isLogin && !phone) {
      toast.error('Please enter your phone number for verification');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Signed in successfully!');
      } else {
        isSigningUp.current = true;
        const { error, user: newUser } = await signUp(email, password, { firstName, lastName, phone: formatPhoneNumber(phone) });
        if (error) {
          isSigningUp.current = false;
          if (error.message.includes('already-in-use')) {
            toast.error('This email is already registered. Try signing in.');
          } else {
            toast.error(error.message);
          }
          return;
        }

        if (newUser) {
          setNewUserId(newUser.uid);
          // Send phone verification
          setSendingCode(true);
          const { verificationId: vId, error: phoneError } = await sendPhoneVerification(
            formatPhoneNumber(phone),
            'recaptcha-container'
          );
          setSendingCode(false);

          if (phoneError) {
            isSigningUp.current = false;
            toast.error('Account created but phone verification failed: ' + phoneError.message);
            setSignupStep('form');
            setIsLogin(true);
            return;
          }

          if (vId) {
            setVerificationId(vId);
            setSignupStep('verify-phone');
            toast.success('Verification code sent to your phone!');
          }
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await verifyPhoneCode(verificationId, otpCode, newUserId);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Phone verified! Welcome aboard!');
      isSigningUp.current = false;
      setSignupStep('form');
      navigate(redirectTo);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setSendingCode(true);
    const { verificationId: vId, error } = await sendPhoneVerification(
      formatPhoneNumber(phone),
      'recaptcha-container'
    );
    setSendingCode(false);

    if (error) {
      toast.error('Failed to resend: ' + error.message);
      return;
    }
    if (vId) {
      setVerificationId(vId);
      toast.success('New code sent!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md">
          {/* Invisible reCAPTCHA container */}
          <div id="recaptcha-container" />

          {signupStep === 'verify-phone' ? (
            /* Phone Verification Step */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">Verify Your Phone</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-base font-semibold text-foreground mt-1">{formatPhoneNumber(phone)}</p>
              </div>

              <div className="flex justify-center py-4">
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus>
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button onClick={handleVerifyOTP} size="lg" className="w-full text-base font-semibold" disabled={submitting || otpCode.length !== 6}>
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                Verify & Complete
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={sendingCode}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {sendingCode ? 'Sending...' : "Didn't receive the code? Resend"}
                </button>
              </div>
            </div>
          ) : (
            /* Login / Signup Form */
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required={!isLogin}
                    />
                    <p className="text-xs text-muted-foreground">We'll send a verification code via SMS</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={submitting || sendingCode}>
                  {submitting || sendingCode ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : isLogin ? (
                    <LogIn className="w-4 h-4 mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {isLogin ? 'Sign In' : sendingCode ? 'Sending Code...' : 'Sign Up'}
                </Button>
              </form>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <span className="text-primary font-medium">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
