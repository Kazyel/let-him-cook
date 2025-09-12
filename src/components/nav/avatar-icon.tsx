import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import type { UserMetadata } from '@/types/user'
import { useAuth } from '@/lib/providers/auth-provider'

export function AvatarIcon() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const userMetadata = user.user_metadata as UserMetadata

  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src={user.user_metadata.avatar_url} />
      <AvatarFallback>
        {userMetadata.display_name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
