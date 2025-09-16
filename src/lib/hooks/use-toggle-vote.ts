import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ToggleVoteResponse } from '../types/supabase'
import { toggleUpvote } from '@/lib/services/supabase'

export function useToggleVote() {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation<
    ToggleVoteResponse,
    Error,
    { recipeId: string; userId: string }
  >({
    mutationFn: ({ recipeId, userId }) => toggleUpvote(recipeId, userId),
    onSettled: (_data, _error, variables) =>
      queryClient.invalidateQueries({
        queryKey: ['recipe', variables.recipeId],
      }),
  })

  return async (recipeId: string, userId: string) => {
    const status = await mutateAsync({
      recipeId: recipeId,
      userId: userId,
    })

    if (!status) {
      toast.error('Erro ao votar, tente novamente.')
      return
    }

    if (status.status === 'added') {
      toast.success('Votado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] })
      queryClient.invalidateQueries({
        queryKey: ['hasUpvoted', recipeId, userId],
      })
    }

    if (status.status === 'removed') {
      toast.success('Removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] })
      queryClient.invalidateQueries({
        queryKey: ['hasUpvoted', recipeId, userId],
      })
    }
  }
}
