import groq from 'groq';
import { sanityFetch } from '../live';

export async function isEnrolledInCourse(clerkId: string, courseId: string) {
  try {
    console.log('Checking enrollment for:', { clerkId, courseId });

    // First get the student document using clerkId
    const studentQuery = groq`*[_type == "student" && clerkId == $clerkId][0]._id`;
    const studentId = await sanityFetch({
      query: studentQuery,
      params: { clerkId },
    });

    console.log('Student ID result:', studentId);

    if (!studentId) {
      console.log('No student found with clerkId:', clerkId);
      return false;
    }

    // Then check for enrollment using the student's Sanity document ID
    const enrollmentQuery = groq`*[_type == "enrollment" && student._ref == $studentId && course._ref == $courseId][0]`;
    const enrollment = await sanityFetch({
      query: enrollmentQuery,
      params: { studentId: studentId.data, courseId },
    });

    console.log('Enrollment result:', enrollment);

    return !!enrollment.data;
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return false;
  }
}
