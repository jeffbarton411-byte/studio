'use server';

import { v2 as cloudinary } from 'cloudinary';

export async function getCloudinarySignature(paramsToSign: Record<string, any>) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error('Cloudinary API secret is not configured on the server.');
  }

  // Generate the signature on the server with all relevant parameters
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSecret
  );

  return { signature };
}
