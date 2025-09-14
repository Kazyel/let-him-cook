import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditIcon, Loader2, SendIcon } from 'lucide-react'
import supabase from '@/services/supabase'

interface EditBioProps {
  userId: string
  currentBio: string
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

async function updateProfileBio(userId: string, bio: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      bio,
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Erro ao atualizar a biografia:', error.message)
    return
  }
}

export function EditBio({
  userId,
  currentBio,
  isEditing,
  setIsEditing,
}: EditBioProps) {
  const [bioMessage, setBioMessage] = useState(currentBio)

  const queryClient = useQueryClient()

  const { mutate: mutateBio, isPending } = useMutation({
    mutationFn: () => updateProfileBio(userId, bioMessage),
    onSuccess: () => {
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })

  if (!isEditing) {
    return (
      <button
        className="cursor-pointer flex gap-2 items-center text-amber-500 hover:text-amber-400 transition-all duration-150 text-sm"
        onClick={() => setIsEditing(true)}
      >
        <EditIcon className="size-4" />
        Editar Bio
      </button>
    )
  }

  return (
    <div className="relative w-[600px] h-40 mt-6">
      <textarea
        value={bioMessage}
        onChange={(e) => setBioMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            mutateBio()
          }
        }}
        className="shadow resize-none appearance-none border rounded size-full p-4 text-zinc-400 placeholder:text-zinc-400 leading-tight focus:outline-none focus:shadow-outline placeholder:italic"
        placeholder="Digite sua biografia..."
      />

      {isPending ? (
        <Loader2 className="right-3 bottom-3 absolute animate-spin rounded-full size-5 text-amber-500" />
      ) : (
        <button
          className="absolute right-3 bottom-3"
          onClick={() => mutateBio()}
        >
          <SendIcon className="size-5 cursor-pointer text-amber-500 hover:text-amber-400 transition-all duration-150" />
        </button>
      )}
    </div>
  )
}
