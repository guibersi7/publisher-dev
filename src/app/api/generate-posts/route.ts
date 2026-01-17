import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import type { Database } from '@/types/database'
import type { GeneratedPost } from '@/types'

// Groq - API gratuita e super rápida!
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Gera URLs de imagens usando Picsum - serviço 100% confiável
// As imagens são de alta qualidade de fotógrafos profissionais
function getImageUrl(index: number): string {
  // Usar seed baseado em timestamp + índice para imagens únicas mas consistentes
  const seed = `post-${Date.now()}-${index}`
  return `https://picsum.photos/seed/${seed}/800/800`
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has posts remaining
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('posts_remaining, plan')
      .eq('id', session.user.id)
      .single() as { data: { posts_remaining: number; plan: string } | null; error: any }

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.posts_remaining <= 0 && user.plan === 'free') {
      return NextResponse.json(
        { error: 'No posts remaining. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Generate posts using Groq (FREE!) - Prompt otimizado para alto engajamento
    const systemPrompt = `Você é um copywriter de elite especializado em conteúdo viral para redes sociais. Seu trabalho é criar posts que PARAM o scroll e geram engajamento real.

## TÉCNICAS OBRIGATÓRIAS

### 1. HOOKS PODEROSOS (primeira linha)
Use uma dessas estruturas para a primeira linha:
- Pergunta provocativa: "E se eu te dissesse que..."
- Declaração chocante: "90% das pessoas erram nisso..."
- História pessoal: "Há 2 anos eu estava quebrado..."
- Contraste: "Todo mundo faz X. Eu faço Y."
- Promessa específica: "Em 30 dias você vai..."
- Curiosidade: "Ninguém fala sobre isso, mas..."

### 2. ESTRUTURA DO CONTEÚDO
- Linha 1: Hook que para o scroll (CRUCIAL)
- Linha 2-3: Desenvolva a ideia com exemplos reais
- Linha 4: Insight ou virada surpreendente
- Linha final: CTA conversacional (pergunta ou convite)

### 3. GATILHOS MENTAIS (use 1-2 por post)
- Escassez: "poucos sabem", "segredo"
- Prova social: "milhares já", "os melhores fazem"
- Autoridade: dados, pesquisas, experiência
- Curiosidade: "descobri que", "o que ninguém conta"
- Urgência: "agora", "antes que seja tarde"

### 4. TOM DE VOZ
- Escreva como se estivesse conversando com um amigo inteligente
- Use "você" (direto, pessoal)
- Seja específico, não genérico
- Mostre vulnerabilidade real quando apropriado
- Tenha opinião (não seja neutro demais)

### 5. FRASES PROIBIDAS (NUNCA USE)
❌ "Neste mundo acelerado..."
❌ "É muito importante..."
❌ "Não perca essa oportunidade..."
❌ "Acredite em seus sonhos..."
❌ "Juntos somos mais fortes..."
❌ "A vida é feita de escolhas..."
❌ "Sucesso é uma jornada..."
❌ "Trabalhe enquanto eles dormem..."
❌ "Seja a mudança que..."
❌ Qualquer frase motivacional genérica

### 6. ADAPTAÇÃO POR PLATAFORMA
**Instagram**: Visual, storytelling, carrossel mental, 3-5 linhas + quebra + mais conteúdo
**Twitter/X**: Punchy, polêmico, thread-style, máximo impacto em poucas palavras
**LinkedIn**: Profissional mas humano, lições aprendidas, vulnerabilidade estratégica

## FORMATO DE RESPOSTA
Responda APENAS com JSON válido:
{
  "posts": [
    {
      "id": "1",
      "title": "Título interno (max 50 chars)",
      "content": "Texto completo do post aqui",
      "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "platform": "instagram"
    }
  ]
}

## REGRAS TÉCNICAS
- Português brasileiro natural e fluente
- Emojis: máximo 3-4 por post, posicionados estrategicamente
- Content: 150-500 caracteres (varia por plataforma)
- Hashtags: 5-8 tags relevantes e específicas (sem #)
- Cada post deve ter abordagem COMPLETAMENTE diferente
- Retorne APENAS o JSON, nada antes ou depois`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Tema: ${prompt}

Crie 3 posts com abordagens COMPLETAMENTE diferentes:
1. Post para Instagram - storytelling ou carrossel mental
2. Post para Twitter/X - direto, impactante, polêmico se fizer sentido
3. Post para LinkedIn - profissional mas humano, com lição aprendida

Lembre-se: ZERO clichês, hooks poderosos, linguagem natural.`,
        },
      ],
      temperature: 0.85, // Mais criatividade
      max_tokens: 3000,
    })

    const responseText = completion.choices[0]?.message?.content || ''

    let posts: GeneratedPost[]

    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : responseText

      const parsed = JSON.parse(jsonString)
      const rawPosts = parsed.posts || []

      // Adicionar imagens aos posts usando Picsum (100% confiável)
      posts = rawPosts.map((post: any, index: number) => ({
        id: post.id || String(index + 1),
        title: post.title || 'Post ' + (index + 1),
        content: post.content || '',
        hashtags: post.hashtags || [],
        platform: post.platform || 'instagram',
        imageUrl: getImageUrl(index),
      }))
    } catch (e) {
      console.error('Failed to parse Groq response:', e)
      console.error('Response was:', responseText)
      return NextResponse.json(
        { error: 'Failed to generate posts. Please try again.' },
        { status: 500 }
      )
    }

    // Decrement posts remaining (only for non-business plans)
    if (user.plan !== 'business') {
      await (supabase as any)
        .from('users')
        .update({ posts_remaining: user.posts_remaining - 1 })
        .eq('id', session.user.id)
    }

    // Save posts to database
    const postsToInsert = posts.map(post => ({
      user_id: session.user.id,
      title: post.title,
      content: post.content + '\n\n' + post.hashtags.map((h: string) => `#${h}`).join(' '),
      image_url: post.imageUrl,
      platform: post.platform,
      status: 'draft' as const,
    }))

    await (supabase as any).from('posts').insert(postsToInsert)

    // Save chat history
    await (supabase as any).from('chat_history').insert([
      {
        user_id: session.user.id,
        role: 'user',
        content: prompt,
      },
      {
        user_id: session.user.id,
        role: 'assistant',
        content: JSON.stringify(posts),
      },
    ])

    return NextResponse.json({ posts })
  } catch (error: any) {
    console.error('Error generating posts:', error)

    // Tratar erros específicos
    if (error?.status === 401 || error?.error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Groq API key.' },
        { status: 500 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few seconds.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
