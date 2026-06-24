import { useEffect } from 'react';

export const useBillingKeyboard = ({
  onSearchCustomer,
  onSearchProduct,
  onFocusDiscount,
  onHoldBill,
  onLoadHoldBill,
  onFocusPayment,
  onSavePrint,
  onCancel
}: {
  onSearchCustomer: () => void;
  onSearchProduct: () => void;
  onFocusDiscount: () => void;
  onHoldBill: () => void;
  onLoadHoldBill: () => void;
  onFocusPayment: () => void;
  onSavePrint: () => void;
  onCancel: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a generic input (unless it's an F-key)
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      switch (e.key) {
        case 'F2':
          e.preventDefault();
          onSearchCustomer();
          break;
        case 'F3':
          e.preventDefault();
          onSearchProduct();
          break;
        case 'F4':
          e.preventDefault();
          onFocusDiscount();
          break;
        case 'F6':
          e.preventDefault();
          onHoldBill();
          break;
        case 'F7':
          e.preventDefault();
          onLoadHoldBill();
          break;
        case 'F8':
          e.preventDefault();
          onFocusPayment();
          break;
        case 'F9':
          e.preventDefault();
          onSavePrint();
          break;
        case 'Escape':
          if (!isInput) {
            e.preventDefault();
            onCancel();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchCustomer, onSearchProduct, onFocusDiscount, onHoldBill, onLoadHoldBill, onFocusPayment, onSavePrint, onCancel]);
};
