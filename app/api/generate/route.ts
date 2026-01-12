import { NextResponse } from 'next/server';

import { generatePost } from '@/lib/content';
import { templates } from '@/lib/templates';

export async function POST(request: Request) {
  const { prompt, platform } = (await request.json()) as {
    prompt?: string;
    platform?: keyof typeof templates;
  };

  if (!prompt || !platform || !(platform in templates)) {
    return NextResponse.json(
      { error: 'Prompt e plataforma são obrigatórios.' },
      { status: 400 },
    );
  }

  const result = generatePost(prompt, platform);

  return NextResponse.json({
    platform,
    template: templates[platform],
    ...result,
  });
}
