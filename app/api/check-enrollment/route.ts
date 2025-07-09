import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isEnrolledInCourse } from '@/sanity/lib/student/isEnrolledInCourse';

export async function GET(request: NextRequest) {
  try {
    console.log('API: check-enrollment called');
    const { userId } = await auth();

    if (!userId) {
      console.log('API: No userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    console.log('API: Checking enrollment for', { userId, courseId });

    if (!courseId) {
      console.log('API: No courseId provided');
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const enrollmentStatus = await isEnrolledInCourse(userId, courseId);
    console.log('API: Enrollment status result:', enrollmentStatus);

    return NextResponse.json({ isEnrolled: enrollmentStatus });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
