import { NeuralNarrativeEcommercePart, OrderDetails, OrderResponse } from '../types/neural_narrative_ecommerce-types';

// TODO: Replace with actual API URLs
const INVENTORY_API = 'https://api.nnshop.com/inventory';
const ORDER_API = 'https://api.nnshop.com/orders';

export class NeuralNarrativeEcommerceService {
  static async checkInventory(partId: string): Promise<NeuralNarrativeEcommercePart | null> {
    try {
      const response = await fetch(`${INVENTORY_API}/${partId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error checking inventory:', error);
      return null;
    }
  }

  static async placeOrder(orderDetails: OrderDetails): Promise<OrderResponse | null> {
    try {
      const response = await fetch(ORDER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error placing order:', error);
      return null;
    }
  }

  // Mock function that always returns a relevant part with limited stock
  static async mockCheckInventory(partDescription: string): Promise<NeuralNarrativeEcommercePart | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract key terms from description
    const description = partDescription.toLowerCase();
    let part: NeuralNarrativeEcommercePart;

    if (description.includes('cooker') || description.includes('steel')) {
      part = {
        id: 'PC001',
        name: 'Premium Pressure Cooker',
        description: 'Stainless steel pressure with 7 yrs warranty',
        category: 'Utensil',
        price: 79.99,
        inStock: 1,
        imageUrl: 'pressure_cooker.jpg'
      };
    } else if (description.includes('pan') || description.includes('frying')) {
      part = {
        id: 'FP002',
        name: 'NonStick steel Frying Pan',
        description: 'NonStick steel frying pan',
        category: 'Utensil',
        price: 39.99,
        inStock: 1,
        imageUrl: 'frying_pan.jpg'
      };
    } else if (description.includes('watch') || description.includes('smart')) {
      part = {
        id: 'SM003',
        name: 'Apple Smart watch',
        description: 'Smart watch for kids',
        category: 'Watch',
        price: 345.99,
        inStock: 1,
        imageUrl: 'apple_watch.jpg'
      };
    } else {
      // Default part for any other description
      part = {
        id: 'GEN001',
        name: 'Neural Narrative Ecommerce',
        description: 'All-in-one store for General items',
        category: 'General',
        price: 59.99,
        inStock: 1,
        imageUrl: 'repair-kit.jpg'
      };
    }

    return part;
  }

  static async mockPlaceOrder(orderDetails: OrderDetails): Promise<OrderResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate random order ID
    const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Calculate delivery date (2 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    return {
      orderId,
      status: 'confirmed',
      estimatedDelivery: deliveryDate.toISOString(),
      totalAmount: 59.99, // We'll keep it fixed for mock
    };
  }
}
