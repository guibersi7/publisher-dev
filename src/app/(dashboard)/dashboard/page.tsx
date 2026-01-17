'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth/auth-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

type Post = {
  id: string
  title: string
  content: string
  status: 'draft' | 'scheduled' | 'published'
  platform: string | null
  scheduled_at: string | null
  published_at: string | null
  created_at: string
}

type Stats = {
  totalPosts: number
  scheduledPosts: number
  publishedPosts: number
  postsThisWeek: number
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    postsThisWeek: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar posts do usuário
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (postsError) {
          console.error('Error fetching posts:', postsError)
        } else {
          setPosts(postsData || [])
        }

        // Buscar estatísticas
        const { data: allPosts, error: statsError } = await supabase
          .from('posts')
          .select('status, created_at') as { data: { status: string; created_at: string }[] | null; error: any }

        if (!statsError && allPosts) {
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

          setStats({
            totalPosts: allPosts.length,
            scheduledPosts: allPosts.filter(p => p.status === 'scheduled').length,
            publishedPosts: allPosts.filter(p => p.status === 'published').length,
            postsThisWeek: allPosts.filter(p => new Date(p.created_at) > oneWeekAgo).length
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const formatDate = (post: Post) => {
    if (post.status === 'scheduled' && post.scheduled_at) {
      return formatDistanceToNow(new Date(post.scheduled_at), { 
        addSuffix: true, 
        locale: ptBR 
      })
    }
    if (post.status === 'published' && post.published_at) {
      return formatDistanceToNow(new Date(post.published_at), { 
        addSuffix: true, 
        locale: ptBR 
      })
    }
    return formatDistanceToNow(new Date(post.created_at), { 
      addSuffix: true, 
      locale: ptBR 
    })
  }

  const statsDisplay = [
    { 
      label: 'Posts criados', 
      value: stats.totalPosts.toString(), 
      icon: FileText, 
      trend: `+${stats.postsThisWeek} esta semana` 
    },
    { 
      label: 'Agendados', 
      value: stats.scheduledPosts.toString(), 
      icon: Clock, 
      trend: stats.scheduledPosts > 0 ? 'Pendentes' : 'Nenhum' 
    },
    { 
      label: 'Publicados', 
      value: stats.publishedPosts.toString(), 
      icon: CheckCircle2, 
      trend: 'Total publicado' 
    },
    { 
      label: 'Restantes', 
      value: (profile?.posts_remaining || 0).toString(), 
      icon: TrendingUp, 
      trend: `Plano ${profile?.plan || 'free'}` 
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-warm-black">
          Olá, {profile?.full_name?.split(' ')[0] || 'Criador'}! 👋
        </h1>
        <p className="text-warm-gray">
          Pronto para criar conteúdo incrível hoje?
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeInUp}>
          <Link href="/dashboard/chat">
            <Card className="group cursor-pointer border-warm-gray/10 hover:border-orange-accent/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-accent/10 rounded-xl flex items-center justify-center group-hover:bg-orange-accent/20 transition-colors">
                    <Sparkles className="w-6 h-6 text-orange-accent" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-warm-gray group-hover:text-orange-accent group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-warm-black mb-1">Criar com IA</h3>
                <p className="text-sm text-warm-gray">
                  Gere 3 posts completos em segundos
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Link href="/dashboard/schedule">
            <Card className="group cursor-pointer border-warm-gray/10 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-warm-gray group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-warm-black mb-1">Ver cronograma</h3>
                <p className="text-sm text-warm-gray">
                  Organize suas publicações
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Link href="/dashboard/chat">
            <Card className="group cursor-pointer border-warm-gray/10 hover:border-green-500/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageSquare className="w-6 h-6 text-green-500" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-warm-gray group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-warm-black mb-1">Conversar com IA</h3>
                <p className="text-sm text-warm-gray">
                  Tire dúvidas e peça sugestões
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-warm-gray/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsDisplay.map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <Card className="border-warm-gray/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 bg-warm-gray/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-5 h-5 text-warm-gray" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-warm-black">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-warm-gray truncate">{stat.label}</p>
                    </div>
                  </div>
                  <p className="text-xs text-warm-gray mt-3 pt-3 border-t border-warm-gray/10">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-warm-gray/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Posts recentes</CardTitle>
              <CardDescription>Seus últimos conteúdos criados</CardDescription>
            </div>
            <Link href="/dashboard/schedule">
              <Button variant="outline" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-warm-gray/5">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))
              ) : posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-warm-gray/5 hover:bg-warm-gray/10 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-warm-white rounded-lg flex items-center justify-center border border-warm-gray/10 flex-shrink-0">
                        <FileText className="w-5 h-5 text-warm-gray" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-warm-black truncate">{post.title}</p>
                        <p className="text-sm text-warm-gray capitalize">{post.platform || 'Sem plataforma'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-xs sm:text-sm text-warm-gray hidden sm:block">
                        {formatDate(post)}
                      </span>
                      <Badge 
                        variant={
                          post.status === 'published' ? 'success' : 
                          post.status === 'scheduled' ? 'accent' : 
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {post.status === 'published' ? 'Publicado' :
                         post.status === 'scheduled' ? 'Agendado' :
                         'Rascunho'}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-warm-gray/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-warm-gray" />
                  </div>
                  <p className="text-warm-gray mb-4">Nenhum post criado ainda</p>
                  <Link href="/dashboard/chat">
                    <Button>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Criar primeiro post
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Banner (for free users) */}
      {profile?.plan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-warm-black to-warm-black/90 border-0">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold text-warm-white mb-1">
                  Desbloqueie todo o potencial
                </h3>
                <p className="text-warm-white/70">
                  Faça upgrade para Pro e tenha 50 posts por mês + recursos exclusivos
                </p>
              </div>
              <Link href="/dashboard/billing">
                <Button variant="accent" size="lg">
                  Ver planos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
