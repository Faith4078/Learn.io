import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStudentByClerkId } from '@/sanity/lib/student/getStudentByClerkId';
import { createEnrollment } from '@/sanity/lib/student/createEnrollment';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log('Stripe webhook POST handler called');
  let event: Stripe.Event;
  try {
    const buf = await req.arrayBuffer();
    const body = Buffer.from(buf);
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature found', { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);

      return new NextResponse(`Webhook Error: ${errorMessage}`, {
        status: 400,
      });
    }

    console.log('Webhook event received:', {
      type: event.type,
      data: event.data,
    });

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Webhook: checkout.session.completed received', {
        sessionId: session.id,
        metadata: session.metadata,
      });

      // Get the courseId and userId from the metadata
      const courseId = session.metadata?.courseId;
      const userId = session.metadata?.userId;

      if (!courseId || !userId) {
        console.error('Webhook: Missing metadata', { courseId, userId });
        return new NextResponse('Missing metadata', { status: 400 });
      }

      const student = await getStudentByClerkId(userId);

      if (!student.data) {
        console.error('Webhook: Student not found', { userId });
        return new NextResponse('Student not found', { status: 400 });
      }

      console.log('Webhook: Creating enrollment', {
        studentId: student.data._id,
        courseId,
        paymentId: session.id,
        amount: session.amount_total! / 100,
      });

      console.log('Webhook session metadata:', session.metadata);

      try {
        const enrollment = await createEnrollment({
          studentId: student.data._id,
          courseId,
          paymentId: session.id,
          amount: session.amount_total! / 100, // Convert from cents to dollars
        });
        console.log('Webhook: Enrollment created successfully', {
          enrollmentId: enrollment._id,
          enrollment,
        });
      } catch (err) {
        console.error('Webhook: Failed to create enrollment', err);
      }

      return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
