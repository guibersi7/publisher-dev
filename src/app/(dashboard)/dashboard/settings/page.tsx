'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Save,
  Loader2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { getInitials } from '@/lib/utils'

interface BrandProfile {
  instagram_url: string
  bio_positioning: string
  niche_subniche: string
  pain_points: string
  communication_style: string
}

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingBrand, setIsSavingBrand] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || user?.email || '',
  })

  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
    instagram_url: '',
    bio_positioning: '',
    niche_subniche: '',
    pain_points: '',
    communication_style: '',
  })

  // Sync form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || user?.email || '',
      })

      const bp = profile.brand_profile as BrandProfile | null
      if (bp) {
        setBrandProfile({
          instagram_url: bp.instagram_url || '',
          bio_positioning: bp.bio_positioning || '',
          niche_subniche: bp.niche_subniche || '',
          pain_points: bp.pain_points || '',
          communication_style: bp.communication_style || '',
        })
      }
    }
  }, [profile, user?.email])

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
        }),
      })

      if (!response.ok) throw new Error()

      await refreshProfile()

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveBrandProfile = async () => {
    setIsSavingBrand(true)

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_profile: brandProfile,
        }),
      })

      if (!response.ok) throw new Error()

      await refreshProfile()

      toast({
        title: 'Perfil da marca salvo!',
        description: 'Suas informações serão usadas pela IA para personalizar o conteúdo.',
      })
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingBrand(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold text-warm-black">Configurações</h1>
        <p className="text-warm-gray">
          Gerencie seu perfil e preferências
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-warm-gray/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-warm-gray" />
              <div>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Suas informações pessoais</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {getInitials(profile?.full_name || user?.email || 'U')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-warm-black">{profile?.full_name || 'Usuário'}</p>
                <p className="text-sm text-warm-gray">{profile?.email}</p>
                <Badge variant="secondary" className="mt-2 capitalize">
                  Plano {profile?.plan || 'free'}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-black">
                  Nome completo
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Seu nome"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-black">
                  Email
                </label>
                <Input
                  value={formData.email}
                  disabled
                  className="bg-warm-gray/5"
                />
                <p className="text-xs text-warm-gray">
                  O email não pode ser alterado pois está vinculado à sua conta Google
                </p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Brand Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-warm-gray/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-accent" />
              <div>
                <CardTitle>Perfil da Marca</CardTitle>
                <CardDescription>
                  Essas informações ajudam a IA a criar conteúdo personalizado para você
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-black">
                  Link do Instagram
                </label>
                <Input
                  value={brandProfile.instagram_url}
                  onChange={(e) => setBrandProfile(prev => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/seuperfil"
                />
                <p className="text-xs text-warm-gray">
                  Seu perfil do Instagram para referência visual e de conteúdo
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-black">
                  Bio / Descrição da página
                </label>
                <Textarea
                  value={brandProfile.bio_positioning}
                  onChange={(e) => setBrandProfile(prev => ({ ...prev, bio_positioning: e.target.value }))}
                  placeholder="Ex: Ajudo empreendedores a escalar seus negócios com marketing digital..."
                  className="min-h-[80px]"
                />
                <p className="text-xs text-warm-gray">
                  Como você se apresenta ou quer se posicionar
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-black">
                  Nicho / Posicionamento
                </label>
                <Input
                  value={brandProfile.niche_subniche}
                  onChange={(e) => setBrandProfile(prev => ({ ...prev, niche_subniche: e.target.value }))}
                  placeholder="Ex: Marketing digital para coaches e mentores"
                />
                <p className="text-xs text-warm-gray">
                  Seu nicho específico ou área de atuação
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-black">
                  Principais dores e dúvidas
                </label>
                <Textarea
                  value={brandProfile.pain_points}
                  onChange={(e) => setBrandProfile(prev => ({ ...prev, pain_points: e.target.value }))}
                  placeholder="Ex: Não sei o que postar, tenho medo de parecer vendedor demais, não consigo engajamento..."
                  className="min-h-[80px]"
                />
                <p className="text-xs text-warm-gray">
                  Suas maiores dificuldades com criação de conteúdo
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-warm-black">
                  Estilo de comunicação
                </label>
                <Textarea
                  value={brandProfile.communication_style}
                  onChange={(e) => setBrandProfile(prev => ({ ...prev, communication_style: e.target.value }))}
                  placeholder="Ex: Direto e objetivo, uso humor leve, gosto de storytelling, prefiro tom profissional..."
                  className="min-h-[80px]"
                />
                <p className="text-xs text-warm-gray">
                  Como você gosta de se comunicar com sua audiência
                </p>
              </div>
            </div>

            <Button onClick={handleSaveBrandProfile} disabled={isSavingBrand}>
              {isSavingBrand ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSavingBrand ? 'Salvando...' : 'Salvar perfil da marca'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="border-warm-gray/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-warm-gray" />
              <div>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure como deseja ser notificado</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Posts publicados', desc: 'Receba notificações quando seus posts forem publicados' },
              { label: 'Lembretes de agendamento', desc: 'Seja lembrado de posts agendados' },
              { label: 'Novidades do Publisher', desc: 'Fique por dentro de novas funcionalidades' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-warm-black text-sm">{item.label}</p>
                  <p className="text-xs text-warm-gray">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={index === 0} />
                  <div className="w-11 h-6 bg-warm-gray/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-accent rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-accent"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-warm-gray/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-warm-gray" />
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Gerencie a segurança da sua conta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-warm-black text-sm">Conta Google conectada</p>
                <p className="text-xs text-warm-gray">{user?.email}</p>
              </div>
              <Badge variant="success">Ativo</Badge>
            </div>

            <Separator />

            <div>
              <p className="font-medium text-warm-black text-sm mb-1">Excluir conta</p>
              <p className="text-xs text-warm-gray mb-3">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
              </p>
              <Button variant="destructive" size="sm">
                Excluir minha conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
