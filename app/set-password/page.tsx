'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { ArrowRight, Lock, Eye, EyeOff, ShieldAlert, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthLeftPanel from '@/components/features/auth/AuthLeftPanel';
import AuthBackButton from '@/components/features/auth/AuthBackButton';
import AuthRightLayout from '@/components/features/auth/AuthRightLayout';
import AuthPillBadge from '@/components/features/auth/AuthPillBadge';

export default function SetPasswordPage() {
  const router = useRouter();
  const { currentUser } = useTravelStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentToken, setCurrentToken] = useState('');
  const [isValidating, setIsValidating] = useState(true);

  // Security Verification & Browser-Change Check
  useEffect(() => {
    // Read parameters from window.location to avoid Suspense constraints
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const storedToken = localStorage.getItem('nepal_verification_token');
    const storedBrowser = localStorage.getItem('nepal_verification_browser');

    // If no active signup profile exists, or URL token is missing/mismatching:
    if (
      !currentUser || 
      !currentUser.loggedIn || 
      !urlToken || 
      urlToken !== storedToken || 
      storedBrowser !== navigator.userAgent
    ) {
      router.push('/');
    } else {
      setCurrentToken(urlToken);
      setIsValidating(false);
    }
  }, [currentUser, router]);

  const handleSetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must agree to the park security terms.');
      return;
    }

    // Go to loading onboarding sync screen
    router.push('/loading');
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <main className="h-screen w-screen relative overflow-hidden flex flex-col lg:flex-row bg-white font-sans">
      
      {/* 1. Shared Back Button */}
      <AuthBackButton label="Back to Verify" onClick={() => router.push(`/confirm?token=${currentToken}`)} />

      {/* 2. Shared Left Panel */}
      <AuthLeftPanel imageSrc="/pictures/everest_(1)-1624869402.jpg" imageAlt="Annapurna sunrise" />

      {/* 3. Shared Right Layout Wrapper */}
      <AuthRightLayout>
        {isValidating ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3 w-full">
            <Compass className="h-8 w-8 animate-spin text-[#0552A2]" />
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#64748B]">
              Validating credentials...
            </span>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col gap-6 relative z-10"
          >
            {/* Shared Pill Tag */}
            <motion.div variants={itemVariants}>
              <AuthPillBadge label="Security Credentials" />
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <h1 className="font-[family-name:var(--font-quicksand)] text-3xl sm:text-4xl font-bold text-[#17212B] tracking-tight leading-tight">
                Set Secure <span className="text-[#0552A2]">Password</span>
              </h1>
              <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Setup account access keys for traveler profile <strong className="text-[#17212B]">{currentUser?.name}</strong>.
              </p>
            </motion.div>

            {errorMsg && (
              <motion.div variants={itemVariants} className="bg-rose-50 border border-rose-500/15 rounded-xl p-3 flex items-center gap-2 text-rose-700 text-xs font-semibold text-left">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Form using space-y-4 */}
            <form onSubmit={handleSetPasswordSubmit} className="space-y-4 text-xs font-sans text-left">
              
              {/* Password Input */}
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5 relative">
                <label className="text-[11px] uppercase text-[#64748B] tracking-[0.14em] font-semibold">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0552A2]/70 pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-white border border-zinc-200 focus:border-[#0552A2] rounded-xl pl-10 pr-10 py-3 text-sm text-[#17212B] font-medium focus:outline-none transition-all placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#0552A2]/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17212B] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase text-[#64748B] tracking-[0.14em] font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0552A2]/70 pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-white border border-zinc-200 focus:border-[#0552A2] rounded-xl pl-10 pr-4 py-3 text-sm text-[#17212B] font-medium focus:outline-none transition-all placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#0552A2]/10"
                    required
                  />
                </div>
              </motion.div>

              {/* Agree Terms Checkbox */}
              <motion.label variants={itemVariants} className="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-zinc-300 accent-[#0552A2] focus:ring-0 cursor-pointer"
                  required
                />
                <span className="text-[11px] text-[#4B5563] leading-snug">
                  I agree to the Sagarmatha Trekking Safety Code, trail environmental regulations, and conservation rules.
                </span>
              </motion.label>

              {/* Complete button */}
              <motion.button 
                variants={itemVariants}
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-xs font-bold uppercase tracking-[0.14em] text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Complete Onboarding</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

            </form>
          </motion.div>
        )}
      </AuthRightLayout>

    </main>
  );
}
