import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function getEmbedUrl(youtubeUrl: string) {
  const urlObj = new URL(youtubeUrl)
  let videoId = ''

  if (urlObj.hostname.includes('youtube.com')) {
    videoId = urlObj.searchParams.get('v')!
  } else if (urlObj.hostname.includes('youtu.be')) {
    videoId = urlObj.pathname.slice(1)
  }

  return `https://www.youtube.com/embed/${videoId}`
}
