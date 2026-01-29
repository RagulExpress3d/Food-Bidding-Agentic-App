
import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface Props {
  orders: Order[];
}

const getAgentTheme = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('pizza') || n.includes('regina') || n.includes('domino')) {
    return { emoji: '🍕', accent: 'text-red-600', bg: 'bg-dd-orange' };
  }
  if (n.includes('sea') || n.includes('oyster') || n.includes('fish') || n.includes('legal') || n.includes('catch') || n.includes('lobster')) {
    return { emoji: '🦞', accent: 'text-cyan-700', bg: 'bg-cyan-600' };
  }
  if (n.includes('burger') || n.includes('mcdonald') || n.includes('wendy') || n.includes('king') || n.includes('tasty')) {
    return { emoji: '🍔', accent: 'text-amber-800', bg: 'bg-amber-600' };
  }
  if (n.includes('taqueria') || n.includes('taco') || n.includes('chipotle') || n.includes('mexican') || n.includes('burrito') || n.includes('anna') || n.includes('pelón')) {
    return { emoji: '🌮', accent: 'text-emerald-700', bg: 'bg-emerald-600' };
  }
  if (n.includes('dunkin') || n.includes('starbucks') || n.includes('flour') || n.includes('coffee')) {
    return { emoji: '🍩', accent: 'text-stone-700', bg: 'bg-stone-600' };
  }
  return { emoji: '🍱', accent: 'text-dd-orange', bg: 'bg-dd-orange' };
};

const Tracking: React.FC<Props> = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);
  const [etaOffsets, setEtaOffsets] = useState<Record<string, number>>({});
  const [progressStates, setProgressStates] = useState<Record<string, number>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [isOfferClaimed, setIsOfferClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isOfferExpired, setIsOfferExpired] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [addedPrice, setAddedPrice] = useState(0);

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

    // Initial delay for notification
    const notifyTimer = setTimeout(() => setShowNotification(true), 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(notifyTimer);
    };
  }, [orders]);

  useEffect(() => {
    if (showNotification && timeLeft > 0 && !isOfferClaimed) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsOfferExpired(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showNotification, isOfferClaimed]);

  if (orders.length === 0) return null;

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const progress = progressStates[activeOrder.id] || 1;
  const eta = etaOffsets[activeOrder.id] || 15;
  const theme = getAgentTheme(activeOrder.bid.agentName);
  const upsellPrice = 5.95; // Simulated upsell cost

  const handleClaimOffer = () => {
    setIsOfferClaimed(true);
    setAddedPrice(upsellPrice);
    // Auto close notification after claim
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handlePass = () => {
    setShowNotification(false);
  };

  const totalWithUpsell = activeOrder.total + addedPrice;

  return (
    <div className="animate-in fade-in duration-700 relative pb-32">
      {/* Order Selector */}
      {orders.length > 1 && (
        <div className="flex gap-4 overflow-x-auto p-6 scrollbar-hide bg-white border-b sticky top-0 z-40">
          {orders.map(order => (
            <button
              key={order.id}
              onClick={() => {
                setSelectedOrderId(order.id);
                setAddedPrice(0);
                setIsOfferClaimed(false);
                setTimeLeft(60);
                setIsOfferExpired(false);
              }}
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
            TOTAL: ${totalWithUpsell.toFixed(2)}
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-dd-dark italic">ORDER FEED</h2>
          <p className="text-[10px] font-black text-dd-muted uppercase font-bold mt-1 tracking-widest">ORDER ID: {activeOrder.id}</p>
        </div>

        <div className="space-y-10">
          {/* Status Tracker */}
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

          {/* Logistics View */}
          <div className="bg-dd-dark p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-dd-orange to-transparent"></div>
            <h3 className="text-[10px] font-black uppercase text-white/40 mb-8 tracking-[0.4em]">Logistics Status</h3>
            
            <div className="flex items-center justify-between mb-10 px-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white font-black text-xl border-2 border-white/5">
                   {theme.emoji}
                </div>
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest truncate max-w-[60px]">{activeOrder.bid.agentName}</div>
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
                 <div className="text-[9px] font-black text-dd-orange animate-pulse uppercase tracking-widest">En Route</div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-dd-orange rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl ring-4 ring-dd-orange/20">
                   You
                </div>
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest">Drop-Off</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div className="text-center">
                <div className="text-5xl font-black text-white tracking-tighter tabular-nums">{eta}</div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">Mins to Arrival</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-emerald-400 tracking-tighter">ELITE</div>
                <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-1">Delivery Skill</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Agent Notification UI */}
      <div className="fixed bottom-32 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
        {showNotification && !isChatOpen && (
          <div className="bg-dd-orange p-6 rounded-[2.5rem] w-80 shadow-[0_20px_60px_rgba(255,48,8,0.4)] border-4 border-white animate-in slide-in-from-bottom-10 duration-500 pointer-events-auto relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
               <button onClick={handlePass} className="text-white/40 hover:text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg ring-4 ring-white/20">
                  {theme.emoji}
               </div>
               <div>
                 <span className="text-[10px] font-black uppercase text-white tracking-[0.2em] leading-none block">{activeOrder.bid.agentName}</span>
                 <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Direct Line</span>
               </div>
            </div>

            <p className="text-sm font-bold text-white leading-snug mb-5 italic">
              "{activeOrder.bid.expertTip}"
            </p>

            {isOfferClaimed ? (
              <div className="bg-white/10 border border-white/20 p-3 rounded-2xl flex items-center gap-3 animate-in zoom-in-95">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3008" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Item Added to Order</span>
              </div>
            ) : isOfferExpired ? (
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center py-2">Offer Expired</div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={handleClaimOffer}
                  className="w-full bg-dd-dark text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all hover:bg-black group-hover:bg-black flex flex-col items-center"
                >
                  <span className="block mb-0.5">CLAIM {activeOrder.bid.bonusOffer || 'REWARD'}</span>
                  <span className="text-[8px] text-white/50">ONLY +${upsellPrice.toFixed(2)}</span>
                </button>
                <div className="flex items-center justify-center gap-2">
                   <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
                   </div>
                   <span className="text-[9px] font-black text-white tabular-nums tracking-widest">{timeLeft}s</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agent Bubble Button */}
        <button 
          onClick={() => setShowNotification(!showNotification)}
          className={`pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all active:scale-90 border-4 border-white group relative ${
            showNotification ? 'bg-dd-dark ring-dd-orange/20 ring-8' : 'bg-dd-orange ring-dd-orange/20 ring-4 animate-battle'
          }`}
        >
          {showNotification ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ) : (
            <span>{theme.emoji}</span>
          )}
          {!showNotification && !isOfferExpired && !isOfferClaimed && (
             <span className="absolute -top-1 -right-1 w-5 h-5 bg-dd-dark text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">1</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Tracking;
