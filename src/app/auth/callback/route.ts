import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Se houve erro no OAuth
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
      
      const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      if (session?.user) {
        // Check if user profile exists, if not create one
        const { data: existingUser, error: fetchError } = await (supabase as any)
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking user:', fetchError)
        }

        if (!existingUser) {
          // Create user profile
          const { error: insertError } = await (supabase as any).from('users').insert({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url,
            plan: 'free',
            posts_remaining: 3,
          })

          if (insertError && insertError.code !== '23505') {
            console.error('Error creating user profile:', insertError)
          }
        }
      }

      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (err) {
      console.error('Callback error:', err)
      return NextResponse.redirect(
        new URL('/login?error=Erro ao processar autenticação', request.url)
      )
    }
  }

  // Se não tem code, redireciona pro login
  return NextResponse.redirect(new URL('/login', request.url))
}
