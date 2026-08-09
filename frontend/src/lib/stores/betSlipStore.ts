'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BetSlipItem { eventId:string;eventName:string;marketId:string;marketName:string;selectionId:string;selectionName:string;odds:number;homeTeam:string;awayTeam:string;startTime:string;isLive:boolean }

interface BetSlipState {
  items:BetSlipItem[];stake:string;betType:'SINGLE'|'MULTIPLE';isOpen:boolean;
  addItem:(item:BetSlipItem)=>void;removeItem:(id:string)=>void;clearSlip:()=>void;
  setStake:(s:string)=>void;setBetType:(t:'SINGLE'|'MULTIPLE')=>void;toggleOpen:()=>void;setOpen:(o:boolean)=>void;
  totalOdds:()=>number;potentialWinnings:()=>number;
}

export const useBetSlipStore = create<BetSlipState>()(persist((set,get)=>({
  items:[],stake:'',betType:'MULTIPLE',isOpen:false,
  addItem:(item)=>{const items=get().items;const exists=items.find(i=>i.selectionId===item.selectionId);set(exists?{items:items.filter(i=>i.selectionId!==item.selectionId)}:{items:[...items,item],isOpen:true})},
  removeItem:(id)=>set({items:get().items.filter(i=>i.selectionId!==id)}),
  clearSlip:()=>set({items:[],stake:''}),
  setStake:(s)=>set({stake:s}),setBetType:(t)=>set({betType:t}),
  toggleOpen:()=>set({isOpen:!get().isOpen}),setOpen:(o)=>set({isOpen:o}),
  totalOdds:()=>get().items.reduce((t,i)=>t*i.odds,1),
  potentialWinnings:()=>(parseFloat(get().stake)||0)*get().totalOdds(),
}),{name:'betora-betslip'}));