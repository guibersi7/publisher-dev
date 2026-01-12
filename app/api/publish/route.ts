import { NextResponse } from 'next/server';

import { publishToLinkedIn } from '@/lib/linkedin';
import { templates } from '@/lib/templates';
import { validatePost } from '@/lib/validation';

export async function POST(request: Request) {
  const { content, platform } = (await request.json()) as {
    content?: string;
    platform?: keyof typeof templates;
  };

  if (!content || !platform || !(platform in templates)) {
    return NextResponse.json(
      { error: 'Conteúdo e plataforma são obrigatórios.' },
      { status: 400 },
    );
  }

  const validation = validatePost(platform, content);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: 'Falha na validação.', validation },
      { status: 422 },
    );
  }

  if (platform === 'linkedin') {
    const response = await publishToLinkedIn(content);
    return NextResponse.json({
      ...response,
      validation,
    });
  }

  return NextResponse.json(
    { error: 'Plataforma não suportada.' },
    { status: 400 },
  );
}
