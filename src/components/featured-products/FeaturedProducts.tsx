import React from 'react';
import { useNavigate } from 'react-router-dom';
import './featured-products.scss';
import { useCart } from '../../contexts/CartContext';
// import safetyValveIcon from '../../assets/icons/safety-valve.svg';
// import leakDetectorIcon from '../../assets/icons/leak-detector.svg';
// import pipeWrenchIcon from '../../assets/icons/pipe-wrench.svg';
import pressureCookerImage from '../../assets/images/pressure_cooker.jpg';
import fryingPanImage from '../../assets/images/frying_pan.jpg';
import appleWatchImage from '../../assets/images/apple_watch.jpg';


const products = [
    {
        id: "1", // Changed to string
        name: 'Pressure Cooker',
        price: 79.99,
//         image: safetyValveIcon, // Placeholder - replace with actual image URL
        image: pressureCookerImage, // Use the imported image
        description: 'High-quality stainless steel pressure cooker for fast, efficient and most importantly healthy cooking.',
        category: 'Kitchen', // Added category
        inStock: 5,
    },
    {
        id: "2", // Changed to string
        name: 'Stainless Steel Frying Pan',
        price: 49.99,
//         image: leakDetectorIcon, // Placeholder - replace with actual image URL
        image: fryingPanImage, // Use the imported image
        description: 'Durable stainless steel frying pan for even heat distribution.',
        category: 'Kitchen', // Added category
        inStock: 10,
    },
    {
        id: "3",  // Changed to string
        name: 'Apple Smart Watch',
        price: 349.99,
//         image: pipeWrenchIcon, // Placeholder - replace with actual image URL
        image: appleWatchImage,
        description: 'Stay connected and track your health with the latest Apple Smart Watch.',
        category: 'Electronics', // Added category
        inStock: 3,             // Added inStock
    }
];

export function FeaturedProducts() {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAnalyzeClick = () => {
        navigate('/knobot');
    };

    return (
        <section id="featured" className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
            {products.map(product => (
            <div key={product.id} className="product-card">
                <div className="product-image">
                <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="price">${product.price}</span>
                <button className="buy-button" onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            </div>
            ))}
        </div>
        <div className="analyzer-cta">
            <h2>Not sure what you need?</h2>
            <p>Let our AI assistant analyze your requirements issue and recommend the right product</p>
            <button className="analyze-button" onClick={handleAnalyzeClick}>
            Talk to AI Bot
            </button>
        </div>
        </section>
    );
}
