
import React, { useState } from 'react';
import { Bid, UserConstraints } from '../types';

interface Props {
  bid: Bid;
  constraints: UserConstraints;
  onSuccess: () => void;
  onBack: () => void;
}

const Checkout: React.FC<Props> = ({ bid, constraints, onSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState('');

  const handleAutofill = () => {
    setAddress('700 Boylston St, Boston Public Library, Boston, MA 02116');
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onSuccess();
    }, 2500);
  };

  const unitPrice = bid.bidPrice;
  const quantity = constraints.quantity || 1;
  const subtotal = unitPrice * quantity;
  const taxes = subtotal * 0.07;
  const total = subtotal + taxes;

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 border-8 border-dd-light rounded-full"></div>
          <div className="absolute inset-0 border-8 border-dd-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="animate-in fade-in zoom-in-95">
          <h3 className="text-3xl font-black uppercase tracking-tighter">Finalizing Deal</h3>
          <p className="text-dd-muted font-bold text-sm uppercase tracking-widest mt-2">Connecting with {bid.agentName} Kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-3 bg-dd-light hover:bg-dd-orange hover:text-white rounded-2xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="text-3xl font-black tracking-tighter uppercase">Victory Review</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border-2 border-dd-light shadow-2xl shadow-black/5">
        <h3 className="text-[10px] font-black uppercase text-dd-muted mb-5 tracking-[0.2em]">Battle Summary</h3>
        <div className="space-y-5 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-6">
              <span className="text-lg font-black block leading-none mb-1 uppercase tracking-tight">{bid.agentName}</span>
              <span className="text-xs font-medium text-dd-muted block leading-snug">{bid.offer}</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black block tracking-tight">${subtotal.toFixed(2)}</span>
              <span className="text-[10px] text-dd-muted font-black block uppercase tracking-tighter">{quantity}X @ ${unitPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-5 border-t border-dd-light">
            <div className="flex justify-between items-center text-xs font-bold text-dd-muted">
              <span className="uppercase tracking-widest">Delivery (Boston Arena)</span>
              <span className="text-dd-orange font-black uppercase tracking-widest">Grub War Promo: $0.00</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-dd-muted">
              <span className="uppercase tracking-widest">Local Tax (7%)</span>
              <span className="font-black text-dd-dark">${taxes.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t-2 border-dd-dark border-dashed">
          <span className="text-xl font-black uppercase tracking-tighter">Total Victory</span>
          <span className="text-4xl font-black text-dd-orange tracking-tighter">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-6 px-2">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-black uppercase text-dd-muted tracking-[0.2em]">Drop-Off Point</label>
            <button onClick={handleAutofill} className="text-[11px] font-black text-dd-orange uppercase tracking-widest border-b-2 border-dd-orange">Fill My Address</button>
          </div>
          <textarea 
            className="w-full p-5 bg-dd-light border-2 border-transparent focus:border-dd-orange/20 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold transition-all placeholder:text-dd-muted"
            rows={2}
            placeholder="Where should we drop the goods?"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-dd-muted mb-3 tracking-[0.2em]">Payment Vault</label>
          <div className="bg-dd-dark text-white p-8 rounded-[2rem] font-mono relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-dd-orange/20 blur-[80px] -mr-16 -mt-16"></div>
            <div className="text-[10px] mb-6 opacity-40 font-black tracking-[0.3em] uppercase">Grub War Terminal</div>
            <div className="text-xl tracking-[0.3em] mb-8 font-black">**** **** **** 4242</div>
            <div className="flex justify-between text-[11px] items-end">
              <div>
                <div className="opacity-40 text-[8px] uppercase font-black mb-1">Expires</div>
                <div className="font-black">12/28</div>
              </div>
              <div>
                <div className="opacity-40 text-[8px] uppercase font-black mb-1">Secure ID</div>
                <div className="font-black tracking-widest">***</div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-7 bg-white/10 rounded-lg"></div>
                <div className="w-10 h-7 bg-dd-orange/40 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        disabled={!address}
        onClick={handlePay}
        className={`w-full p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl ${
          address ? 'bg-dd-orange text-white shadow-dd-orange/30 active:scale-[0.97] hover:bg-dd-dark' : 'bg-dd-light text-dd-muted grayscale'
        }`}
      >
        Lock Deal & Pay ${total.toFixed(2)}
      </button>
    </div>
  );
};

export default Checkout;
