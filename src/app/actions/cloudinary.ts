
'use server';

import { v2 as cloudinary } from 'cloudinary';

// No global config here. It will be handled where needed.

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    // This will be caught by the client and shown as an error
    throw new Error('Cloudinary API secret is not configured on the server.');
  }
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    apiSecret
  );

  return { timestamp, signature };
}
