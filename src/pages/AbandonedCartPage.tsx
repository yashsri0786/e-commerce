// src/pages/AbandonedCartPage.tsx
import React from 'react';
import { useCart } from '../contexts/CartContext';

const AbandonedCartPage: React.FC = () => {
  const { cartItems } = useCart();

  const cartData = cartItems.length > 0 ? cartItems : { message: 'No items in cart' };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Abandoned Cart Data (Simulated Webhook)</h2>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(cartData, null, 2)}
      </pre>
    </div>
  );
};

export default AbandonedCartPage;