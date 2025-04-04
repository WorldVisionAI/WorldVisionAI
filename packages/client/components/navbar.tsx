'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Home,
  MessageCircle,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />,
    },
    // {
    //   name: 'Launch',
    //   href: '/launch',
    //   icon: <PlusCircle className="h-5 w-5" />,
    // },
    // {
    //   name: 'Bet',
    //   href: '/bet',
    //   icon: <TrendingUp className="h-5 w-5" />,
    // },
    {
      name: 'Results',
      href: '/results',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'Chat',
      href: '/chatbot',
      icon: <MessageCircle className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800 shadow-lg rounded-t-3xl">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="w-full">
            <Button
              variant="ghost"
              className={cn(
                'flex flex-col items-center justify-center h-full w-full rounded-t-3xl hover:bg-transparent active:bg-transparent',
                pathname === item.href
                  ? 'text-black dark:text-white'
                  : 'text-gray-400 dark:text-gray-500'
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
