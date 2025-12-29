
'use server';

import { v2 as cloudinary } from 'cloudinary';

export async function getCloudinarySignature(paramsToSign: Record<string, any>) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error('Cloudinary API secret is not configured on the server.');
  }

  // Generate a timestamp on the server
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Combine the timestamp with the other parameters to be signed
  const paramsWithTimestamp = { ...paramsToSign, timestamp };

  // Generate the signature on the server with all relevant parameters
  const signature = cloudinary.utils.api_sign_request(
    paramsWithTimestamp,
    apiSecret
  );

  // Return both the signature and the timestamp
  return { signature, timestamp };
}
