
import React, { useState } from 'react';
import { UserConstraints } from '../types';

interface Props {
  initialData: UserConstraints;
  onSubmit: (data: UserConstraints) => void;
}

const RequestForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<UserConstraints>(initialData);

  const dietaryOptions = ['High Protein', 'Vegan', 'Keto', 'Gluten-Free', 'Low Carb'];

  const toggleDiet = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag) 
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10 pt-4">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">What do you want?</label>
            <input 
              type="text"
              className="w-full h-[58px] p-4 bg-dd-light border-2 border-transparent focus:border-dd-orange/20 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all placeholder:text-dd-muted/50"
              placeholder="What are we eating? (e.g. Sushi)"
              value={formData.itemPref}
              onChange={e => setFormData({ ...formData, itemPref: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest text-center">How many?</label>
            <div className="flex items-center justify-between bg-dd-light rounded-2xl h-[58px] px-1 overflow-hidden border-2 border-transparent focus-within:border-dd-orange/20 focus-within:bg-white transition-all">
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                className="w-10 h-10 flex items-center justify-center text-dd-muted hover:text-dd-orange hover:bg-white rounded-xl active:scale-90 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
              </button>
              <span className="flex-1 text-center font-black text-sm text-dd-dark select-none">
                {formData.quantity}
              </span>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                className="w-10 h-10 flex items-center justify-center text-dd-muted hover:text-dd-orange hover:bg-white rounded-xl active:scale-90 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">Max price per item</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-dd-orange">$</span>
            <input 
              type="number"
              className="w-full p-4 pl-10 bg-dd-light border-2 border-transparent focus:border-dd-orange/20 focus:bg-white rounded-2xl outline-none font-black text-sm transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={formData.budgetCap}
              onChange={e => setFormData({ ...formData, budgetCap: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">One-time or recurring?</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 'single', label: 'One-time' },
              { val: '7', label: 'This week' },
              { val: '14', label: '2 weeks' },
              { val: '30', label: 'This month' }
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFormData({ ...formData, duration: opt.val as UserConstraints['duration'] })}
                className={`p-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${
                  formData.duration === opt.val 
                  ? 'bg-dd-orange border-dd-orange text-white shadow-xl shadow-dd-orange/20' 
                  : 'bg-white border-dd-light text-dd-muted hover:border-dd-orange/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-dd-muted mt-2 font-bold">Perfect for weekly lunch plans</p>
          {formData.duration !== 'single' && (
            <p className="text-[9px] text-emerald-600 mt-1 font-bold italic">
              Set your {formData.duration === '7' ? 'weekly' : formData.duration === '14' ? 'bi-weekly' : 'monthly'} plan. We'll find deals. You approve.
            </p>
          )}
          {formData.duration === '7' && (
            <p className="text-[9px] text-dd-muted mt-1 italic">5 for the week</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">
            Dietary Preferences <span className="text-[8px] font-normal normal-case">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleDiet(tag)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase border-2 transition-all ${
                  formData.dietaryTags.includes(tag)
                  ? 'bg-dd-dark border-dd-dark text-white'
                  : 'bg-white border-dd-light text-dd-muted hover:border-dd-dark/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onSubmit(formData)}
        className="w-full bg-dd-orange text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-dd-orange/20 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-dd-dark animate-scale-in relative overflow-hidden group"
      >
        <span className="relative z-10">See who wants your order</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl"></div>
      </button>
    </div>
  );
};

export default RequestForm;
