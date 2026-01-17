'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Menu,
  Trash2,
  Plus,
  MessageSquare,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { cn, generateId, getInitials } from '@/lib/utils'
import Link from 'next/link'
import { PersonaSelector } from '@/components/chat/persona-selector'
import { PERSONAS, type Persona } from '@/lib/constants/personas'
import {
  useChatHistory,
  useConversations,
  useLatestThreadId,
  useDeleteConversation,
  type Conversation
} from '@/hooks/use-chat'
import { useQueryClient } from '@tanstack/react-query'
import type { ChatMessage as DBChatMessage } from '@/types'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { profile, refreshProfile } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [activePersona, setActivePersona] = useState<Persona>(PERSONAS[0])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const [isNewConversationMode, setIsNewConversationMode] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const hasAutoSelectedRef = useRef(false)

  // Fetch conversations and chat history
  const { data: conversations, isLoading: isLoadingConversations } = useConversations(activePersona.id)
  const { data: latestThreadId } = useLatestThreadId(activePersona.id)
  const { data: chatHistory, isLoading: isLoadingHistory } = useChatHistory(activePersona.id, activeThreadId)
  const deleteConversationMutation = useDeleteConversation()

  // Auto-select latest thread only on initial load (not when user starts new conversation)
  useEffect(() => {
    if (latestThreadId && !activeThreadId && !hasAutoSelectedRef.current && !isNewConversationMode) {
      setActiveThreadId(latestThreadId)
      hasAutoSelectedRef.current = true
    }
  }, [latestThreadId, activeThreadId, isNewConversationMode])

  // Reset thread and state when persona changes
  useEffect(() => {
    setActiveThreadId(null)
    setIsNewConversationMode(false)
    hasAutoSelectedRef.current = false
  }, [activePersona.id])

  // Build messages array: welcome message + saved history + pending message
  const messages: ChatMessage[] = useMemo(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: activePersona.welcomeMessage,
      timestamp: new Date(0),
    }

    const historyMessages: ChatMessage[] = (chatHistory || []).map((msg: DBChatMessage) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
    }))

    const baseMessages = historyMessages.length === 0
      ? [welcomeMessage]
      : [welcomeMessage, ...historyMessages]

    if (pendingMessage) {
      return [...baseMessages, {
        id: 'pending',
        role: 'user' as const,
        content: pendingMessage,
        timestamp: new Date(),
      }]
    }

    return baseMessages
  }, [activePersona.welcomeMessage, chatHistory, pendingMessage])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSelectPersona = (persona: Persona) => {
    setActivePersona(persona)
  }

  const handleNewConversation = () => {
    setActiveThreadId(null)
    setIsNewConversationMode(true)
  }

  const handleSelectConversation = (threadId: string) => {
    setActiveThreadId(threadId)
    setIsNewConversationMode(false)
  }

  const handleDeleteConversation = async () => {
    if (!activeThreadId) return

    try {
      await deleteConversationMutation.mutateAsync({
        personaId: activePersona.id,
        threadId: activeThreadId,
      })
      // Start fresh with a new conversation
      setActiveThreadId(null)
      setIsNewConversationMode(true)
      setShowDeleteDialog(false)
      toast({
        title: 'Conversa apagada',
        description: 'A conversa foi removida com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro ao apagar',
        description: 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return

    if (profile && profile.posts_remaining <= 0) {
      setShowUpgradeDialog(true)
      return
    }

    const currentInput = input
    setInput('')
    setPendingMessage(currentInput)
    setIsGenerating(true)

    try {
      const response = await fetch('/api/assistants/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentInput,
          assistantId: activePersona.assistantId,
          threadId: activeThreadId,
          personaId: activePersona.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()

      // Update activeThreadId if this was a new conversation
      if (data.threadId && !activeThreadId) {
        setActiveThreadId(data.threadId)
        setIsNewConversationMode(false)
      }

      // Invalidate cache to refetch messages from database
      await queryClient.invalidateQueries({ queryKey: ['chat', activePersona.id] })
      await queryClient.invalidateQueries({ queryKey: ['conversations', activePersona.id] })
      await refreshProfile()
    } catch (error) {
      toast({
        title: 'Erro ao gerar resposta',
        description: 'Tente novamente em alguns segundos.',
        variant: 'destructive',
      })
    } finally {
      setPendingMessage(null)
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast({
      title: 'Copiado!',
      description: 'Texto copiado para a área de transferência.',
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const PersonaIcon = activePersona.icon
  const hasConversations = conversations && conversations.length > 0
  const currentConversation = conversations?.find(c => c.thread_id === activeThreadId)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Persona Selector - Desktop */}
      <div className="hidden lg:block">
        <PersonaSelector
          activePersonaId={activePersona.id}
          onSelectPersona={handleSelectPersona}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-warm-gray/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <PersonaSelector
                    activePersonaId={activePersona.id}
                    onSelectPersona={handleSelectPersona}
                  />
                </SheetContent>
              </Sheet>

              {/* Back Button - Desktop */}
              <Link href="/dashboard" className="hidden lg:block">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-orange-accent/10"
              )}>
                <PersonaIcon className={cn("w-5 h-5", activePersona.color)} />
              </div>
              <div>
                <h1 className="font-semibold text-warm-black">{activePersona.name}</h1>
                <p className="text-sm text-warm-gray">
                  {activePersona.role}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Conversations Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {currentConversation
                        ? truncateText(currentConversation.first_message || 'Conversa', 20)
                        : 'Nova conversa'
                      }
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuItem onClick={handleNewConversation} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova conversa
                  </DropdownMenuItem>

                  {hasConversations && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-xs font-medium text-warm-gray">
                        Conversas anteriores
                      </div>
                      {conversations.map((conv) => (
                        <DropdownMenuItem
                          key={conv.thread_id}
                          onClick={() => handleSelectConversation(conv.thread_id)}
                          className={cn(
                            "flex flex-col items-start gap-1",
                            activeThreadId === conv.thread_id && "bg-warm-gray/10"
                          )}
                        >
                          <span className="font-medium text-sm">
                            {truncateText(conv.first_message || 'Conversa sem título', 35)}
                          </span>
                          <span className="text-xs text-warm-gray">
                            {formatDate(conv.created_at)} • {conv.message_count} mensagens
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete Current Conversation */}
              {activeThreadId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  title="Apagar conversa"
                >
                  <Trash2 className="w-5 h-5 text-warm-gray" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollRef} className="flex-1 px-6">
          <div className="py-6 space-y-6 max-w-3xl mx-auto">
            {/* Loading History */}
            {(isLoadingHistory || isLoadingConversations) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-4"
              >
                <div className="flex items-center gap-2 text-warm-gray">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando...</span>
                </div>
              </motion.div>
            )}

            {/* Suggested Prompts - only show for new conversations */}
            {!isLoadingHistory && !activeThreadId && messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 mt-4"
              >
                <p className="text-sm text-warm-gray">Experimente:</p>
                <div className="flex flex-wrap gap-2">
                  {activePersona.suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-2 text-sm bg-warm-gray/5 hover:bg-warm-gray/10 text-warm-black rounded-full transition-colors text-left"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-orange-accent/10">
                        <PersonaIcon className={cn("w-4 h-4", activePersona.color)} />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn(
                    'max-w-xl group',
                    message.role === 'user' ? 'order-1' : ''
                  )}>
                    <div className={cn(
                      'rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-warm-black text-warm-white rounded-br-sm'
                        : 'bg-warm-gray/10 text-warm-black rounded-bl-sm'
                    )}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 mr-1 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        Copiar
                      </Button>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {getInitials(profile?.full_name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading State */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-orange-accent/10">
                    <PersonaIcon className={cn("w-4 h-4", activePersona.color)} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-warm-gray/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-accent" />
                    <span className="text-warm-gray">Pensando...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-warm-gray/10 bg-warm-white">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Converse com ${activePersona.name}...`}
                className="min-h-[60px] max-h-[200px] pr-14 resize-none"
                disabled={isGenerating}
              />
              <Button
                size="icon"
                className="absolute right-2 bottom-2"
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-warm-gray mt-2 text-center">
              Pressione Enter para enviar ou Shift + Enter para nova linha
            </p>
          </div>
        </div>

        {/* Upgrade Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-accent" />
                Limite de posts atingido
              </DialogTitle>
              <DialogDescription>
                Você usou todos os seus posts gratuitos. Faça upgrade para continuar criando conteúdo incrível!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="bg-orange-accent/10 rounded-lg p-4">
                <h4 className="font-medium text-warm-black mb-2">Plano Pro</h4>
                <ul className="text-sm text-warm-gray space-y-1">
                  <li>• 50 posts por mês</li>
                  <li>• IA avançada com imagens</li>
                  <li>• Suporte prioritário</li>
                </ul>
                <p className="text-2xl font-bold text-warm-black mt-3">
                  R$ 49,90<span className="text-sm font-normal text-warm-gray">/mês</span>
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeDialog(false)}>
                  Voltar
                </Button>
                <Link href="/dashboard/billing" className="flex-1">
                  <Button variant="accent" className="w-full">
                    Ver planos
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Conversation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-warm-gray" />
                Apagar conversa
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja apagar esta conversa? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteConversation}
                disabled={deleteConversationMutation.isPending}
              >
                {deleteConversationMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Apagar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
