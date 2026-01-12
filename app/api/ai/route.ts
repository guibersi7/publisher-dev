import { NextResponse } from 'next/server';

import { getUserApiKey, validateApiKey } from '@/lib/userApiKeyStore';

const getUserId = (request: Request) => {
  return request.headers.get('x-user-id') ?? 'demo-user';
};

export async function POST(request: Request) {
  const userId = getUserId(request);
  const stored = getUserApiKey(userId);

  if (!stored) {
    return NextResponse.json(
      { error: 'API-key não configurada.', code: 'missing_key' },
      { status: 400 },
    );
  }

  const validationError = validateApiKey(stored.apiKey);
  if (validationError) {
    return NextResponse.json(
      { error: 'API-key inválida ou expirada.', code: 'invalid_key' },
      { status: 401 },
    );
  }

  if (stored.apiKey.toLowerCase().includes('invalid')) {
    return NextResponse.json(
      { error: 'API-key inválida ou expirada.', code: 'invalid_key' },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === 'string' ? body.prompt : 'Olá';

  return NextResponse.json({
    message: 'Chamada simulada com sucesso.',
    data: {
      prompt,
      model: 'provedor-exemplo',
      usedKeyLast4: stored.last4,
    },
  });
}
