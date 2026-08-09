'use client';
import { create } from 'zustand';
export const useWalletStore = create<{balance:number;bonusBalance:number;currency:string;setBalance:(b:number)=>void}>(set=>({balance:10000,bonusBalance:0,currency:'USD',setBalance:(b)=>set({balance:b})}));