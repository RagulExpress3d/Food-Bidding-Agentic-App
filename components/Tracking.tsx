
import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface Props {
  orders: Order[];
}

const Tracking: React.FC<Props> = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);
  const [etaOffsets, setEtaOffsets] = useState<Record<string, number>>({});
  const [progressStates, setProgressStates] = useState<Record<string, number>>({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const newEtaOffsets = { ...etaOffsets };
    const newProgressStates = { ...progressStates };
    orders.forEach(order => {
      if (newEtaOffsets[order.id] === undefined) newEtaOffsets[order.id] = 18 + Math.floor(Math.random() * 12);
      if (newProgressStates[order.id] === undefined) newProgressStates[order.id] = 1;
    });
    setEtaOffsets(newEtaOffsets);
    setProgressStates(newProgressStates);

    const timer = setInterval(() => {
      setProgressStates(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          if (next[id] < 4) next[id] += 1;
        });
        return next;
      });
      setEtaOffsets(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          if (next[id] > 5) next[id] -= 1;
        });
        return next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-12">
        <div className="w-24 h-24 bg-dd-light rounded-full flex items-center justify-center mb-6 text-dd-muted border-4 border-dashed border-dd-muted/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Intel Blackout</h2>
        <p className="text-dd-muted font-bold text-xs mt-3 uppercase tracking-widest leading-loose">Launch a Grub War to start the tracking sequence.</p>
      </div>
    );
  }

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const progress = progressStates[activeOrder.id] || 1;
  const eta = etaOffsets[activeOrder.id] || 15;

  const handleClaimBonus = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="animate-in fade-in duration-700 relative pb-10">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-6 duration-300">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Bonus Activated</span>
          </div>
        </div>
      )}

      {/* Arena Selector */}
      {orders.length > 1 && (
        <div className="flex gap-4 overflow-x-auto p-6 scrollbar-hide bg-white border-b sticky top-0 z-40">
          {orders.map(order => (
            <button
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className={`flex-none px-6 py-3 rounded-full text-[10px] font-black uppercase border-2 transition-all active:scale-95 ${
                selectedOrderId === order.id 
                ? 'bg-dd-orange border-dd-orange text-white shadow-xl shadow-dd-orange/20' 
                : 'bg-white border-dd-light text-dd-muted'
              }`}
            >
              {order.bid.agentName}
            </button>
          ))}
        </div>
      )}

      <div className="p-6">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase mb-3 tracking-[0.2em]">
            VICTORY SECURED: {activeOrder.bid.agentName}
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-dd-dark italic">TACTICAL FEED</h2>
          <p className="text-[10px] font-black text-dd-muted uppercase font-bold mt-1 tracking-widest">REF ID: {activeOrder.id}</p>
        </div>

        <div className="space-y-10">
          {/* Status Intel */}
          <div className="relative pl-12 space-y-12">
            <div className="absolute left-3 top-0 bottom-0 w-2 bg-dd-light rounded-full"></div>
            <div className="absolute left-3 top-0 w-2 bg-dd-orange rounded-full transition-all duration-1000 ease-out" style={{ height: `${(progress / 4) * 100}%` }}></div>
            
            {activeOrder.bid.statusTimeline.map((status, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-12 w-8 h-8 rounded-full border-4 border-white ring-4 transition-all duration-700 ${
                  progress > i ? 'bg-dd-orange ring-dd-orange/10' : 'bg-dd-light ring-transparent'
                }`}></div>
                <div className={`text-base font-black uppercase tracking-tight transition-all duration-700 ${progress > i ? 'text-dd-dark scale-105 origin-left' : 'text-dd-muted opacity-50'}`}>
                  {status}
                </div>
              </div>
            ))}
          </div>

          {/* Logistics Feed */}
          <div className="bg-dd-dark p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-dd-orange to-transparent"></div>
            <h3 className="text-[10px] font-black uppercase text-white/40 mb-8 tracking-[0.4em]">War Zone Logistics</h3>
            
            <div className="flex items-center justify-between mb-10 px-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white font-black text-xl border-2 border-white/5">
                   {activeOrder.bid.agentName.charAt(0)}
                </div>
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest">{activeOrder.bid.agentName}</div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-3 px-6">
                 <div className="w-full h-2 bg-white/5 rounded-full relative">
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                      style={{ left: `${(progress / 4) * 100}%` }}
                    >
                      <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] inline-block -translate-x-1/2">🛵</span>
                    </div>
                 </div>
                 <div className="text-[9px] font-black text-dd-orange animate-pulse uppercase tracking-widest">In Motion</div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-dd-orange rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl ring-4 ring-dd-orange/20">
                   HQ
                </div>
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest">Base</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div className="text-center">
                <div className="text-5xl font-black text-white tracking-tighter tabular-nums">{eta}</div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">Mins to Drop</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-emerald-400 tracking-tighter">ELITE</div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">Driver Skill</div>
              </div>
            </div>
          </div>

          {/* Agent Hotline */}
          <div className="bg-dd-orange p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-dd-orange/20 border-4 border-white">
            <div className="absolute top-8 right-8 opacity-10 group-hover:scale-125 transition-transform group-hover:opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg text-dd-orange font-black shadow-xl">
                  {activeOrder.bid.agentName.charAt(0)}
               </div>
               <span className="text-xs font-black uppercase text-white tracking-[0.2em] leading-none">Intelligence Drop</span>
            </div>
            <p className="text-xl font-bold text-white leading-tight mb-8 italic">
              "{activeOrder.bid.expertTip}"
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleClaimBonus}
                className="flex-1 bg-dd-dark text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-black"
              >
                Claim {activeOrder.bid.bonusOffer || 'Reward'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
