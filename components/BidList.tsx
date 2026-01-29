
import React from 'react';
import { Bid } from '../types';

interface Props {
  bids: Bid[];
  isLoading: boolean;
  onSelect: (bid: Bid) => void;
  onNegotiate: (bid: Bid) => void;
  onBack: () => void;
}

const BidList: React.FC<Props> = ({ bids, isLoading, onSelect, onNegotiate, onBack }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="relative mb-12">
          {/* Preparation Visual */}
          <div className="w-32 h-32 border-[8px] border-dd-light border-t-dd-orange rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-dd-orange rounded-3xl animate-battle flex items-center justify-center text-white shadow-2xl">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="M12 20v2"/><path d="m17.66 17.66 1.41 1.41"/><path d="M20 12h2"/><path d="m17.66 6.34 1.41-1.41"/></svg>
             </div>
          </div>
          {/* Orbiting Agent Bubbles */}
          <div className="absolute -top-4 -left-4 w-10 h-10 bg-dd-dark rounded-full animate-bounce delay-100 shadow-xl border-2 border-white"></div>
          <div className="absolute -bottom-2 -right-6 w-12 h-12 bg-dd-muted rounded-full animate-pulse delay-300 shadow-xl border-2 border-white"></div>
          <div className="absolute top-1/2 -right-10 w-8 h-8 bg-emerald-500 rounded-full animate-bounce shadow-xl border-2 border-white"></div>
        </div>
        <h3 className="font-black text-3xl uppercase tracking-tighter italic">WAR ROOM <span className="text-dd-orange">LIVE</span></h3>
        <p className="text-dd-muted font-bold text-xs mt-3 uppercase tracking-widest">Kitchens are scrambling for your order...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-10">
      <div className="flex items-end justify-between px-2">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-dd-dark leading-none italic">THE <span className="text-dd-orange">GRUB</span> ROOM</h2>
          <p className="text-[10px] font-black text-dd-muted uppercase tracking-[0.2em] mt-2">{bids.length} AGENTS COMPETING FOR YOUR CASH</p>
        </div>
        <button onClick={onBack} className="bg-dd-light text-dd-dark px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-transparent hover:border-dd-orange transition-all">Abort</button>
      </div>

      <div className="space-y-6">
        {bids.map((bid, i) => (
          <div 
            key={i}
            className="bg-white border-4 border-dd-light rounded-[2.5rem] overflow-hidden hover:border-dd-orange transition-all shadow-xl shadow-black/5"
          >
            <div className="p-7">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {/* Agent Bubble */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-dd-dark rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl ring-4 ring-dd-orange/5">
                      {bid.agentName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tight leading-tight">{bid.agentName}</h3>
                    <div className="text-[10px] font-black text-dd-orange uppercase tracking-widest mt-1">
                      {bid.neighborhood || 'Boston Core'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-dd-muted line-through font-black opacity-50 tracking-tighter">${bid.realPrice.toFixed(2)}</div>
                  <div className="text-3xl font-black text-dd-dark tracking-tighter leading-none">${bid.bidPrice.toFixed(2)}</div>
                  <div className="text-[8px] font-black bg-emerald-500 text-white px-2 py-1 rounded-md uppercase tracking-widest mt-2">BEST DEAL</div>
                </div>
              </div>
              
              <div className="bg-dd-light p-5 rounded-[1.5rem] mb-6">
                <p className="text-sm font-bold text-dd-dark leading-snug mb-3 italic">"{bid.offer}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase text-dd-muted tracking-widest">The Edge:</span>
                  <span className="text-[10px] font-black text-dd-orange uppercase tracking-tight">{bid.moat}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => onNegotiate(bid)}
                  className="flex-1 bg-white border-2 border-dd-dark text-dd-dark py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-dd-dark hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  Negotiate
                </button>
                <button 
                  onClick={() => onSelect(bid)}
                  className="flex-[1.5] bg-dd-orange text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-dd-orange/20 hover:bg-dd-dark transition-all active:scale-95"
                >
                  Accept Victory
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidList;
