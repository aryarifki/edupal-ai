import React from 'react'

export interface AvatarProps {
  src?: string
  alt?: string
  className?: string
  children?: React.ReactNode
}

export function Avatar({ src, alt, className = '', children }: AvatarProps) {
  return (
    <div className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" />
      ) : (
        children || <span className="text-sm font-medium">{alt?.[0]?.toUpperCase()}</span>
      )}
    </div>
  )
}
