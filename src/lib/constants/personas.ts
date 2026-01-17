import { FileText, Palette, LayoutGrid } from 'lucide-react'

export interface Persona {
  id: string
  name: string
  role: string
  description: string
  color: string
  icon: any
  welcomeMessage: string
  suggestedPrompts: string[]
  assistantId: string
}

export const PERSONAS: Persona[] = [
  {
    id: 'post-builder',
    name: 'Post Builder',
    role: 'Especialista em Posts',
    description: 'Cria posts envolventes e otimizados para engajamento nas redes sociais.',
    color: 'text-blue-500',
    icon: FileText,
    welcomeMessage: 'Ola! Sou o Post Builder. Me conte sobre o que voce quer postar e vou criar um conteudo incrivel para voce!',
    suggestedPrompts: [
      'Crie um post sobre produtividade',
      'Post motivacional para segunda-feira',
      'Conteudo educativo sobre meu nicho',
      'Post de engajamento com pergunta',
    ],
    assistantId: 'asst_uACppaUvKTmTNE46BBKIX41d',
  },
  {
    id: 'creative-builder',
    name: 'Creative Builder',
    role: 'Especialista em Criativos',
    description: 'Desenvolve conceitos visuais e criativos impactantes para suas campanhas.',
    color: 'text-purple-500',
    icon: Palette,
    welcomeMessage: 'Ola! Sou o Creative Builder. Vamos criar visuais incriveis juntos! Qual e a ideia que voce quer transformar em arte?',
    suggestedPrompts: [
      'Conceito visual para lancamento',
      'Ideias criativas para stories',
      'Direcao de arte para campanha',
      'Paleta de cores para minha marca',
    ],
    assistantId: 'asst_BTdoWdIwegtvLlRrzU2QKPE5',
  },
  {
    id: 'carrousel-builder',
    name: 'Carrousel Builder',
    role: 'Especialista em Carrosseis',
    description: 'Cria carrosseis estrategicos que educam, engajam e convertem.',
    color: 'text-orange-500',
    icon: LayoutGrid,
    welcomeMessage: 'Ola! Sou o Carrousel Builder. Vamos criar um carrossel que prende a atencao do inicio ao fim! Qual tema voce quer abordar?',
    suggestedPrompts: [
      'Carrossel educativo sobre meu produto',
      'Carrossel de storytelling',
      'Carrossel com dicas praticas',
      'Carrossel de vendas persuasivo',
    ],
    assistantId: 'asst_N1fT7vCWKpImtGoxVs8XiFYF',
  },
]
