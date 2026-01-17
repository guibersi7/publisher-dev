import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { full_name, brand_profile } = body

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

    // Build update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (full_name !== undefined) {
      updateData.full_name = full_name
    }

    if (brand_profile !== undefined) {
      updateData.brand_profile = brand_profile
    }

    // Update user profile
    const { data, error } = await (supabase as any)
      .from('users')
      .update(updateData)
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Error in update user route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
