
import React, { useState, useEffect } from 'react';
import { Step, UserConstraints, Bid, Order } from './types';
import { INSPIRATION_CATEGORIES } from './constants';
import Header from './components/Header';
import InspirationCarousel from './components/InspirationCarousel';
import RequestForm from './components/RequestForm';
import BidList from './components/BidList';
import Checkout from './components/Checkout';
import Tracking from './components/Tracking';
import NegotiationChat from './components/NegotiationChat';
import { generateBids } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('INSPIRATION');
  const [constraints, setConstraints] = useState<UserConstraints>({
    duration: 'single',
    budgetCap: 25,
    dietaryTags: [],
    itemPref: '',
    quantity: 1
  });
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStartWithInspiration = (pref: string) => {
    setConstraints({
      duration: 'single',
      budgetCap: 25,
      dietaryTags: [],
      itemPref: pref,
      quantity: 1
    });
    setBids([]);
    setSelectedBid(null);
    setStep('FORM');
  };

  const handleFormSubmit = async (data: UserConstraints) => {
    setConstraints(data);
    setLoading(true);
    setStep('BIDDING');
    try {
      const generated = await generateBids(data);
      setBids(generated);
    } catch (error) {
      console.error("Failed to generate bids", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBid = (bid: Bid) => {
    setSelectedBid(bid);
    setStep('CHECKOUT');
  };

  const handleNegotiateBid = (bid: Bid) => {
    setSelectedBid(bid);
    setStep('NEGOTIATION');
  };

  const handleAcceptNegotiatedDeal = (newPrice: number, newOffer: string, newQty: number) => {
    if (selectedBid) {
      setConstraints(prev => ({ ...prev, quantity: newQty }));
      setSelectedBid({
        ...selectedBid,
        bidPrice: newPrice,
        offer: newOffer
      });
      setStep('CHECKOUT');
    }
  };

  const handlePaymentComplete = () => {
    if (selectedBid) {
      const unitPrice = selectedBid.bidPrice;
      const qty = constraints.quantity || 1;
      const durationMultiplier = constraints.duration === 'single' ? 1 : parseInt(constraints.duration);
      const subtotal = unitPrice * qty * durationMultiplier;
      const taxes = subtotal * 0.07;
      const total = subtotal + taxes;

      const newOrder: Order = {
        id: `#MATCH-${Math.floor(Math.random() * 9000 + 1000)}`,
        bid: { ...selectedBid },
        quantity: qty,
        unitPrice: unitPrice,
        subtotal: subtotal,
        taxes: taxes,
        total: total,
        timestamp: Date.now()
      };

      setOrders(prev => [newOrder, ...prev]);
      setStep('TRACKING');
    }
  };

  const navigateTo = (targetStep: Step) => {
    if (targetStep === 'BIDDING' && bids.length === 0 && !loading) return;
    if (targetStep === 'CHECKOUT' && !selectedBid) return;
    if (targetStep === 'TRACKING' && orders.length === 0) return;
    setStep(targetStep);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-[0_0_100px_rgba(0,0,0,0.05)] border-x border-dd-light relative">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-24">
        <div className={(step === 'NEGOTIATION' || step === 'TRACKING' || step === 'INSPIRATION') ? '' : 'p-6'}>
          {step === 'INSPIRATION' && (
            <div className="p-6">
               <InspirationCarousel onSelect={handleStartWithInspiration} />
            </div>
          )}

          {step === 'FORM' && (
            <RequestForm 
              initialData={constraints} 
              onSubmit={handleFormSubmit} 
            />
          )}

          {step === 'BIDDING' && (
            <BidList 
              bids={bids} 
              isLoading={loading} 
              onSelect={handleSelectBid}
              onNegotiate={handleNegotiateBid}
              onBack={() => setStep('FORM')}
            />
          )}

          {step === 'NEGOTIATION' && selectedBid && (
            <NegotiationChat
              bid={selectedBid}
              constraints={constraints}
              onAccept={handleAcceptNegotiatedDeal}
              onBack={() => setStep('BIDDING')}
            />
          )}

          {step === 'CHECKOUT' && selectedBid && (
            <Checkout 
              bid={selectedBid} 
              constraints={constraints}
              onSuccess={handlePaymentComplete}
              onBack={() => setStep('BIDDING')}
            />
          )}

          {step === 'TRACKING' && (
            <Tracking orders={orders} />
          )}
        </div>
      </main>

      {/* Arena Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-xl border-t border-dd-light p-4 flex justify-around items-center z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => navigateTo('INSPIRATION')}
          className={`flex flex-col items-center gap-1.5 transition-all px-4 py-2 rounded-2xl ${step === 'INSPIRATION' ? 'text-dd-orange bg-dd-orange/5 font-black scale-105' : 'text-dd-muted font-bold'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 5.886h6.19l-5.007 3.638 1.912 5.886L12 14.772l-5.007 3.638 1.912-5.886-5.007-3.638h6.19L12 3z"/></svg>
          <span className="text-[9px] uppercase tracking-widest">Taste</span>
        </button>
        <button 
          onClick={() => navigateTo('FORM')}
          className={`flex flex-col items-center gap-1.5 transition-all px-4 py-2 rounded-2xl ${step === 'FORM' ? 'text-dd-orange bg-dd-orange/5 font-black scale-105' : 'text-dd-muted font-bold'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
          <span className="text-[9px] uppercase tracking-widest">Order</span>
        </button>
        <button 
          onClick={() => navigateTo('BIDDING')}
          disabled={bids.length === 0 && !loading}
          className={`flex flex-col items-center gap-1.5 transition-all px-4 py-2 rounded-2xl ${step === 'BIDDING' || step === 'NEGOTIATION' ? 'text-dd-orange bg-dd-orange/5 font-black scale-105' : (bids.length > 0 ? 'text-dd-muted font-bold' : 'opacity-20 cursor-not-allowed')}`}
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 8-6 6-6-6"/><path d="M12 16V4"/></svg>
            {bids.length > 0 && step !== 'BIDDING' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-dd-orange rounded-full border-2 border-white"></span>}
          </div>
          <span className="text-[9px] uppercase tracking-widest">Bids</span>
        </button>
        <button 
          onClick={() => navigateTo('TRACKING')}
          disabled={orders.length === 0}
          className={`flex flex-col items-center gap-1.5 transition-all px-4 py-2 rounded-2xl ${step === 'TRACKING' ? 'text-dd-orange bg-dd-orange/5 font-black scale-105' : (orders.length > 0 ? 'text-dd-muted font-bold' : 'opacity-20 cursor-not-allowed')}`}
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 9.18 0A4 4 0 0 1 18 13.87"/><path d="M3 15h18"/><path d="M3 19h18"/></svg>
             {orders.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>}
          </div>
          <span className="text-[9px] uppercase tracking-widest">Plate</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
