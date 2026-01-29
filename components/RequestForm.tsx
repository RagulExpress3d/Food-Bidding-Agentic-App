
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
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-dd-dark italic">Deployment <span className="text-dd-orange text-5xl">Intel</span></h2>
        <p className="text-xs font-bold text-dd-muted uppercase tracking-widest mt-2">Setting the parameters for the Grub War</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">The Objective</label>
            <input 
              type="text"
              className="w-full p-4 bg-dd-light border-2 border-transparent focus:border-dd-orange/20 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all"
              placeholder="What are we eating? (e.g. Lobster)"
              value={formData.itemPref}
              onChange={e => setFormData({ ...formData, itemPref: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">Squad Size</label>
            <input 
              type="number"
              min="1"
              className="w-full p-4 bg-dd-light border-2 border-transparent focus:border-dd-orange/20 focus:bg-white rounded-2xl outline-none font-black text-sm text-center transition-all"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: Math.max(1, Number(e.target.value)) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">Unit Budget Cap</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-dd-orange">$</span>
            <input 
              type="number"
              className="w-full p-4 pl-10 bg-dd-light border-2 border-transparent focus:border-dd-orange/20 focus:bg-white rounded-2xl outline-none font-black text-sm transition-all"
              value={formData.budgetCap}
              onChange={e => setFormData({ ...formData, budgetCap: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">Campaign Length</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 'single', label: '1 Drop' },
              { val: '7', label: '7 Days' },
              { val: '14', label: '14 Days' },
              { val: '30', label: '30 Days' }
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFormData({ ...formData, duration: opt.val as any })}
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
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-dd-muted mb-2 tracking-widest">Tactical Constraints</label>
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
        className="w-full bg-dd-orange text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-dd-orange/20 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-dd-dark"
      >
        <span>Initialize Grub War</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>
    </div>
  );
};

export default RequestForm;
