
import React, { useState, useMemo, useEffect } from 'react';
import { Bid } from '../types';
import { getAgentTheme } from '../utils/agentThemes';
import { getFoodImage, getMoatEmoji } from '../utils/bidHelpers';
import ImageWithBlur from './ImageWithBlur';

interface Props {
  bids: Bid[];
  isLoading: boolean;
  bidError?: string | null;
  quantity: number;
  onSelect: (bid: Bid) => void;
  onNegotiate: (bid: Bid) => void;
  onBack: () => void;
}

type SortOption = 'best-savings' | 'lowest-price';

const BidList: React.FC<Props> = ({ bids, isLoading, bidError, quantity, onSelect, onNegotiate, onBack }) => {
  const [sortBy, setSortBy] = useState<SortOption>('best-savings');
  const [progressMessage, setProgressMessage] = useState('Scanning menus...');
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [visibleBids, setVisibleBids] = useState<Bid[]>([]);
  const [newBidCount, setNewBidCount] = useState(0);

  // Stream bids progressively for live feel
  useEffect(() => {
    if (isLoading) {
      setVisibleBids([]);
      setNewBidCount(0);
      return;
    }
    
    if (!bids || bids.length === 0) {
      setVisibleBids([]);
      setNewBidCount(0);
      return;
    }
    
    // Filter out any invalid bids
    const validBids = bids.filter(bid => bid && bid.agentName && bid.realPrice !== undefined && bid.bidPrice !== undefined);
    
    if (validBids.length === 0) {
      setVisibleBids([]);
      setNewBidCount(0);
      return;
    }
    
    // If we already have all bids visible, don't re-stream
    if (visibleBids.length === validBids.length && visibleBids.length > 0) {
      return;
    }
    
    // Stream bids one by one with 1-2 second intervals
    setVisibleBids([]);
    setNewBidCount(0);
    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      if (currentIndex < validBids.length) {
        const nextBid = validBids[currentIndex];
        if (nextBid && nextBid.agentName && nextBid.realPrice !== undefined && nextBid.bidPrice !== undefined) {
          setVisibleBids(prev => {
            // Check if bid already exists to avoid duplicates
            const exists = prev.some(b => b.agentName === nextBid.agentName && b.bidPrice === nextBid.bidPrice);
            if (exists) return prev;
            return [...prev, nextBid];
          });
          setNewBidCount(prev => prev + 1);
        }
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setTimeout(() => setNewBidCount(0), 1000);
      }
    }, 1200);
    
    return () => {
      clearInterval(streamInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bids.length, isLoading]); // Only depend on length to prevent unnecessary re-streaming

  // Rotate progress messages during loading
  useEffect(() => {
    if (!isLoading) {
      setProgressMessage('Scanning menus...');
      setRestaurantCount(0);
      return;
    }
    
    const messages = ['Scanning menus...', 'Comparing prices...', 'Finding deals...', 'Restaurants are bidding...'];
    let messageIndex = 0;
    let count = 0;
    
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setProgressMessage(messages[messageIndex]);
    }, 2000);
    
    const countInterval = setInterval(() => {
      count = Math.min(count + 1, bids.length || 5);
      setRestaurantCount(count);
    }, 800);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(countInterval);
    };
  }, [isLoading, bids.length]);

  // Calculate full-order values for each bid (memoized for performance)
  // MUST be called before any early returns to follow React hooks rules
  const bidsWithFullOrder = useMemo(() => 
    visibleBids
      .filter(bid => bid && bid.realPrice !== undefined && bid.bidPrice !== undefined)
      .map(bid => {
        const fullOrderWas = bid.realPrice * quantity;
        const fullOrderPay = bid.bidPrice * quantity;
        const fullOrderSave = fullOrderWas - fullOrderPay;
        return { ...bid, fullOrderWas, fullOrderPay, fullOrderSave };
      }), [visibleBids, quantity]
  );

  // Sort based on selected option (memoized for performance)
  // MUST be called before any early returns to follow React hooks rules
  const sortedBids = useMemo(() => {
    return [...bidsWithFullOrder].sort((a, b) => {
      if (sortBy === 'lowest-price') {
        return a.fullOrderPay - b.fullOrderPay;
      }
      // Default: best savings with tie-break by lowest "You pay"
      if (a.fullOrderSave !== b.fullOrderSave) {
        return b.fullOrderSave - a.fullOrderSave; // descending (best savings first)
      }
      // Tie-break: lowest "You pay"
      return a.fullOrderPay - b.fullOrderPay;
    });
  }, [bidsWithFullOrder, sortBy]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        {/* Animated agent avatars */}
        <div className="relative mb-8 flex gap-4">
          {['🍕', '🍔', '🌮'].map((emoji, i) => (
            <div 
              key={i}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-xl animate-agent-working border-4 border-dd-orange/20"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>
        
        {/* Progress messages */}
        <h3 className="font-black text-3xl uppercase tracking-tighter italic text-dd-dark leading-none mb-4">
          Your agents are working...
        </h3>
        <p className="text-dd-muted font-bold text-sm uppercase tracking-widest mb-2 animate-pulse">
          {progressMessage}
        </p>
        {restaurantCount > 0 && (
          <p className="text-dd-orange font-black text-lg">
            {restaurantCount} restaurant{restaurantCount !== 1 ? 's' : ''} bidding...
          </p>
        )}
      </div>
    );
  }

  if (bidError && bids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-16 h-16 rounded-full bg-dd-orange/10 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3008" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter text-dd-dark mb-2">Couldn’t load bids</h2>
        <p className="text-dd-muted text-sm max-w-sm mb-6">{bidError}</p>
        <p className="text-xs text-dd-muted mb-6">Add <code className="bg-dd-light px-1.5 py-0.5 rounded">GEMINI_API_KEY</code> to a <code className="bg-dd-light px-1.5 py-0.5 rounded">.env</code> or <code className="bg-dd-light px-1.5 py-0.5 rounded">.env.local</code> file in the project root. Get a key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-dd-orange font-bold underline">aistudio.google.com/apikey</a>.</p>
        <button onClick={onBack} className="bg-dd-orange text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest">Back to order</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-10">
      <div className="flex items-end justify-between px-2 flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Restaurants competing</h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600 font-medium">
              {visibleBids.length > 0 && bids.length > 0 ? `${visibleBids.length} of ${bids.length}` : `${bids.length || 0}`} restaurants
            </p>
            {newBidCount > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium animate-pulse">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                New bid
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort controls - Apple-style segmented */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setSortBy('best-savings')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                sortBy === 'best-savings'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Best savings
            </button>
            <button
              onClick={() => setSortBy('lowest-price')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                sortBy === 'lowest-price'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lowest price
            </button>
          </div>
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl font-medium text-sm transition-colors">Cancel</button>
        </div>
      </div>

      <div className="space-y-5">
        {sortedBids.map((bid, index) => {
          // Safety check - skip if bid is invalid
          if (!bid || !bid.agentName || bid.realPrice === undefined || bid.bidPrice === undefined) {
            return null;
          }
          
          const theme = getAgentTheme(bid.agentName);
          // Calculate DoorDash comparison (estimate: 15% markup)
          const doorDashPrice = bid.realPrice * 1.15;
          const doorDashSavings = (doorDashPrice - bid.bidPrice) * quantity;
          
          return (
            <div 
              key={`${bid.agentName}-${bid.bidPrice}-${bid.realPrice}`}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:border-gray-300 active:scale-[0.99] animate-bid-appear relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* DoorDash comparison badge - Apple-style subtle */}
              <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[10px] font-semibold shadow-md z-10 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <span>Save ${doorDashSavings.toFixed(2)}</span>
                  <span className="text-[8px] opacity-90">vs DoorDash</span>
                </div>
              </div>
              
              <div className="p-0">
                {/* Hero food image - DoorDash style large image */}
                <div className="relative mb-4">
                  <div className="w-full h-40 overflow-hidden bg-gray-100">
                    <ImageWithBlur
                      src={getFoodImage(bid.agentName).includes('?') ? `${getFoodImage(bid.agentName)}&w=600&h=400&fit=crop&q=90` : `${getFoodImage(bid.agentName)}?w=600&h=400&fit=crop&q=90`}
                      alt={bid.agentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Restaurant logo badge overlay */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1.5 shadow-lg border border-white/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 ${theme.buttonBg} rounded-lg flex items-center justify-center ${theme.buttonText} text-xs font-bold`}>
                        {bid.agentName.split(' ').map(w => w[0]).join('').substring(0, 2)}
                      </div>
                      <span className="text-xs font-semibold text-gray-900">{bid.agentName}</span>
                    </div>
                  </div>
                </div>
                
                {/* Restaurant info - Apple-style clean typography */}
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{bid.agentName}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500 font-medium">{bid.neighborhood || 'Boston Core'}</span>
                    <span className="text-gray-300">•</span>
                    <div className={`${theme.buttonBg} ${theme.buttonText} px-2 py-0.5 rounded-md text-[9px] font-semibold inline-flex items-center gap-1`}>
                      <span>{getMoatEmoji(bid.moat, theme)}</span>
                      <span>{bid.moat}</span>
                    </div>
                  </div>
                  
                  {/* Price display - Apple-style prominent */}
                  <div className="flex items-baseline gap-3 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">${bid.fullOrderPay.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">${bid.fullOrderWas.toFixed(2)}</span>
                    </div>
                    <div className="ml-auto bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                      <span className="text-xs font-semibold">Save ${bid.fullOrderSave.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Action buttons - Apple-style clean */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onNegotiate(bid)}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 py-3.5 rounded-2xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span>Negotiate</span>
                    </button>
                    <button 
                      onClick={() => onSelect(bid)}
                      className={`flex-[1.5] ${theme.buttonBg} ${theme.buttonText} py-3.5 rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      <span>Accept Deal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BidList;
