export * from './database'

export interface GeneratedPost {
  id: string
  title: string
  content: string
  imageUrl?: string
  videoUrl?: string
  hashtags: string[]
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
  imageKeywords?: string
}

export interface ChatMessageUI {
  id: string
  role: 'user' | 'assistant'
  content: string
  posts?: GeneratedPost[]
  timestamp: Date
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  status: 'draft' | 'scheduled' | 'published'
  platform?: string
}

export interface KanbanCard {
  id: string
  title: string
  content: string
  status: 'draft' | 'scheduled' | 'published'
  scheduledAt?: Date
  platform?: string
}

export interface Plan {
  id: 'free' | 'pro' | 'business'
  name: string
  price: number
  features: string[]
  postsPerMonth: number
  stripePriceId?: string
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Grátis',
    price: 0,
    features: [
      '3 posts gratuitos',
      'Geração com IA básica',
      'Calendário simples',
    ],
    postsPerMonth: 3,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49.90,
    features: [
      '50 posts por mês',
      'Geração com IA avançada',
      'Calendário + Kanban',
      'Suporte por email',
      'Imagens em alta resolução',
    ],
    postsPerMonth: 50,
  },
  {
    id: 'business',
    name: 'Business',
    price: 149.90,
    features: [
      'Posts ilimitados',
      'IA premium com vídeos',
      'Todas as funcionalidades',
      'Suporte prioritário',
      'API access',
      'Múltiplas contas',
    ],
    postsPerMonth: -1,
  },
]

