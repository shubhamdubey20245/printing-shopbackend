import { useState, useEffect } from 'react';

export const useBillingDraft = (initialState: any) => {
  const [items, setItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('billing_draft_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialState.items;
  });

  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('billing_draft_customer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialState.customer;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('billing_draft_items', JSON.stringify(items));
      localStorage.setItem('billing_draft_customer', JSON.stringify(customer));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [items, customer]);

  const clearDraft = () => {
    setItems([]);
    setCustomer(initialState.customer);
    localStorage.removeItem('billing_draft_items');
    localStorage.removeItem('billing_draft_customer');
  };

  return { items, setItems, customer, setCustomer, clearDraft };
};
