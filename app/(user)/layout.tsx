import Header from '@/components/global/Header';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SanityLive } from '@/sanity/lib/live';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import HeroWrapper from './_homepagecomponents/HeroWrapper';

export const metadata: Metadata = {
  title: 'Learn.io',
  description: 'Upskill by learning from world-class industry experts',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <HeroWrapper />
          <main className="flex-1">{children}</main>
        </div>
        <SanityLive />
      </ThemeProvider>
    </ClerkProvider>
  );
}
