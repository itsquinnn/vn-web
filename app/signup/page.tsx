'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTravelStore, UserRole } from '@/store/useTravelStore';
import { User, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthLeftPanel from '@/components/features/auth/AuthLeftPanel';
import AuthBackButton from '@/components/features/auth/AuthBackButton';
import AuthRightLayout from '@/components/features/auth/AuthRightLayout';

export default function SignupPage() {
  const router = useRouter();
  const { loginUser, currentUser } = useTravelStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Traveler');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser?.loggedIn && currentUser?.otpVerified) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Please enter your name and email address.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must accept the park regulations.');
      return;
    }

    // Generate a temporary crypto-like verification token
    const chars = '0123456789abcdef';
    let token = '0x';
    for (let i = 0; i < 40; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    localStorage.setItem('nepal_verification_token', token);
    localStorage.setItem('nepal_verification_browser', navigator.userAgent);

    loginUser(fullName, role, email);
    router.push(`/confirm?token=${token}`);
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
      <AuthBackButton label="Back to Home" onClick={() => router.push('/')} />

      {/* 2. Shared Left Panel */}
      <AuthLeftPanel imageSrc="/pictures/everest_(1)-1624869402.jpg" imageAlt="Everest Sunrise" />

      {/* 3. Shared Right Layout */}
      <AuthRightLayout>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col gap-6 relative z-10"
        >
          {/* Mobile-only Brand Logo */}
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
              Join <span className="text-[#0552A2]">Us</span>
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Create an account to start planning your adventure, book stays, and discover the beauty of Nepal.
            </p>
          </motion.div>

          {errorMsg && (
            <motion.p variants={itemVariants} className="text-xs text-rose-600 font-semibold border border-rose-500/15 bg-rose-50 px-3.5 py-2.5 rounded-xl text-left">
              {errorMsg}
            </motion.p>
          )}

          {/* Form using space-y-4 */}
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs font-sans text-left">
            
            {/* Full Name */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase text-[#64748B] tracking-[0.14em] font-semibold">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0552A2]/70 pointer-events-none">
                  <User className="h-4 w-4" />
                </div>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-zinc-200 focus:border-[#0552A2] rounded-xl pl-10 pr-4 py-3 text-sm text-[#17212B] font-medium focus:outline-none transition-all placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#0552A2]/10"
                  required
                />
              </div>
            </motion.div>

            {/* Email Address */}
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

            {/* Access Role Selection Grid */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label className="text-[11px] uppercase text-[#64748B] tracking-[0.14em] font-semibold">Select Access Role</label>
              <div className="grid grid-cols-3 gap-2.5 text-left">
                {[
                  { id: 'Traveler', label: 'Traveler', desc: 'Book stays & permits' },
                  { id: 'Guide', label: 'Guide', desc: 'Verify mountain routes' },
                  { id: 'Butler', label: 'Butler', desc: 'AI trip companion' }
                ].map((item) => {
                  const isActive = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as UserRole)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 relative group ${
                        isActive 
                          ? 'border-[#0552A2] bg-[#F8FBFF]' 
                          : 'border-zinc-200 bg-white text-[#4B5563] hover:border-[#0552A2]/40'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`font-[family-name:var(--font-quicksand)] text-xs font-bold ${isActive ? 'text-[#0552A2]' : 'text-[#17212B]'}`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2]" />
                        )}
                      </div>
                      <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[10px] text-[#64748B] leading-tight block mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Terms check */}
            <motion.label variants={itemVariants} className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-zinc-300 accent-[#0552A2] focus:ring-0 cursor-pointer"
                required
              />
              <span className="text-[11px] text-[#4B5563] leading-snug">
                I accept the park conservation guidelines, mountain safety codes, and registry terms.
              </span>
            </motion.label>

            {/* Submit Button */}
            <motion.button 
              variants={itemVariants}
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#0552A2] hover:bg-[#043e7b] text-xs font-bold uppercase tracking-[0.14em] text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Create Account</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            {/* Link to Login */}
            <motion.div variants={itemVariants} className="text-center border-t border-zinc-100 pt-4 text-xs text-[#4B5563]">
              Already have a travel profile?{' '}
              <button 
                type="button"
                onClick={() => router.push('/login')}
                className="text-[#0552A2] hover:text-[#043e7b] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </motion.div>

          </form>

        </motion.div>

      </AuthRightLayout>

    </main>
  );
}
