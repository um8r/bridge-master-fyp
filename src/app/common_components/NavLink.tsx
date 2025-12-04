"use client"

import Link from "next/link"
import { ReactNode } from "react"

interface NavLinkProps {
  href: string
  children: ReactNode
  onClick?: () => void
}

export default function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-700 hover:text-blue-600 transition font-medium"
    >
      {children}
    </Link>
  )
}
