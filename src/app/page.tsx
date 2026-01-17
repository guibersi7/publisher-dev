'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  Check,
  Instagram,
  Twitter,
  Linkedin,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/types'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-warm-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-warm-white" />
            </div>
            <span className="font-semibold text-lg text-warm-black">Publisher</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-warm-gray hover:text-warm-black transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-warm-gray hover:text-warm-black transition-colors">
              Preços
            </a>
            <a href="#how-it-works" className="text-warm-gray hover:text-warm-black transition-colors">
              Como funciona
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/login">
              <Button>
                Começar grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="accent" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-warm-black mb-6 leading-tight">
              Crie posts incríveis
              <br />
              <span className="gradient-text">em segundos</span>
            </h1>
            
            <p className="text-xl text-warm-gray mb-10 max-w-2xl mx-auto">
              Transforme suas ideias em conteúdo profissional para todas as redes sociais. 
              Com IA avançada e um cronograma inteligente, nunca mais fique sem posts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="xl" className="w-full sm:w-auto">
                  Começar gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                <Play className="w-5 h-5 mr-2" />
                Ver demonstração
              </Button>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative rounded-2xl border border-warm-gray/10 shadow-2xl overflow-hidden bg-warm-white">
              <div className="absolute top-0 left-0 right-0 h-10 bg-warm-gray/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="pt-10 p-6">
                <div className="grid grid-cols-3 gap-4 h-80">
                  {/* Chat Panel */}
                  <div className="col-span-1 bg-warm-gray/5 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="bg-warm-white rounded-lg p-3 text-sm text-left">
                        Crie 3 posts sobre produtividade para empreendedores
                      </div>
                      <div className="bg-orange-accent/10 rounded-lg p-3 text-sm text-left">
                        <Sparkles className="w-4 h-4 text-orange-accent inline mr-2" />
                        Gerando seus posts...
                      </div>
                    </div>
                  </div>
                  {/* Posts Preview */}
                  <div className="col-span-2 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-warm-gray/5 rounded-lg p-3 flex flex-col"
                      >
                        <div className="bg-warm-gray/10 rounded aspect-square mb-2" />
                        <div className="h-2 bg-warm-gray/20 rounded w-full mb-1" />
                        <div className="h-2 bg-warm-gray/20 rounded w-3/4" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-warm-gray/10">
        <div className="container mx-auto px-4">
          <p className="text-center text-warm-gray mb-8">Compatível com suas redes favoritas</p>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            <Instagram className="w-8 h-8 text-warm-gray/50" />
            <Twitter className="w-8 h-8 text-warm-gray/50" />
            <Linkedin className="w-8 h-8 text-warm-gray/50" />
            <svg className="w-8 h-8 text-warm-gray/50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
            <svg className="w-8 h-8 text-warm-gray/50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-warm-black mb-4">
                Tudo que você precisa
              </h2>
              <p className="text-warm-gray text-lg max-w-2xl mx-auto">
                Ferramentas poderosas para criar, agendar e analisar seu conteúdo em um só lugar.
              </p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Geração com IA',
                description: 'Descreva o que você quer e receba 3 posts prontos com texto, imagem e hashtags.',
                color: 'bg-orange-accent/10 text-orange-accent'
              },
              {
                icon: Calendar,
                title: 'Cronograma Inteligente',
                description: 'Calendário visual e Kanban para organizar todas as suas publicações.',
                color: 'bg-blue-500/10 text-blue-500'
              },
              {
                icon: Zap,
                title: 'Publicação Rápida',
                description: 'Agende posts para todas as plataformas com um clique.',
                color: 'bg-green-500/10 text-green-500'
              },
              {
                icon: BarChart3,
                title: 'Análise de Performance',
                description: 'Acompanhe métricas e entenda o que funciona melhor para seu público.',
                color: 'bg-purple-500/10 text-purple-500'
              },
              {
                icon: Instagram,
                title: 'Multi-plataforma',
                description: 'Instagram, TikTok, Twitter, LinkedIn e muito mais em um só lugar.',
                color: 'bg-pink-500/10 text-pink-500'
              },
              {
                icon: Check,
                title: 'Templates Prontos',
                description: 'Comece rápido com templates otimizados para cada tipo de conteúdo.',
                color: 'bg-yellow-500/10 text-yellow-500'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover border-warm-gray/10">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-warm-black mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-warm-gray">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-warm-gray/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-warm-black mb-4">
              Como funciona
            </h2>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">
              Em 3 passos simples, você transforma ideias em posts prontos para publicar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Descreva sua ideia', desc: 'Digite no chat o que você quer comunicar' },
              { step: '02', title: 'Receba 3 opções', desc: 'Nossa IA cria posts com texto e imagem' },
              { step: '03', title: 'Agende e publique', desc: 'Escolha a data e deixe o Publisher fazer o resto' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-orange-accent/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-warm-black mb-2">
                  {item.title}
                </h3>
                <p className="text-warm-gray">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-warm-black mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">
              Comece grátis e faça upgrade quando precisar de mais.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${plan.id === 'pro' ? 'border-orange-accent border-2 shadow-xl' : 'border-warm-gray/10'}`}>
                  {plan.id === 'pro' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="accent">Mais popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-warm-black mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-warm-black">
                        {plan.price === 0 ? 'Grátis' : `R$${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-warm-gray">/mês</span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-warm-gray">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/login">
                      <Button 
                        className="w-full" 
                        variant={plan.id === 'pro' ? 'accent' : 'outline'}
                      >
                        {plan.price === 0 ? 'Começar grátis' : 'Assinar agora'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-warm-black">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-warm-white mb-6">
              Pronto para transformar
              <br />
              suas redes sociais?
            </h2>
            <p className="text-warm-gray text-lg mb-10">
              Junte-se a milhares de criadores que já usam o Publisher para criar conteúdo incrível.
            </p>
            <Link href="/login">
              <Button size="xl" variant="accent">
                Criar conta gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-warm-gray/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-warm-black rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-warm-white" />
              </div>
              <span className="font-semibold text-warm-black">Publisher</span>
            </div>
            <p className="text-warm-gray text-sm">
              © 2024 Publisher. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

