import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
    try {
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

        // Tentar getSession primeiro
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
            console.error('Session Error:', sessionError)
        }

        const user = session?.user

        if (!user) {
            console.error('No user found in session')
            return NextResponse.json({ error: 'Unauthorized', details: 'No authenticated user found' }, { status: 401 })
        }

        const { data: userProfile } = await supabase
            .from('users')
            .select('brand_profile')
            .eq('id', user.id)
            .single()

        const { prompt, assistantId, threadId, personaId, image } = await request.json()

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            )
        }

        if (!assistantId) {
            return NextResponse.json(
                { error: 'Assistant ID is required' },
                { status: 400 }
            )
        }

        if (!personaId) {
            return NextResponse.json(
                { error: 'Persona ID is required' },
                { status: 400 }
            )
        }

        // 1. Thread Management
        let currentThreadId = threadId
        if (!currentThreadId) {
            const thread = await openai.beta.threads.create()
            currentThreadId = thread.id
        }

        // 2. Save user message to database
        await supabase
            .from('chat_history')
            .insert({
                user_id: user.id,
                role: 'user',
                content: prompt,
                persona_id: personaId,
                thread_id: currentThreadId,
            })

        // 3. Add Message to Thread
        // TODO: Handle Image upload if provided (requires File API)
        await openai.beta.threads.messages.create(currentThreadId, {
            role: 'user',
            content: prompt,
        })

        // 4. Prepare Brand Context
        let brandContext = ''
        if (userProfile?.brand_profile) {
            const bp = userProfile.brand_profile as any
            brandContext = `
CONTEXTO DA MARCA (Use isso para personalizar a resposta):
1. Estágio: ${bp.authority_stage || '-'}
2. Bio: ${bp.bio_positioning || '-'}
3. Nicho: ${bp.niche_subniche || '-'}
4. Dores: ${bp.pain_points || '-'}
5. Comunicação: ${bp.communication_style || '-'}
6. Objetivo: ${bp.content_goal || '-'}
7. Formato: ${bp.preferred_format || '-'}
8. Monetização: ${bp.monetization_strategy || '-'}
9. Autoridade: ${bp.authority_type || '-'}
10. Referências: ${bp.references || '-'}
`.trim()
        }

        // 5. Run Assistant
        let run = await openai.beta.threads.runs.createAndPoll(currentThreadId, {
            assistant_id: assistantId,
            additional_instructions: brandContext ? `\n\n${brandContext}` : undefined,
        })

        // 6. Handle Tool Calls (DALL-E 3)
        if (run.status === 'requires_action') {
            const toolCalls = run.required_action?.submit_tool_outputs.tool_calls || []
            const toolOutputs = []

            for (const toolCall of toolCalls) {
                if (toolCall.function.name === 'generate_image') {
                    try {
                        const args = JSON.parse(toolCall.function.arguments)

                        // Call DALL-E 3
                        const imageResponse = await openai.images.generate({
                            model: "dall-e-3",
                            prompt: args.prompt,
                            n: 1,
                            size: "1024x1024",
                            quality: "standard",
                            response_format: "url"
                        });

                        const imageUrl = imageResponse.data?.[0]?.url || "Erro ao gerar imagem."

                        toolOutputs.push({
                            tool_call_id: toolCall.id,
                            output: JSON.stringify({ image_url: imageUrl })
                        })
                    } catch (e) {
                        console.error("DALL-E Error:", e)
                        toolOutputs.push({
                            tool_call_id: toolCall.id,
                            output: JSON.stringify({ error: "Failed to generate image" })
                        })
                    }
                }
            }

            if (toolOutputs.length > 0) {
                run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
                    currentThreadId,
                    run.id,
                    { tool_outputs: toolOutputs }
                )
            }
        }

        // 7. Get Final Response
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(currentThreadId)
            const lastMessage = messages.data[0]

            // Extract text content
            let responseText = ''
            if (lastMessage.content[0].type === 'text') {
                responseText = lastMessage.content[0].text.value
            }

            // 8. Save assistant response to database
            await supabase
                .from('chat_history')
                .insert({
                    user_id: user.id,
                    role: 'assistant',
                    content: responseText,
                    persona_id: personaId,
                    thread_id: currentThreadId,
                })

            return NextResponse.json({
                message: responseText,
                threadId: currentThreadId,
            })
        } else {
            return NextResponse.json({
                message: `Run status: ${run.status}`,
                threadId: currentThreadId,
            })
        }

    } catch (error: any) {
        console.error('Assistants API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}
