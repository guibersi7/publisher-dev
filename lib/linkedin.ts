import { templates, type PlatformKey } from './templates';

type PublishResponse = {
  id: string;
  status: 'published' | 'mocked';
  publishedAt: string;
  platform: PlatformKey;
};

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2/ugcPosts';

export const publishToLinkedIn = async (content: string): Promise<PublishResponse> => {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

  if (!accessToken || !authorUrn) {
    return {
      id: `mock-${Date.now()}`,
      status: 'mocked',
      publishedAt: new Date().toISOString(),
      platform: 'linkedin',
    };
  }

  const response = await fetch(LINKEDIN_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  });

  if (!response.ok) {
    return {
      id: `failed-${Date.now()}`,
      status: 'mocked',
      publishedAt: new Date().toISOString(),
      platform: 'linkedin',
    };
  }

  const location = response.headers.get('x-restli-id') ?? `linkedin-${Date.now()}`;

  return {
    id: location,
    status: 'published',
    publishedAt: new Date().toISOString(),
    platform: 'linkedin',
  };
};

export const platformDescriptors = {
  linkedin: templates.linkedin.description,
};
