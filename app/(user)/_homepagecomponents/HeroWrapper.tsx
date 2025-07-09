// components/ClientHeroWrapper.tsx
'use client';
import { usePathname } from 'next/navigation';
import Hero from './Hero';

export default function HeroWrapper() {
  const pathname = usePathname();
  return pathname === '/' ? <Hero key={pathname} /> : null;
}
