'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  Sparkles, 
  Zap,
  Crown,
  ArrowRight,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { PLANS } from '@/types'
import { cn } from '@/lib/utils'

export default function BillingPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const currentPlan = PLANS.find(p => p.id === profile?.plan) || PLANS[0]
  const postsUsed = profile ? (currentPlan.postsPerMonth === -1 ? 0 : currentPlan.postsPerMonth - profile.posts_remaining) : 0
  const postsTotal = currentPlan.postsPerMonth === -1 ? 999 : currentPlan.postsPerMonth
  const postsProgress = (postsUsed / postsTotal) * 100

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return
    
    setIsLoading(planId)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast({
        title: 'Erro ao processar pagamento',
        description: 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    setIsLoading('manage')
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast({
        title: 'Erro ao acessar portal',
        description: 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  const planIcons = {
    free: Sparkles,
    pro: Zap,
    business: Crown,
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold text-warm-black">Planos e Faturamento</h1>
        <p className="text-warm-gray">
          Gerencie sua assinatura e escolha o plano ideal para você
        </p>
      </motion.div>

      {/* Current Plan Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-warm-gray/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Seu plano atual</CardTitle>
                <CardDescription>
                  {profile?.plan === 'free' 
                    ? 'Você está usando o plano gratuito'
                    : `Você está no plano ${currentPlan.name}`
                  }
                </CardDescription>
              </div>
              <Badge 
                variant={profile?.plan === 'free' ? 'secondary' : 'accent'}
                className="text-sm"
              >
                {currentPlan.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-warm-black">Posts usados este mês</span>
                  <span className="text-sm text-warm-gray">
                    {postsUsed}/{currentPlan.postsPerMonth === -1 ? '∞' : postsTotal}
                  </span>
                </div>
                <Progress value={postsProgress} className="h-2" />
                {profile?.plan === 'free' && profile.posts_remaining === 0 && (
                  <p className="text-xs text-orange-accent mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Você atingiu o limite de posts gratuitos
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-end">
                {profile?.plan !== 'free' && (
                  <Button 
                    variant="outline"
                    onClick={handleManageSubscription}
                    disabled={isLoading === 'manage'}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isLoading === 'manage' ? 'Carregando...' : 'Gerenciar assinatura'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-warm-black mb-6">Escolha seu plano</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => {
            const PlanIcon = planIcons[plan.id]
            const isCurrentPlan = profile?.plan === plan.id
            const isPopular = plan.id === 'pro'
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className={cn(
                  'h-full relative transition-all duration-300',
                  isPopular 
                    ? 'border-orange-accent border-2 shadow-xl shadow-orange-accent/10' 
                    : 'border-warm-gray/10 hover:border-warm-gray/30',
                  isCurrentPlan && 'ring-2 ring-green-500 ring-offset-2'
                )}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="accent">Mais popular</Badge>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="success">Plano atual</Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      plan.id === 'free' && 'bg-warm-gray/10',
                      plan.id === 'pro' && 'bg-orange-accent/10',
                      plan.id === 'business' && 'bg-yellow-500/10'
                    )}>
                      <PlanIcon className={cn(
                        'w-6 h-6',
                        plan.id === 'free' && 'text-warm-gray',
                        plan.id === 'pro' && 'text-orange-accent',
                        plan.id === 'business' && 'text-yellow-500'
                      )} />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-warm-black mb-2">
                      {plan.name}
                    </h3>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-warm-black">
                        {plan.price === 0 ? 'Grátis' : `R$${plan.price.toFixed(2).replace('.', ',')}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-warm-gray">/mês</span>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-warm-gray">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      variant={isCurrentPlan ? 'secondary' : isPopular ? 'accent' : 'outline'}
                      disabled={isCurrentPlan || isLoading === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {isLoading === plan.id ? (
                        'Processando...'
                      ) : isCurrentPlan ? (
                        'Plano atual'
                      ) : plan.price === 0 ? (
                        'Plano atual'
                      ) : (
                        <>
                          Assinar agora
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-warm-gray/10">
          <CardHeader>
            <CardTitle>Perguntas frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                q: 'Posso cancelar minha assinatura a qualquer momento?',
                a: 'Sim! Você pode cancelar sua assinatura quando quiser, sem taxas adicionais. Você continuará tendo acesso até o final do período pago.',
              },
              {
                q: 'Como funciona o limite de posts?',
                a: 'Cada vez que você gera posts com a IA, são descontados do seu limite mensal. O limite é renovado no início de cada mês.',
              },
              {
                q: 'Posso fazer upgrade ou downgrade do meu plano?',
                a: 'Sim! Você pode mudar de plano a qualquer momento. Ao fazer upgrade, a diferença é cobrada proporcionalmente. Ao fazer downgrade, o novo preço vale a partir do próximo ciclo.',
              },
              {
                q: 'Quais formas de pagamento são aceitas?',
                a: 'Aceitamos cartões de crédito e débito das principais bandeiras, além de PIX para pagamentos únicos.',
              },
            ].map((faq, index) => (
              <div key={index}>
                <h4 className="font-medium text-warm-black mb-1">{faq.q}</h4>
                <p className="text-sm text-warm-gray">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

