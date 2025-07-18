import { sanitizeSearchQuery } from '@/lib/utils';
import { searchCourses } from '@/sanity/lib/courses/searchCourses';
import { CourseCard } from '@/app/(user)/_homepagecomponents/CourseCard';
import { Search } from 'lucide-react';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchQuery = (await searchParams).query;

  if (!searchQuery) {
    // Optionally, render a message or redirect
    return (
      <div className="h-full pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">No search term provided</h1>
        </div>
      </div>
    );
  }
  const sanitizedQuery = sanitizeSearchQuery(searchQuery as string);
  const decodedQuery = decodeURIComponent(sanitizedQuery);
  const searchResults = await searchCourses(decodedQuery);

  return (
    <div className="h-full pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Search className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              Found {searchResults.length} result
              {searchResults.length === 1 ? '' : 's'} for &quot;{decodedQuery}
              &quot;
            </p>
          </div>
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No courses found</h2>
            <p className="text-muted-foreground mb-8">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                href={`/courses/${course.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
