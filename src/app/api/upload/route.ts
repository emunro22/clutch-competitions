import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { getSession } from '@/lib/auth';

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const user = await getSession();
        if (!user || user.role !== 'admin') {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/avif',
            'image/gif',
            'image/heic',
            'image/heif',
            'video/mp4',
            'video/quicktime',
            'video/webm',
            'video/x-m4v',
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 2 * 1024 * 1024 * 1024,
        };
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    console.error('Blob upload token generation failed:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    );
  }
}
