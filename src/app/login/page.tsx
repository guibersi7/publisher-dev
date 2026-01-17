'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginData.email || !loginData.password) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' })
      return
    }
    
    setIsSubmitting(true)
    try {
      await signInWithEmail(loginData.email, loginData.password)
      toast({ title: 'Login realizado com sucesso!' })
    } catch (error: any) {
      toast({ 
        title: 'Erro ao fazer login', 
        description: error.message || 'Verifique suas credenciais',
        variant: 'destructive' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' })
      return
    }
    
    if (registerData.password.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' })
      return
    }
    
    setIsSubmitting(true)
    try {
      await signUpWithEmail(registerData.email, registerData.password, registerData.name)
      toast({ 
        title: 'Conta criada com sucesso!', 
        description: 'Verifique seu email para confirmar o cadastro.' 
      })
    } catch (error: any) {
      toast({ 
        title: 'Erro ao criar conta', 
        description: error.message || 'Tente novamente',
        variant: 'destructive' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsSubmitting(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      toast({ 
        title: 'Google OAuth não configurado', 
        description: 'Use email e senha por enquanto',
        variant: 'destructive' 
      })
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-orange-accent" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-warm-gray hover:text-warm-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o início
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-warm-gray/10 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <motion.div 
                  className="w-16 h-16 bg-warm-black rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Sparkles className="w-8 h-8 text-warm-white" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl">Bem-vindo ao Publisher</CardTitle>
              <CardDescription className="text-warm-gray">
                Crie posts incríveis com inteligência artificial
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Criar conta</TabsTrigger>
                </TabsList>
                
                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                        <Input
                          type="password"
                          placeholder="Senha"
                          className="pl-10"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Entrar
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                        <Input
                          type="text"
                          placeholder="Nome completo"
                          className="pl-10"
                          value={registerData.name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                        <Input
                          type="password"
                          placeholder="Senha (mínimo 6 caracteres)"
                          className="pl-10"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Criar conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-warm-gray/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-warm-white px-2 text-warm-gray">ou</span>
                </div>
              </div>

              {/* Google Login */}
              <Button 
                onClick={handleGoogleLogin} 
                disabled={isSubmitting}
                className="w-full"
                variant="outline"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              <p className="text-xs text-center text-warm-gray mt-6">
                Ao continuar, você concorda com nossos{' '}
                <Link href="#" className="text-warm-black hover:underline">
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link href="#" className="text-warm-black hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-warm-gray text-sm mb-4">O que você vai encontrar:</p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-warm-gray">
                <div className="w-2 h-2 bg-orange-accent rounded-full" />
                3 posts grátis
              </div>
              <div className="flex items-center gap-2 text-warm-gray">
                <div className="w-2 h-2 bg-orange-accent rounded-full" />
                IA avançada
              </div>
              <div className="flex items-center gap-2 text-warm-gray">
                <div className="w-2 h-2 bg-orange-accent rounded-full" />
                Cronograma
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

