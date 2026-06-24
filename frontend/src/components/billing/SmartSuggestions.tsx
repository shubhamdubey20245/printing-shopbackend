import { Sparkles, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/cn';
import { useEffect, useState } from 'react';

// Hardcoded logic for now, in a real app this would come from an API based on cart contents
const suggestionMap: Record<string, any[]> = {
  'Paracetamol': [
    { name: 'Vitamin C 500mg', price: 45, type: 'Supplement' },
    { name: 'ORS Powder', price: 20, type: 'Hydration' },
    { name: 'Thermometer Digital', price: 150, type: 'Equipment' }
  ],
  'Azithromycin': [
    { name: 'Bifilac Capsule', price: 65, type: 'Probiotic' },
    { name: 'Cough Syrup (Tulsi)', price: 85, type: 'Relief' }
  ],
  'Amoxicillin': [
    { name: 'B-Complex Fort', price: 35, type: 'Vitamin' },
    { name: 'Pantoprazole 40mg', price: 40, type: 'Antacid' }
  ]
};

export const SmartSuggestions = ({ currentItems, onAddSuggestion }: { currentItems: any[], onAddSuggestion: (item: any) => void }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    let newSuggestions: any[] = [];
    currentItems.forEach(item => {
      const matchKey = Object.keys(suggestionMap).find(key => item.name?.includes(key) || item.genericName?.includes(key));
      if (matchKey) {
        newSuggestions = [...newSuggestions, ...suggestionMap[matchKey]];
      }
    });
    
    // Deduplicate and limit to 3
    const unique = newSuggestions.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
    setSuggestions(unique.slice(0, 3));
  }, [currentItems]);

  if (suggestions.length === 0) return null;

  return (
    <div className="card p-4 mt-4 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-500">
        <Sparkles className="w-4 h-4" /> Frequently Bought Together
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {suggestions.map((item, idx) => (
          <div key={idx} className="min-w-[150px] p-2 bg-white dark:bg-[#1a1a24] rounded-lg border border-amber-100 dark:border-amber-900/50 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold truncate text-gray-800 dark:text-gray-200">{item.name}</p>
              <p className="text-[9px] text-gray-500 uppercase">{item.type}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-amber-600 text-sm">{formatCurrency(item.price)}</span>
              <button 
                onClick={() => onAddSuggestion(item)}
                className="p-1 rounded bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors dark:bg-amber-900/50 dark:hover:bg-amber-500"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
