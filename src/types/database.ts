export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'pro' | 'business'
          posts_remaining: number
          brand_profile: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'business'
          posts_remaining?: number
          brand_profile?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'business'
          posts_remaining?: number
          brand_profile?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          image_url: string | null
          video_url: string | null
          status: 'draft' | 'scheduled' | 'published'
          scheduled_at: string | null
          published_at: string | null
          platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          image_url?: string | null
          video_url?: string | null
          status?: 'draft' | 'scheduled' | 'published'
          scheduled_at?: string | null
          published_at?: string | null
          platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          image_url?: string | null
          video_url?: string | null
          status?: 'draft' | 'scheduled' | 'published'
          scheduled_at?: string | null
          published_at?: string | null
          platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          persona_id: string | null
          thread_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          persona_id?: string | null
          thread_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          persona_id?: string | null
          thread_id?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          plan: 'free' | 'pro' | 'business'
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          plan?: 'free' | 'pro' | 'business'
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          plan?: 'free' | 'pro' | 'business'
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type ChatMessage = Database['public']['Tables']['chat_history']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
