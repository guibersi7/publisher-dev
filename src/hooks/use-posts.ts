'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/types'

// Cast to any to avoid type inference issues with partial selects
const supabase = createClient() as any

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Post[]
    },
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Post
    },
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Post> & { id: string }) => {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts', data.id] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function usePostsByStatus(status: 'draft' | 'scheduled' | 'published') {
  return useQuery({
    queryKey: ['posts', 'status', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Post[]
    },
  })
}

export function useScheduledPosts(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['posts', 'scheduled', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .gte('scheduled_at', startDate.toISOString())
        .lte('scheduled_at', endDate.toISOString())
        .order('scheduled_at', { ascending: true })

      if (error) throw error
      return data as Post[]
    },
  })
}

