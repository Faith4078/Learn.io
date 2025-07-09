import React, { Suspense } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CourseGrid from './_homepagecomponents/CourseGrid';
export const dynamic = 'force-static';
export const revalidate = 3600; // revalidate at most every hour

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Courses Grid */}
      <Suspense fallback={<CourseGridLoadingSkeleton />}>
        <CourseGrid />
      </Suspense>
    </div>
  );
}

function CourseGridLoadingSkeleton() {
  const items = [1, 2, 3];
  const CourseCardSkeleton = () => {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-48 w-full"></Skeleton>
          <Skeleton className="h-4 mt-4 w-3/4"></Skeleton>
          <Skeleton className="h-4 mt-4 w-1/2"></Skeleton>
        </CardContent>
      </Card>
    );
  };
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-4 py-8">
        <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        <span className="text-sm font-medium text-muted-foreground">
          Featured Courses
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
        {items.map((item) => (
          <CourseCardSkeleton key={item} />
        ))}
      </div>
    </div>
  );
}
