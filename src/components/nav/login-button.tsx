import { Link } from '@tanstack/react-router'

export function LoginButton() {
  return (
    <Link
      className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      to="/auth/login"
    >
      Login
    </Link>
  )
}
