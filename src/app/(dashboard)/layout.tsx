'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Settings, 
  LogOut,
  LayoutDashboard,
  CreditCard,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth/auth-context'
import { cn, getInitials } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chat IA', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Cronograma', href: '/dashboard/schedule', icon: Calendar },
  { name: 'Planos', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
]

function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-warm-white">
      <div className="w-64 border-r border-warm-gray/10 p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, profile, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return <LoadingSkeleton />
  }

  const postsUsed = profile ? (3 - profile.posts_remaining) : 0
  const postsTotal = profile?.plan === 'free' ? 3 : profile?.plan === 'pro' ? 50 : 999
  const postsProgress = (postsUsed / postsTotal) * 100

  return (
    <div className="flex h-screen bg-warm-white overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-warm-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-warm-white border-r border-warm-gray/10 flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-warm-gray/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-warm-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-warm-white" />
            </div>
            <span className="font-semibold text-lg text-warm-black">Publisher</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-warm-black text-warm-white' 
                      : 'text-warm-gray hover:text-warm-black hover:bg-warm-gray/10'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                  {item.name === 'Chat IA' && profile?.posts_remaining === 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      Limite
                    </Badge>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Usage Stats */}
        <div className="p-4 border-t border-warm-gray/10">
          <div className="bg-warm-gray/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-warm-black">Posts usados</span>
              <span className="text-sm text-warm-gray">
                {postsUsed}/{profile?.plan === 'business' ? '∞' : postsTotal}
              </span>
            </div>
            <Progress value={postsProgress} className="h-2" />
            {profile?.plan === 'free' && profile.posts_remaining === 0 && (
              <Link href="/dashboard/billing">
                <Button variant="accent" size="sm" className="w-full mt-3">
                  Fazer upgrade
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="p-4 border-t border-warm-gray/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {getInitials(profile?.full_name || user?.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-warm-black truncate">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-warm-gray capitalize">
                    Plano {profile?.plan || 'free'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={signOut}
                className="text-red-500 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Menu Button - floating */}
        <Button 
          variant="outline" 
          size="icon" 
          className="lg:hidden fixed top-4 left-4 z-30 bg-warm-white shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-warm-white">
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="w-full">
              {children}
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

