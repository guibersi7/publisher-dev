import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { Database } from '@/types/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
  business: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business',
}

export async function POST(request: Request) {
  try {
    const { planId } = await request.json()

    if (!planId || planId === 'free') {
      return NextResponse.json(
        { error: 'Invalid plan' },
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

    // Get or create Stripe customer
    const { data: subscription } = await (supabase as any)
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single() as { data: { stripe_customer_id: string | null } | null }

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          supabase_user_id: session.user.id,
        },
      })
      customerId = customer.id

      // Save customer ID
      await (supabase as any).from('subscriptions').upsert({
        user_id: session.user.id,
        stripe_customer_id: customerId,
        status: 'active',
        plan: 'free',
      })
    }

    // Create checkout session
    const priceId = PRICE_IDS[planId as keyof typeof PRICE_IDS]
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: {
        user_id: session.user.id,
        plan_id: planId,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

