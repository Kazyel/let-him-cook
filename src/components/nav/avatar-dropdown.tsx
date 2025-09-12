import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { CogIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { AvatarIcon } from './avatar-icon'
import type { UserMetadata } from '@/types/user'
import { useAuth } from '@/lib/providers/auth-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import supabase from '@/services/supabase'

export function AvatarDropdown() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    }
    toast.success('You have been logged out successfully.')
  }

  const userMetadata = user.user_metadata as UserMetadata

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <AvatarIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="translate-y-3 rounded-sm w-[max(100px,_250px)]"
      >
        {/* Menu Label */}
        <DropdownMenuLabel className=" tracking-tight p-2 text-base flex-col flex">
          Olá, {userMetadata.display_name}!{' '}
          <span className="text-sm text-black/50">{user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile Link */}
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer tracking-tight py-2 rounded-none">
            <UserIcon className="size-5" /> Profile
          </DropdownMenuItem>
        </Link>

        {/* Account Settings */}
        <DropdownMenuItem className="cursor-pointer tracking-tight py-2 rounded-none">
          <CogIcon className="size-5" /> Account Preferences
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout Button */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer  tracking-tight font-medium py-2 rounded-none"
        >
          <LogOutIcon className="size-5" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
