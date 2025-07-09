import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';
import { baseUrl } from '@/lib/utils';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl: `${baseUrl}/studio`,
  }, // Set to false if statically generating pages, using ISR or tag-based revalidation
});
