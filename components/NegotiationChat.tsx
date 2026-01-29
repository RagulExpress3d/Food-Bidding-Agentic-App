
import React, { useState, useEffect, useRef } from 'react';
import { Bid, ChatMessage, UserConstraints } from '../types';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface Props {
  bid: Bid;
  constraints: UserConstraints;
  onAccept: (newPrice: number, newOffer: string, newQty: number) => void;
  onBack: () => void;
}

const NegotiationChat: React.FC<Props> = ({ bid, constraints, onAccept, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentDeal, setCurrentDeal] = useState({ 
    price: bid.bidPrice, 
    offer: bid.offer,
    quantity: constraints.quantity 
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  useEffect(() => {
    setMessages([
      { role: 'model', text: `Yo! I'm the ${bid.agentName} agent. I see you're after ${constraints.quantity}x of the good stuff. My current offer is $${bid.bidPrice.toFixed(2)} each. It's a steal, but I like your style... want to talk numbers?` }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `
            You are a fun, high-energy restaurant agent for ${bid.agentName}. 
            Your target audience is Gen Z/Millennials (12-32). Use slang occasionally, keep it snappy and competitive.
            Current Bid: ${currentDeal.quantity} items, ${currentDeal.offer} at $${currentDeal.price.toFixed(2)} UNIT PRICE.
            
            GOAL: Lock in the deal. You can drop unit price by up to 15% more for bulk orders or loyalty.
            Always summarize the FINAL deal in the message.
            Format for data updates:
            [NEW_PRICE: XX.XX]
            [NEW_QUANTITY: X]
            [NEW_OFFER: Description]
          `,
        }
      });

      const response = await chat.sendMessage({ message: inputText });
      const responseText = response.text || "I'm losing signal in the kitchen! Try again.";
      
      const priceMatch = responseText.match(/\[NEW_PRICE:\s*([\d.]+)\]/);
      const qtyMatch = responseText.match(/\[NEW_QUANTITY:\s*(\d+)\]/);
      const offerMatch = responseText.match(/\[NEW_OFFER:\s*(.+?)\]/);

      if (priceMatch) setCurrentDeal(prev => ({ ...prev, price: parseFloat(priceMatch[1]) }));
      if (qtyMatch) setCurrentDeal(prev => ({ ...prev, quantity: parseInt(qtyMatch[1], 10) }));
      if (offerMatch) setCurrentDeal(prev => ({ ...prev, offer: offerMatch[1] }));

      const cleanText = responseText
        .replace(/\[NEW_PRICE:.*?\]/g, '')
        .replace(/\[NEW_QUANTITY:.*?\]/g, '')
        .replace(/\[NEW_OFFER:.*?\]/g, '')
        .trim();

      setMessages(prev => [...prev, { role: 'model', text: cleanText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Server's on fire! Give me a sec." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const hasChanges = currentDeal.price !== bid.bidPrice || currentDeal.quantity !== constraints.quantity;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-6 duration-500 bg-dd-light/30">
      {/* Dynamic Header */}
      <div className="p-5 bg-white border-b flex items-center justify-between shadow-sm z-10 rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-dd-light rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="relative">
            <div className="w-12 h-12 bg-dd-dark rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-dd-orange/10">
              {bid.agentName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-black text-base uppercase tracking-tight leading-none mb-1">{bid.agentName} HQ</h2>
            <div className="text-[10px] font-black text-dd-orange uppercase tracking-[0.2em]">Agent Negotiating</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-dd-muted font-black uppercase tracking-widest">War Total</div>
          <div className="text-xl font-black text-dd-orange tracking-tighter">${(currentDeal.price * currentDeal.quantity).toFixed(2)}</div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 bg-dd-dark rounded-full flex items-center justify-center text-white text-[10px] font-black mb-1 shrink-0">
                {bid.agentName.charAt(0)}
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' 
              ? 'bg-dd-orange text-white rounded-br-none' 
              : 'bg-white text-dd-dark border border-dd-light rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-end gap-2">
             <div className="w-8 h-8 bg-dd-dark rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 animate-pulse">
                {bid.agentName.charAt(0)}
              </div>
            <div className="bg-white p-4 rounded-[1.5rem] rounded-bl-none border border-dd-light flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-dd-orange rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-dd-orange rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-dd-orange rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Pad */}
      <div className="p-6 bg-white rounded-t-[2.5rem] border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-4">
        {hasChanges && (
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex items-center justify-between animate-in zoom-in-95 duration-300">
            <div>
              <div className="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Revised Battle Terms</div>
              <div className="text-xs font-bold text-emerald-600">${currentDeal.price.toFixed(2)} x {currentDeal.quantity}</div>
            </div>
            <button 
              onClick={() => onAccept(currentDeal.price, currentDeal.offer, currentDeal.quantity)} 
              className="bg-emerald-600 text-white text-[10px] font-black uppercase px-5 py-2 rounded-xl shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
            >
              Sign Deal
            </button>
          </div>
        )}
        
        <div className="flex gap-3">
          <input 
            type="text"
            className="flex-1 px-5 py-4 bg-dd-light border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-dd-orange/10 outline-none placeholder:text-dd-muted"
            placeholder="Counter the agent..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend} 
            disabled={isTyping || !inputText.trim()} 
            className="w-14 h-14 bg-dd-dark text-white rounded-2xl flex items-center justify-center disabled:opacity-20 shadow-xl shadow-dd-dark/10 active:scale-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>

        {!hasChanges && (
          <button 
            onClick={() => onAccept(currentDeal.price, currentDeal.offer, currentDeal.quantity)} 
            className="w-full text-dd-muted text-[10px] font-black uppercase tracking-[0.2em] hover:text-dd-dark transition-colors py-1"
          >
            Accept the current bid
          </button>
        )}
      </div>
    </div>
  );
};

export default NegotiationChat;
