'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { Mail, Lock, Eye, EyeOff, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthLeftPanel from '@/components/features/auth/AuthLeftPanel';
import AuthBackButton from '@/components/features/auth/AuthBackButton';
import AuthRightLayout from '@/components/features/auth/AuthRightLayout';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, currentUser, verifyOtp } = useTravelStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser?.loggedIn && currentUser?.otpVerified) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      const mockName = email.split('@')[0];
      const capitalizedName = mockName.charAt(0).toUpperCase() + mockName.slice(1);

      loginUser(`${capitalizedName} Explorer`, 'Traveler', email);
      verifyOtp();

      setIsSubmitting(false);
      router.push('/dashboard');
    }, 1200);
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

      {/* 1. Shared Back Button (top-right so it never overlaps left logo) */}
      <AuthBackButton label="Back to Home" onClick={() => router.push('/')} />

      {/* 2. Shared Left Panel */}
      <AuthLeftPanel imageSrc="/pictures/everest_(1)-1624869402.jpg" imageAlt="Everest sunrise" />

      {/* 3. Shared Right Panel Layout */}
      <AuthRightLayout>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col gap-6 relative z-10"
        >
          {/* Mobile-only Brand Logo (desktop already shows white logo on left panel) */}
          <motion.div variants={itemVariants} className="flex lg:hidden items-center gap-3">
            <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Visit Nepal Official Logo"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <h1 className="font-[family-name:var(--font-quicksand)] text-3xl sm:text-4xl font-bold text-[#17212B] tracking-tight leading-tight">
              Welcome <span className="text-[#0552A2]">Back</span>
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Sign in to continue your journey and access your custom itineraries, guides, and park permits.
            </p>
          </motion.div>

          {errorMsg && (
            <motion.p variants={itemVariants} className="text-xs text-rose-600 font-semibold border border-rose-500/15 bg-rose-50 px-3.5 py-2.5 rounded-xl text-left">
              {errorMsg}
            </motion.p>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans text-left">

            {/* Email Input */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase text-[#64748B] tracking-[0.14em] font-semibold">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0552A2]/70 pointer-events-none">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-zinc-200 focus:border-[#0552A2] rounded-xl pl-10 pr-4 py-3 text-sm text-[#17212B] font-medium focus:outline-none transition-all placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#0552A2]/10"
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase text-[#64748B] tracking-[0.14em] font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/signup')}
                  className="text-xs text-[#0552A2] hover:text-[#043e7b] font-semibold hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0552A2]/70 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-xs font-bold uppercase tracking-[0.14em] text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Compass className="h-4 w-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>

            {/* Social Divider */}
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="flex-1 border-t border-zinc-200" />
              <span className="px-3 text-xs text-[#64748B] font-medium">Or continue with</span>
              <div className="flex-1 border-t border-zinc-200" />
            </motion.div>

            {/* Google & Apple Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-[#17212B] hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.99 1 12 1 7.35 1 3.39 3.67 1.39 7.56l3.85 2.99c.96-2.88 3.66-4.51 6.76-4.51z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.94 3.73-8.55z" />
                  <path fill="#FBBC05" d="M5.24 14.79a7.12 7.12 0 0 1 0-4.32L1.39 7.56C.5 9.35 0 11.45 0 13.5c0 2.05.5 4.15 1.39 5.94l3.85-2.99c-.45-.69-.73-1.48-.73-2.15z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.12.75-2.55 1.2-4.26 1.2-3.1 0-5.8-1.63-6.76-4.51L1.39 16.9C3.39 20.79 7.35 23 12 23z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-[#17212B] hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.72-1.16 1.86-1.02 2.98 1.09.08 2.2-.57 2.95-1.41z" />
                </svg>
                <span>Apple</span>
              </button>
            </motion.div>

            {/* Back to Signup link */}
            <motion.div variants={itemVariants} className="text-center border-t border-zinc-100 pt-4 text-xs text-[#4B5563]">
              Don&apos;t have a travel profile?{' '}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="text-[#0552A2] hover:text-[#043e7b] font-bold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </motion.div>

          </form>

        </motion.div>

      </AuthRightLayout>

    </main>
  );
}
