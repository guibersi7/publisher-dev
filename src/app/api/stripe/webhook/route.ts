import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { Database } from '@/types/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Cast to any to avoid type inference issues with partial selects
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
) as any

const PLAN_POSTS = {
  free: 3,
  pro: 50,
  business: -1, // unlimited
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const planId = session.metadata?.plan_id as 'pro' | 'business'

        if (userId && planId) {
          // Update subscription
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
            plan: planId,
          })

          // Update user plan and posts
          await supabase.from('users').update({
            plan: planId,
            posts_remaining: PLAN_POSTS[planId],
          }).eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub) {
          const status = subscription.status === 'active' ? 'active' : 
                        subscription.status === 'canceled' ? 'canceled' :
                        subscription.status === 'past_due' ? 'past_due' : 'active'

          await supabase.from('subscriptions').update({
            status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }).eq('user_id', sub.user_id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub) {
          // Downgrade to free
          await supabase.from('subscriptions').update({
            status: 'canceled',
            plan: 'free',
          }).eq('user_id', sub.user_id)

          await supabase.from('users').update({
            plan: 'free',
            posts_remaining: 0, // They've used their free posts already
          }).eq('id', sub.user_id)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Reset posts on renewal
        if (invoice.billing_reason === 'subscription_cycle') {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('user_id, plan')
            .eq('stripe_customer_id', customerId)
            .single()

          if (sub) {
            const plan = sub.plan as 'free' | 'pro' | 'business'
            await supabase.from('users').update({
              posts_remaining: PLAN_POSTS[plan],
            }).eq('id', sub.user_id)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

