import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export function LoginButton() {
  return (
    <Link to="/auth/login">
      <Button
        className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        size={'sm'}
      >
        Login
      </Button>
    </Link>
  )
}
