'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { ChatMessage } from '@/types'

export interface Conversation {
  thread_id: string
  first_message: string
  created_at: string
  message_count: number
}

// Get all conversations (unique threads) for a persona
export function useConversations(personaId: string) {
  return useQuery({
    queryKey: ['conversations', personaId],
    queryFn: async () => {
      const supabase = createClient()!

      // Get all messages for this persona, ordered by date
      const { data, error } = await (supabase as any)
        .from('chat_history')
        .select('thread_id, content, created_at, role')
        .eq('persona_id', personaId)
        .not('thread_id', 'is', null)
        .order('created_at', { ascending: true }) as {
          data: { thread_id: string; content: string; created_at: string; role: string }[] | null;
          error: any
        }

      if (error) throw error
      if (!data || data.length === 0) return []

      // Group by thread_id and get first user message as title
      const conversationsMap = new Map<string, Conversation>()

      for (const msg of data) {
        if (!msg.thread_id) continue

        if (!conversationsMap.has(msg.thread_id)) {
          conversationsMap.set(msg.thread_id, {
            thread_id: msg.thread_id,
            first_message: msg.role === 'user' ? msg.content : '',
            created_at: msg.created_at,
            message_count: 1,
          })
        } else {
          const conv = conversationsMap.get(msg.thread_id)!
          conv.message_count++
          // Update first_message if we haven't found a user message yet
          if (!conv.first_message && msg.role === 'user') {
            conv.first_message = msg.content
          }
        }
      }

      // Convert to array and sort by date (newest first)
      return Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    },
    enabled: !!personaId,
  })
}

// Get chat history for a specific thread
export function useChatHistory(personaId: string, threadId: string | null) {
  return useQuery({
    queryKey: ['chat', personaId, threadId],
    queryFn: async () => {
      if (!threadId) return []

      const supabase = createClient()!
      const { data, error } = await (supabase as any)
        .from('chat_history')
        .select('*')
        .eq('persona_id', personaId)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as ChatMessage[]
    },
    enabled: !!personaId && !!threadId,
  })
}

// Get the most recent thread_id for a persona (for auto-selecting last conversation)
export function useLatestThreadId(personaId: string) {
  return useQuery({
    queryKey: ['chat', personaId, 'latest-thread'],
    queryFn: async () => {
      const supabase = createClient()!
      const { data, error } = await (supabase as any)
        .from('chat_history')
        .select('thread_id')
        .eq('persona_id', personaId)
        .not('thread_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error
      return data?.[0]?.thread_id ?? null
    },
    enabled: !!personaId,
  })
}

export function useSaveMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message: {
      role: 'user' | 'assistant'
      content: string
      persona_id: string
      thread_id?: string | null
    }) => {
      const supabase = createClient()!
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await (supabase as any)
        .from('chat_history')
        .insert({
          user_id: user.id,
          role: message.role,
          content: message.content,
          persona_id: message.persona_id,
          thread_id: message.thread_id,
        })
        .select()
        .single()

      if (error) throw error
      return data as ChatMessage
    },
    onSuccess: (data) => {
      if (data.persona_id) {
        queryClient.invalidateQueries({ queryKey: ['chat', data.persona_id] })
        queryClient.invalidateQueries({ queryKey: ['conversations', data.persona_id] })
      }
    },
  })
}

// Delete a specific conversation by thread_id
export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ personaId, threadId }: { personaId: string; threadId: string }) => {
      const supabase = createClient()!
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await (supabase as any)
        .from('chat_history')
        .delete()
        .eq('persona_id', personaId)
        .eq('thread_id', threadId)

      if (error) throw error
    },
    onSuccess: (_, { personaId }) => {
      // Invalidate all chat-related queries for this persona
      queryClient.invalidateQueries({ queryKey: ['chat', personaId] })
      queryClient.invalidateQueries({ queryKey: ['conversations', personaId] })
    },
  })
}

// Clear all conversations for a persona
export function useClearAllConversations() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (personaId: string) => {
      const supabase = createClient()!
      const { error } = await (supabase as any)
        .from('chat_history')
        .delete()
        .eq('persona_id', personaId)

      if (error) throw error
    },
    onSuccess: (_, personaId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', personaId] })
      queryClient.invalidateQueries({ queryKey: ['conversations', personaId] })
    },
  })
}
