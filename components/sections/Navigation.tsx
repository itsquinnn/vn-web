'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTravelStore } from '@/store/useTravelStore';
import { Menu, X, ArrowUpRight, User } from '@/components/ui/Icons';

export default function Navigation() {
  const router = useRouter();
  const currentUser = useTravelStore((state) => state.currentUser);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getScrollTop = () => {
      return (
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    };

    const updateScrollState = () => {
      const top = getScrollTop();
      const isPastThreshold = top > 25;
      setScrolled((prev) => (prev !== isPastThreshold ? isPastThreshold : prev));
    };

    // Run immediate check on mount
    updateScrollState();

    // Listen to scroll on both window and document
    window.addEventListener('scroll', updateScrollState, { passive: true });
    document.addEventListener('scroll', updateScrollState, { passive: true });

    // Robust IntersectionObserver on #hero section
    // Guarantees navbar is ALWAYS solid white whenever the user scrolls into white content sections
    let observer: IntersectionObserver | null = null;
    const heroEl = document.getElementById('hero');
    if (heroEl && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            setScrolled(true);
          } else {
            updateScrollState();
          }
        },
        { threshold: [0, 0.1, 0.5, 1.0], rootMargin: '-60px 0px 0px 0px' }
      );
      observer.observe(heroEl);
    }

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      document.removeEventListener('scroll', updateScrollState);
      if (observer) observer.disconnect();
    };
  }, []);

  // Prevent background scroll when mobile drawer is open for smooth mobile UX
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navLinks: {
    label: string;
    href: string;
    preview?: { title: string; region: string; img: string }[];
    columns?: { heading: string; items: string[] }[];
  }[] = [
    { label: 'Discover', href: '#storytelling' },
    {
      label: 'Places to go',
      href: '#destinations',
      preview: [
        { title: 'Everest Region', region: 'Solukhumbu', img: '/pictures/Everest_tk_trekker_(5)-1630474503.jpg' },
        { title: 'Pokhara & Phewa', region: 'Kaski', img: '/pictures/Pokhara_ss_lt_(4)-1624818140.jpg' },
        { title: 'Kathmandu Valley', region: 'Bagmati', img: '/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg' },
        { title: 'Chitwan Safari', region: 'Terai', img: '/pictures/Chitwan_ss_lt_(17)-1624813756.jpg' },
        { title: 'Lumbini Garden', region: 'Rupandehi', img: '/pictures/Lumbini_tk_pilgrimage_(3)-1624819677.jpg' },
        { title: 'Upper Mustang', region: 'Dhaulagiri', img: '/pictures/mustang_tk_people-1624440754.jpeg' },
      ],
      columns: [
        {
          heading: 'Himalayan Regions',
          items: ['Solukhumbu & Khumbu', 'Annapurna Sanctuary', 'Langtang & Gosaikunda', 'Manaslu Circuit', 'Rara & Khaptad'],
        },
        {
          heading: 'Heritage & Lowlands',
          items: ['Bardiya National Park', 'Janakpurdham (Mithila)', 'Ilam Tea Gardens', 'Bandipur & Ghale Gaon', 'Shey Phoksundo'],
        },
      ],
    },
    {
      label: 'Things to do',
      href: '#experiences',
      preview: [
        { title: 'Trekking & Trails', region: 'Alpine', img: '/pictures/poonhill_pg_adventure-1624431033.jpeg' },
        { title: 'Mountaineering', region: '8,000m Peaks', img: '/pictures/everest_(1)-1624869402.jpg' },
        { title: 'Cultural Journeys', region: 'Heritage', img: '/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg' },
        { title: 'Wildlife Safari', region: 'Jungle', img: '/pictures/Chitwan_ss_jungleactivities-1630491399.JPG' },
        { title: 'Spiritual Retreats', region: 'Mindfulness', img: '/pictures/Swayambhu_ss_lt_(3)-1624820456.jpg' },
        { title: 'Air & River Sports', region: 'Adventure', img: '/pictures/Pokhara_oy_lt_(2)-1624817867.jpg' },
      ],
      columns: [
        {
          heading: 'Outdoor & Alpine',
          items: ['Everest Base Camp', 'Annapurna Circuit', 'Paragliding in Pokhara', 'White-Water Rafting', 'Scenic 4×4 Road Trips'],
        },
        {
          heading: 'Culture & Wellness',
          items: ['Newari Gastronomy', 'Monastery Meditation', 'Village Homestays', 'UNESCO Heritage Walks', 'Photography Tours'],
        },
      ],
    },
    {
      label: 'Culture',
      href: '#culture',
      preview: [
        { title: 'Kathmandu Square', region: 'UNESCO 1979', img: '/pictures/Kathmandu_Durbar_Square___Susheel_Shrestha-1629279698.jpg' },
        { title: 'Boudhanath Stupa', region: 'UNESCO 1979', img: '/pictures/boudha-1624805151.jpg' },
        { title: 'Bhaktapur Square', region: 'UNESCO 1979', img: '/pictures/Bhaktapur_ss_lt_(2)-1629279885.jpg' },
        { title: 'Lumbini Garden', region: 'UNESCO 1997', img: '/pictures/lumbini-1624821139.jpg' },
      ],
      columns: [
        {
          heading: 'Festivals & Traditions',
          items: ['Dashain (Sep–Oct)', 'Tihar · Lights (Oct–Nov)', 'Holi · Colors (Mar)', 'Indra Jatra (Sep)', 'Living Heritage Sites'],
        },
      ],
    },
    { label: 'Plan your trip', href: '#plan-your-trip' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setOpenMenu(null);
    if (href !== '#' && href !== '#hero') {
      setScrolled(true);
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeMenuItem = navLinks.find((l) => l.label === openMenu && l.preview);

  return (
    <>
      <header
        onMouseLeave={() => setOpenMenu(null)}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,padding,box-shadow,border-color] duration-300 ease-in-out ${
          openMenu
            ? 'bg-white py-3'
            : scrolled || mobileMenuOpen
              ? `bg-white/98 backdrop-blur-md shadow-[0_4px_24px_rgba(5,82,162,0.08)] py-3 ${
                  !mobileMenuOpen ? 'border-b border-[#0552A2]/10' : ''
                }`
              : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="w-full px-3.5 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Logo with official Visit Nepal identity */}
          <Link
            href="/"
            prefetch={false}
            className="flex items-center ml-2 sm:ml-6 md:ml-10 group focus:outline-none"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setScrolled(false);
              }
            }}
          >
            <div className="relative h-10 w-[50px] sm:h-12 sm:w-[58px] transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src="/logo.png"
                alt="Visit Nepal Official Logo"
                fill
                unoptimized
                sizes="(max-width: 640px) 50px, 58px"
                className="object-contain object-left transition-all duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation Links — NTB-style clean Quicksand links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isOpen = openMenu === link.label;
              return (
                <div
                  key={link.label}
                  onMouseEnter={() => setOpenMenu(link.preview ? link.label : null)}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`font-[family-name:var(--font-quicksand)] text-[14px] font-bold tracking-normal transition-colors duration-200 relative group py-2 inline-flex items-center gap-1 ${
                      isOpen ? 'text-[#0552A2]' : 'text-[#17212B] hover:text-[#0552A2]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-1 left-0 w-full h-[2px] bg-[#0552A2] origin-left transition-transform duration-300 ${
                        isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                </div>
              );
            })}
          </nav>

          {/* Right Actions: Plan Trip CTA & Account Access */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => {
                if (currentUser?.loggedIn && currentUser?.otpVerified) {
                  router.push('/dashboard');
                } else {
                  router.push('/login');
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider transition-colors duration-200 text-[#17212B] hover:text-[#0552A2]"
            >
              <User className="h-3.5 w-3.5" />
              <span>{currentUser?.loggedIn && currentUser?.otpVerified ? 'Dashboard' : 'Sign In'}</span>
            </button>

            <a
              href="#plan-your-trip"
              onClick={(e) => handleNavClick(e, '#plan-your-trip')}
              className="text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm bg-[#0552A2] text-white hover:bg-[#043e7b] hover:shadow-[0_4px_16px_rgba(5,82,162,0.3)]"
            >
              <span>Plan Your Trip</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="#plan-your-trip"
              onClick={(e) => handleNavClick(e, '#plan-your-trip')}
              className="text-[11px] uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full sm:hidden transition-colors bg-[#0552A2] text-white"
            >
              Plan
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl transition-colors text-[#17212B] hover:bg-zinc-100"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Full-Width NTB-Style Falling Mega Dropbar (persistent shell prevents flash when switching tabs) */}
        <AnimatePresence>
          {activeMenuItem && activeMenuItem.preview && (
            <motion.div
              key="mega-dropbar"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-zinc-200/80 shadow-[0_28px_60px_-15px_rgba(15,42,74,0.16)] z-40"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMenuItem.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  className="container py-8"
                >
                  <div className="grid grid-cols-12 gap-10 items-start">
                    {/* Highlights Visual Cards (Full untruncated titles) */}
                    <div className={activeMenuItem.columns && activeMenuItem.columns.length > 1 ? 'col-span-7' : 'col-span-8'}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#64748B]">
                          Featured Highlights
                        </span>
                        <a
                          href={activeMenuItem.href}
                          onClick={(e) => handleNavClick(e, activeMenuItem.href)}
                          className="text-xs font-semibold text-[#0552A2] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Explore all</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <div className={`grid gap-4 ${activeMenuItem.preview.length > 4 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                        {activeMenuItem.preview.map((item) => (
                          <a
                            key={item.title}
                            href={activeMenuItem.href}
                            onClick={(e) => handleNavClick(e, activeMenuItem.href)}
                            className="group/card flex flex-col gap-2"
                          >
                            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-100">
                              <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                unoptimized
                                priority
                                sizes="220px"
                                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-[0.14em] text-[#0552A2] font-semibold block">
                                {item.region}
                              </span>
                              <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] group-hover/card:text-[#0552A2] transition-colors leading-snug block">
                                {item.title}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Categorized Editorial Columns */}
                    {activeMenuItem.columns && (
                      <div className={`${activeMenuItem.columns.length > 1 ? 'col-span-5 grid-cols-2' : 'col-span-4 grid-cols-1'} grid gap-8 border-l border-zinc-200/70 pl-10`}>
                        {activeMenuItem.columns.map((col) => (
                          <div key={col.heading}>
                            <span className="font-[family-name:var(--font-quicksand)] text-xs uppercase tracking-[0.14em] font-bold text-[#0552A2] block mb-3.5">
                              {col.heading}
                            </span>
                            <ul className="space-y-2.5">
                              {col.items.map((item) => (
                                <li key={item}>
                                  <a
                                    href={activeMenuItem.href}
                                    onClick={(e) => handleNavClick(e, activeMenuItem.href)}
                                    className="font-[family-name:var(--font-ibm-plex-sans)] text-[13px] font-medium text-[#4B5563] hover:text-[#0552A2] hover:translate-x-0.5 transition-all block"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Drawer seamlessly attached under header: touches sides, only bottom rounded */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav-drawer"
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{
                duration: 0.24,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: 'top center' }}
              className="absolute left-0 right-0 top-full bg-white/98 backdrop-blur-2xl rounded-b-xl shadow-[0_28px_60px_-15px_rgba(0,0,0,0.35),0_12px_24px_-8px_rgba(5,82,162,0.15)] px-6 pt-2 pb-8 sm:px-8 border-b border-[#0552A2]/10 max-h-[calc(100dvh-80px)] overflow-y-auto lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * (idx + 1), duration: 0.18, ease: 'easeOut' }}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-base uppercase tracking-wider font-bold text-[#17212B] hover:text-[#0552A2] py-3 px-3 min-h-[48px] rounded-2xl hover:bg-slate-50 border-b border-gray-100/70 flex items-center justify-between transition-all group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#0552A2] group-hover:scale-110 transition-transform" />
                  </motion.a>
                ))}
              </nav>

              <div className="pt-6 pb-1 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (currentUser?.loggedIn && currentUser?.otpVerified) {
                      router.push('/dashboard');
                    } else {
                      router.push('/login');
                    }
                  }}
                  className="w-full py-3.5 min-h-[48px] rounded-full border border-[#0552A2]/30 text-[#0552A2] text-xs uppercase tracking-wider font-bold hover:bg-blue-50/50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>{currentUser?.loggedIn && currentUser?.otpVerified ? 'Go to Dashboard' : 'Sign In / Account'}</span>
                </button>
                <a
                  href="#plan-your-trip"
                  onClick={(e) => handleNavClick(e, '#plan-your-trip')}
                  className="w-full py-3.5 min-h-[48px] rounded-full bg-[#0552A2] text-white text-xs uppercase tracking-wider font-bold text-center shadow-md hover:bg-[#043e7b] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Plan Your Trip</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Dimmed Backdrop Overlay outside header */}
      <AnimatePresence>
        {(mobileMenuOpen || openMenu) && (
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => {
              setMobileMenuOpen(false);
              setOpenMenu(null);
            }}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
    </>
  );
}
