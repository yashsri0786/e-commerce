import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon
import { useCart } from '../../contexts/CartContext'; // Import cart context

export function Header() {
  const location = useLocation();
  const isKnoBotPage = location.pathname === '/knobot';
  const { cartItems } = useCart(); // Get cart items from context
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>NeuralNarrative e-commerce store</h1>
          <span className="tagline">Your Smart e-commerce Solution</span>
        </Link>
        <nav className="navigation">
          <Link to="/">Shop</Link>
          <Link to="/knobot" className={isKnoBotPage ? 'active' : ''}>AI Assistant</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
