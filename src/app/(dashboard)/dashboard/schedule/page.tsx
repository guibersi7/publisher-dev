'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  LayoutGrid, 
  List,
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  FileText,
  Edit,
  Trash2,
  Instagram,
  Twitter,
  Linkedin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { format, addMonths, subMonths, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  status: 'draft' | 'scheduled' | 'published'
  scheduledAt?: Date
  platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok'
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Dicas de produtividade',
    content: '5 hábitos matinais que vão transformar seu dia...',
    status: 'published',
    scheduledAt: new Date(2024, 0, 15, 10, 0),
    platform: 'instagram',
  },
  {
    id: '2',
    title: 'Marketing Digital 2024',
    content: 'Tendências que você precisa conhecer...',
    status: 'scheduled',
    scheduledAt: new Date(2024, 0, 18, 14, 30),
    platform: 'linkedin',
  },
  {
    id: '3',
    title: 'Motivação de segunda',
    content: 'Comece a semana com energia!',
    status: 'scheduled',
    scheduledAt: new Date(2024, 0, 22, 9, 0),
    platform: 'twitter',
  },
  {
    id: '4',
    title: 'Finanças pessoais',
    content: 'Como organizar suas contas...',
    status: 'draft',
    platform: 'instagram',
  },
  {
    id: '5',
    title: 'Liderança moderna',
    content: 'O que faz um bom líder hoje?',
    status: 'draft',
    platform: 'linkedin',
  },
]

const platformConfig = {
  instagram: { icon: Instagram, color: 'text-pink-500 bg-pink-500/10' },
  twitter: { icon: Twitter, color: 'text-blue-400 bg-blue-400/10' },
  linkedin: { icon: Linkedin, color: 'text-blue-600 bg-blue-600/10' },
  facebook: { icon: () => <span className="font-bold">f</span>, color: 'text-blue-500 bg-blue-500/10' },
  tiktok: { icon: () => <span className="font-bold">TT</span>, color: 'text-warm-black bg-warm-black/10' },
}

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-warm-gray/10 text-warm-gray', icon: FileText },
  scheduled: { label: 'Agendado', color: 'bg-orange-accent/10 text-orange-accent', icon: Clock },
  published: { label: 'Publicado', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
}

export default function SchedulePage() {
  const [view, setView] = useState<'calendar' | 'kanban'>('calendar')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [posts, setPosts] = useState(mockPosts)

  // Kanban columns
  const [draftPosts, setDraftPosts] = useState(posts.filter(p => p.status === 'draft'))
  const [scheduledPosts, setScheduledPosts] = useState(posts.filter(p => p.status === 'scheduled'))
  const [publishedPosts, setPublishedPosts] = useState(posts.filter(p => p.status === 'published'))

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => 
      post.scheduledAt && isSameDay(post.scheduledAt, date)
    )
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Fill in empty days at the start
  const startDay = startOfMonth(currentMonth).getDay()
  const emptyDays = Array(startDay).fill(null)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-black">Cronograma</h1>
          <p className="text-warm-gray">Organize e agende seus posts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'kanban')}>
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid className="w-4 h-4" />
                Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Link href="/dashboard/chat">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo post
            </Button>
          </Link>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[1fr_320px] gap-6"
        >
          {/* Calendar Grid */}
          <Card className="border-warm-gray/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-warm-gray py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                
                {days.map((day) => {
                  const dayPosts = getPostsForDate(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  
                  return (
                    <motion.button
                      key={day.toString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'aspect-square p-1 rounded-lg transition-colors relative',
                        isSelected && 'bg-warm-black text-warm-white',
                        !isSelected && isToday(day) && 'bg-orange-accent/10',
                        !isSelected && !isToday(day) && 'hover:bg-warm-gray/10'
                      )}
                    >
                      <span className={cn(
                        'text-sm',
                        !isSameMonth(day, currentMonth) && 'text-warm-gray/50',
                        isToday(day) && !isSelected && 'text-orange-accent font-bold'
                      )}>
                        {format(day, 'd')}
                      </span>
                      
                      {/* Post indicators */}
                      {dayPosts.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayPosts.slice(0, 3).map((post) => (
                            <div
                              key={post.id}
                              className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                post.status === 'published' && 'bg-green-500',
                                post.status === 'scheduled' && 'bg-orange-accent',
                                post.status === 'draft' && 'bg-warm-gray'
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card className="border-warm-gray/10">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate 
                  ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                  : 'Selecione uma data'
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDate && (
                <>
                  {getPostsForDate(selectedDate).length > 0 ? (
                    getPostsForDate(selectedDate).map((post) => (
                      <PostCard key={post.id} post={post} compact />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-warm-gray/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CalendarIcon className="w-6 h-6 text-warm-gray" />
                      </div>
                      <p className="text-sm text-warm-gray mb-3">
                        Nenhum post para este dia
                      </p>
                      <Link href="/dashboard/chat">
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Criar post
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Draft Column */}
          <KanbanColumn
            title="Rascunhos"
            status="draft"
            posts={draftPosts}
            onReorder={setDraftPosts}
          />
          
          {/* Scheduled Column */}
          <KanbanColumn
            title="Agendados"
            status="scheduled"
            posts={scheduledPosts}
            onReorder={setScheduledPosts}
          />
          
          {/* Published Column */}
          <KanbanColumn
            title="Publicados"
            status="published"
            posts={publishedPosts}
            onReorder={setPublishedPosts}
          />
        </motion.div>
      )}
    </div>
  )
}

function KanbanColumn({ 
  title, 
  status, 
  posts, 
  onReorder 
}: { 
  title: string
  status: 'draft' | 'scheduled' | 'published'
  posts: Post[]
  onReorder: (posts: Post[]) => void
}) {
  const config = statusConfig[status]
  
  return (
    <div className="bg-warm-gray/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <config.icon className={cn('w-4 h-4', config.color.split(' ')[1])} />
          <h3 className="font-medium text-warm-black">{title}</h3>
          <Badge variant="secondary" className="ml-1">
            {posts.length}
          </Badge>
        </div>
        {status === 'draft' && (
          <Link href="/dashboard/chat">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
      
      <Reorder.Group
        axis="y"
        values={posts}
        onReorder={onReorder}
        className="space-y-3"
      >
        <AnimatePresence>
          {posts.map((post) => (
            <Reorder.Item
              key={post.id}
              value={post}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PostCard post={post} />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      
      {posts.length === 0 && (
        <div className="text-center py-8 text-warm-gray text-sm">
          Nenhum post
        </div>
      )}
    </div>
  )
}

function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const platform = platformConfig[post.platform]
  const status = statusConfig[post.status]
  const PlatformIcon = platform.icon
  
  return (
    <Card className="border-warm-gray/10 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className={cn('p-1.5 rounded-lg', platform.color)}>
            <PlatformIcon className="w-4 h-4" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h4 className={cn('font-medium text-warm-black mb-1', compact && 'text-sm')}>
          {post.title}
        </h4>
        
        {!compact && (
          <p className="text-sm text-warm-gray line-clamp-2 mb-3">
            {post.content}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={cn('text-xs', status.color)}>
            {status.label}
          </Badge>
          
          {post.scheduledAt && (
            <span className="text-xs text-warm-gray">
              {format(post.scheduledAt, 'HH:mm')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

