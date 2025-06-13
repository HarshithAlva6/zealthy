'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Home, Settings, Database } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Onboarding', icon: Home },
    { href: '/admin', label: 'Admin', icon: Settings },
    { href: '/data', label: 'Data', icon: Database },
  ]

  return (
    <nav className="bg-[#2C1345] shadow-md dark:shadow-[0_4px_15px_rgba(0,0,0,0.6)] border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-white" />
            <span className="text-xl text-[#F4EEE5] font-bold">Zealthy</span>
          </div>
          
          <div className="flex space-x-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium ${
                  pathname === href
                    ? 'bg-[#8077A3] text-white'
                    : 'text-gray-500 hover:text-[#F4EEE5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}