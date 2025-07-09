// export default function Hero() {
//   return (
//     <div className="relative h-[45vh] w-full">
//       <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55 dark:from-white/15 dark:to-black/40" />
//       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

//       <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
//         <div className="max-w-3xl">
//           <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
//             Expand Your Knowledge with Our Courses
//           </h1>
//           <p className="text-xl text-muted-foreground">
//             Discover a world of learning with our expertly crafted courses.
//             Learn from industry professionals and take your skills to the next
//             level.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// components/HeroVideo.tsx
// components/HeroVideo.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

export default function Hero() {
  const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoadVideo(true);
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-[95vh] w-full overflow-hidden">
      {loadVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/bg-poster.jpg"
          className="absolute inset-0 w-auto min-w-full min-h-full object-cover brightness-90"
        >
          <source src="/videos/learning.mp4" type="video/mp4" />
        </video>
      )}

      {/* Top fade-in gradient remains */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent z-10" />

      {/* Remove or lighten bottom gradient to avoid heavy darkness */}
      {/* For lighter effect: */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-background/10 to-transparent z-20" />

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-30">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Expand Your Knowledge with Our Courses
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover a world of learning with our expertly crafted courses.
            Learn from industry professionals and take your skills to the next
            level.
          </p>
        </div>
      </div>
    </div>
  );
}
