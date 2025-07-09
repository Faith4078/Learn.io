import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SidebarProvider } from '@/providers/SideBarProvider';
import { SanityLive } from '@/sanity/lib/live';
import { ClerkProvider } from '@clerk/nextjs';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user?.id) {
    return redirect('/');
  }

  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <SidebarProvider>
          <div className="h-full">{children}</div>
        </SidebarProvider>
      </ThemeProvider>

      <SanityLive />
    </ClerkProvider>
  );
}
