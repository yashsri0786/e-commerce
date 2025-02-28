// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { Header } from "./components/header/Header";
import { FeaturedProducts } from "./components/featured-products/FeaturedProducts";
import { KnoBotPage } from "./pages/KnoBotPage";
import  ContactPage  from "./pages/ContactPage";
import CartPage from "./pages/CartPage"; // Import the new CartPage
import { CartProvider } from "./contexts/CartContext";
import AbandonedCartPage from "./pages/AbandonedCartPage"; // Import the new component
function App() {
  return (
    <Router>
      <CartProvider>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={
              <main className="main-content">
                <FeaturedProducts />
              </main>
            } />
            <Route path="/knobot" element={<KnoBotPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/abandoned-cart" element={<AbandonedCartPage />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;