'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const profileSchema = z.object({
    authority_stage: z.string().optional(),
    bio_positioning: z.string().optional(),
    niche_subniche: z.string().optional(),
    pain_points: z.string().optional(),
    communication_style: z.string().optional(),
    content_goal: z.string().optional(),
    preferred_format: z.string().optional(),
    monetization_strategy: z.string().optional(),
    authority_type: z.string().optional(),
    references: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

// Nomes amigáveis para os campos
const FIELD_LABELS: Record<keyof ProfileFormValues, string> = {
    authority_stage: '1. Diagnóstico do Perfil (Estágio da Autoridade)',
    bio_positioning: '2. Bio e Posicionamento',
    niche_subniche: '3. Nicho e Subnicho',
    pain_points: '4. Dores, Travamentos e Inseguranças da Audiência',
    communication_style: '5. Estilo de Comunicação',
    content_goal: '6. Objetivo com o Conteúdo',
    preferred_format: '7. Formato Preferencial',
    monetization_strategy: '8. Estratégia de Monetização',
    authority_type: '9. Tipo de Autoridade Desejada',
    references: '10. Referências Positivas e Negativas',
}

const FIELD_DESCRIPTIONS: Record<keyof ProfileFormValues, string> = {
    authority_stage: 'Ex: Iniciante, em crescimento, consolidado...',
    bio_positioning: 'Como você quer ser percebido? Qual sua promessa única?',
    niche_subniche: 'Ex: Marketing Digital > Tráfego Pago para E-commerce',
    pain_points: 'O que tira o sono do seu cliente ideal?',
    communication_style: 'Ex: Técnico, inspirador, humorístico, direto...',
    content_goal: 'Ex: Vender curso, agendar consultoria, ganhar seguidores...',
    preferred_format: 'Ex: Reels, Carrosséis, Textos longos...',
    monetization_strategy: 'O que você vende? (Consultoria, Infoproduto, Serviço)',
    authority_type: 'Ex: Professor, Líder, Curador, Visionário...',
    references: 'Quem você admira e quem você NÃO quer parecer?',
}

export function BrandProfileForm() {
    const { toast } = useToast()
    const { user, profile, refreshProfile } = useAuth()
    const [loading, setLoading] = useState(false)
    const supabase = createClient()!

    // Parse existing profile or empty
    const defaultValues: ProfileFormValues = (profile?.brand_profile as ProfileFormValues) || {}

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    })

    async function onSubmit(data: ProfileFormValues) {
        if (!user) return
        setLoading(true)

        try {
            const { error } = await supabase
                .from('users')
                // @ts-ignore
                .update({ brand_profile: data })
                .eq('id', user.id)

            if (error) throw error

            await refreshProfile()
            toast({
                title: 'Perfil de Marca atualizado!',
                description: 'Suas IAs agora usarão essas informações para criar conteúdo.',
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Erro ao salvar',
                description: 'Tente novamente.',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>DNA da Marca</CardTitle>
                <CardDescription>
                    Preencha esses 10 pilares para que todas as IAs conheçam profundamente sua estratégia.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(Object.keys(FIELD_LABELS) as Array<keyof ProfileFormValues>).map((key) => (
                                <FormField
                                    key={key}
                                    control={form.control}
                                    name={key}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{FIELD_LABELS[key]}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={FIELD_DESCRIPTIONS[key]}
                                                    className="min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        <Button type="submit" disabled={loading} className="w-full md:w-auto min-w-[200px]">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar DNA da Marca
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
