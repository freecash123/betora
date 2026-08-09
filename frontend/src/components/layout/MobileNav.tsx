'use client';
import React from 'react';import Link from 'next/link';import { usePathname } from 'next/navigation';import { Home, Activity, Clock, Ticket, Wallet } from 'lucide-react';

const items = [{href:'/',icon:Home,label:'Home'},{href:'/live',icon:Activity,label:'Live'},{href:'/sports',icon:Clock,label:'Sports'},{href:'/bets',icon:Ticket,label:'Bets'},{href:'/wallet',icon:Wallet,label:'Wallet'}];

export function MobileNav() {
  const pathname = usePathname();
  return (<nav className='lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-light/95 backdrop-blur-sm border-t border-surface-border'><div className='flex items-center justify-around h-16'>{items.map(({href,icon:Icon,label})=>{const active=pathname===href||(href!=='/'&&pathname.startsWith(href));return(<Link key={href} href={href} className={`flex flex-col items-center gap-1 px-2 py-1 ${active?'text-primary':'text-text-muted'}`}><Icon size={20}/><span className='text-xs font-medium'>{label}</span></Link>)})}</div></nav>);
}