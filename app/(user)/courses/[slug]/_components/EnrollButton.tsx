'use client';

import { createStripeCheckout } from '@/actions/createStripeCheckout';
// import { createStripeCheckout } from '@/actions/createStripeCheckout';
import { SignInButton, useUser } from '@clerk/nextjs';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';

function EnrollButton({
  courseId,
  isEnrolled: initialIsEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isEnrolled, setIsEnrolled] = useState(initialIsEnrolled);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);

  // Check if user just returned from Stripe checkout
  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';

  // Client-side enrollment check after returning from Stripe
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      console.log('Checking enrollment status:', {
        isSuccess,
        userId: user?.id,
        isEnrolled,
        courseId,
      });

      if (isSuccess && user?.id && !isEnrolled) {
        console.log('Starting enrollment check...');
        setIsCheckingEnrollment(true);
        try {
          // Add a small delay to allow webhook to process
          console.log('Waiting 2 seconds for webhook to process...');
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Make a request to check enrollment status
          console.log('Making API request to check enrollment...');
          const response = await fetch(
            `/api/check-enrollment?courseId=${courseId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log('API response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('API response data:', data);
            setIsEnrolled(data.isEnrolled);
          } else {
            console.error(
              'API request failed:',
              response.status,
              await response.text()
            );
          }
        } catch (error) {
          console.error('Error checking enrollment status:', error);
        } finally {
          setIsCheckingEnrollment(false);
        }
      }
    };

    checkEnrollmentStatus();
  }, [isSuccess, user?.id, courseId, isEnrolled]);

  const handleEnroll = async (courseId: string) => {
    startTransition(async () => {
      try {
        const userId = user?.id;
        if (!userId) return;

        const { url } = await createStripeCheckout(courseId, userId);
        if (url) {
          router.push(url);
        }
      } catch (error) {
        console.error('Error in handleEnroll:', error);
        throw new Error('Failed to create checkout session');
      }
    });
  };

  // Show loading state while checking user is loading or checking enrollment
  if (!isUserLoaded || isPending || isCheckingEnrollment) {
    return (
      <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show enrolled state with link to course
  if (isEnrolled) {
    return (
      <Link
        prefetch={false}
        href={`/dashboard/courses/${courseId}`}
        className="w-full rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
      >
        <span>Access Course</span>
        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>
    );
  }

  // Show enroll button only when we're sure user is not enrolled
  return (
    <button
      className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
        ${
          isPending
            ? 'bg-gray-100 text-black cursor-not-allowed hover:scale-100'
            : 'bg-white text-black hover:scale-105 hover:shadow-lg hover:shadow-black/10'
        }
      `}
      disabled={isPending}
      onClick={() => handleEnroll(courseId)}
    >
      {!user?.id ? (
        <SignInButton>
          <span className={`${isPending ? 'opacity-0' : 'opacity-100'}`}>
            Sign in to Enroll
          </span>
        </SignInButton>
      ) : (
        <span className={`${isPending ? 'opacity-0' : 'opacity-100'}`}>
          Enroll Now
        </span>
      )}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}

export default EnrollButton;
