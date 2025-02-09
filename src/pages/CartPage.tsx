import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import '../components/featured-products/featured-products.scss';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (
    productId: string, // Corrected type here
    newQuantity: number
  ) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                borderBottom: '1px solid #ccc',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
             <div style={{ width: "80px", height: "80px" }}>
              <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div>{item.name}</div>
                <div>Price: ${item.price.toFixed(2)}</div>
                <div>
                  Quantity:
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div>
                <button onClick={() => removeFromCart(item.id)}>Delete</button>
              </div>
            </div>
          ))}
           <div>
            <Link to="/knobot">
                <button className="analyze-button" >
                   Talk to AI Bot
                 </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;