import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { CogIcon, LogOutIcon, Moon, Sun, UserIcon } from 'lucide-react'
import { AvatarIcon } from './avatar-icon'
import type { UserMetadata } from '@/types/user'
import { useAuth } from '@/lib/providers/auth-provider'
import { useTheme } from '@/lib/providers/theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import supabase from '@/services/supabase'

export function AvatarDropdown() {
  const { user } = useAuth()
  const { setTheme } = useTheme()

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
        className="translate-y-5 rounded-sm w-[max(100px,_250px)] dark:bg-black bg-white"
      >
        {/* Menu Label */}
        <DropdownMenuLabel className=" tracking-tight p-2 text-base flex-col flex">
          Olá, {userMetadata.display_name}!{' '}
          <span className="text-sm text-foreground/50">{user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile Link */}
        <Link to="/profile/$userId" params={{ userId: user.id }}>
          <DropdownMenuItem className="cursor-pointer tracking-tight py-3 px-2.5 rounded-sm">
            <UserIcon className="size-5" /> Profile
          </DropdownMenuItem>
        </Link>

        {/* Account Settings */}
        <DropdownMenuItem className="cursor-pointer tracking-tight py-3 px-2.5 rounded-sm">
          <CogIcon className="size-5" /> Account Preferences
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="py-3 px-2.5">
            <Sun className="text-muted-foreground size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 mr-2" />
            <Moon className="text-muted-foreground absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 mr-2" />
            <span>Change theme</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent className="-translate-x-2 dark:bg-black bg-white">
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className="cursor-pointer tracking-tight py-3 px-2.5 rounded-sm"
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className="cursor-pointer tracking-tight py-3 px-2.5 rounded-sm"
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('system')}
                className="cursor-pointer tracking-tight py-3 px-2.5 rounded-sm"
              >
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Logout Button */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer tracking-tight font-medium py-1.5 px-2.5 rounded-sm"
        >
          <LogOutIcon className="size-5" />
          <span className="text-muted-foreground text-base">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
