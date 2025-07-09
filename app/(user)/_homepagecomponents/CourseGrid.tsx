import { getCourses } from '@/sanity/lib/courses/getCourses';
import { CourseCard } from './CourseCard';

export default async function CourseGrid() {
  const courses = await getCourses();
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
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            href={`/courses/${course.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
