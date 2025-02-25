import React, { useEffect, useState } from 'react';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
//Updated import paths and Type names:
import { NeuralNarrativeEcommercePart, OrderDetails, OrderResponse, Message } from '../../types/neural_narrative_ecommerce-types';
import { NeuralNarrativeEcommerceService } from '../../services/neural_narrative_ecommerce-service';
import classNames from 'classnames';
import { ServerContent, LiveConfig } from '../../multimodal-live-types';
import type { Part } from '@google/generative-ai';
import './neural_narrative_ecommerce-analyzer.scss';

const USERNAME = 'Birbal'; // We'll replace this with proper auth later

export function NeuralNarrativeEcommerceAnalyzer() {
  const { client, connected, setConfig } = useLiveAPIContext();
  const [analysis, setAnalysis] = useState<string>('');
  const [suggestedPart, setSuggestedPart] = useState<NeuralNarrativeEcommercePart | null>(null);
  const [orderDetails, setOrderDetails] = useState<Partial<OrderDetails>>({
    customerName: USERNAME,
  });
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Set initial configuration and welcome message
  useEffect(() => {
    if (!connected) {
      const config: LiveConfig = {
        model: "models/gemini-2.0-flash-exp",
        generationConfig: {
          responseModalities: "audio",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
          },
        },
        systemInstruction: {
          parts: [
            {
              text: `You are Alice, an expert AI assistant for NeuralNarrative e-commerce store. Your primary mission is to help customers identify and solve their requirements/issues quickly.

Key Responsibilities:
1. Visual Analysis:
   - Analyze images/video of parts and issues with expert precision
   - Identify problems, wear and tear, and potential failures
   - Explain issues in simple, non-technical terms
   - Provide safety warnings when detecting serious issues

2. Part Recommendations:
   - Recommend exact items/parts or repair kits
   - Emphasize urgency when stock is limited (we usually have only 1 item in stock)
   - Explain why the recommended part is the best solution
   - Suggest alternative parts if primary recommendation is unavailable

3. Customer Experience:
   - Use a friendly, professional tone
   - Address users by name
   - Provide clear, step-by-step guidance
   - Offer important tips and safety precautions
   - Estimate shipment delivery time and difficulty level

4. Order Assistance:
   - Guide users through the ordering process
   - Highlight limited stock availability
   - Explain shipping and delivery details
   - Provide warranty information
   - Offer installation service booking when applicable
5. Be empathetic with the user
   - You ask the user to explain what he needs. If it is not clear only then request him to show a sample of the product via his camera.
   - You then say you are checking inventory and after some pause say that you have one supplier
   who has the item
   - If user asks for price you use your own judgement call but then say that price can vary as supplier
   has not yet responded on the quote.
   - Just try your best and act intelligently if some random questions comes up.
   - If user says something unpleasant please remain calm & polite always.

Remember:
- Always mention when items are in limited stock (usually only 1 available)
- Encourage immediate action to secure the part
- Provide alternative solutions if available
- Focus on safety and proper items & utensils
- Include estimated installation time and difficulty level
- Mention warranty information when available
- Mention health benefits if applicable (for e.g. stainless steel utensils are better than non stick cookwares)

Start by introducing yourself and asking to see the how you can help the customer.`,
            },
          ],
        },
        tools: [{ googleSearch: {} }],
      };

      setConfig(config);

      const welcomeMessage: Message = {
        type: 'ai',
        content: `Hi ${USERNAME}! 👋 I'm Alice, your expert AI assistant from Neural Narrative e-commerce store.

I specialize in:
• Analyzing user's requirements issues through live video
• Identifying exact replacement parts you need
• Securing hard-to-find parts (usually limited stock!)
• Providing professional guidance
• Ensuring your safety throughout repairs

Tell me or Show me your issue as I can see through the camera, and I'll help you find the perfect solution. Ready to solve your daily problems?`
      };
      
      setMessages([welcomeMessage]);
    }
  }, [connected, setConfig]);

  // Handle AI responses
  useEffect(() => {
    const onContent = (content: ServerContent) => {
      if ('modelTurn' in content && content.modelTurn?.parts) {
        const textPart = content.modelTurn.parts.find((p: Part) => 'text' in p && typeof p.text === 'string');
        if (textPart && 'text' in textPart && textPart.text) {
          setAnalysis(textPart.text);
          const aiMessage: Message = {
            type: 'ai',
            content: textPart.text
          };
          setMessages(prev => [...prev, aiMessage]);
          
          // Check if we have a part suggestion
          handlePartSuggestion(textPart.text);
        }
      }
    };

    const handlePartSuggestion = async (text: string) => {
      try {
        setIsProcessing(true);
        const part = await NeuralNarrativeEcommerceService.mockCheckInventory(text); //Updated service call
        if (part) {
          setSuggestedPart(part);
          // Add part suggestion message
          const suggestionMessage: Message = {
            type: 'ai',
            content: `I've found the perfect part for your issue: ${part.name}. It's currently ${part.inStock === 1 ? 'only 1 left in stock!' : `${part.inStock} available`}. The installation difficulty is ${part.installationDifficulty || 'moderate'} and typically takes ${part.estimatedInstallTime || '30-60 minutes'}.`
          };
          setMessages(prev => [...prev, suggestionMessage]);
        }
      } catch (error) {
        console.error('Error checking inventory:', error);
        const errorMessage: Message = {
          type: 'ai',
          content: 'I apologize, but I encountered an issue checking our inventory. Please try again or contact our support team.'
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    };

    client.on('content', onContent);
    return () => {
      client.off('content', onContent);
    };
  }, [client]);

  const handleOrder = async () => {
    if (!suggestedPart || !orderDetails.customerEmail) {
      setOrderStatus('Please provide your email to complete the order');
      return;
    }

    try {
      setIsProcessing(true);
      const order: OrderDetails = {
        partId: suggestedPart.id,
        quantity: 1,
        customerName: USERNAME,
        customerEmail: orderDetails.customerEmail,
        customerAddress: orderDetails.customerAddress || '',
        phoneNumber: orderDetails.phoneNumber,
        installationRequired: orderDetails.installationRequired,
      };

      const response = await NeuralNarrativeEcommerceService.mockPlaceOrder(order); // Updated Service Call
      if (response) {
        setOrderStatus(`Order placed successfully! Order ID: ${response.orderId}`);
        setSuggestedPart(null);
        setOrderDetails({ customerName: USERNAME });
        
        const deliveryDate = new Date(response.estimatedDelivery || '').toLocaleDateString();
        const confirmationMessage: Message = {
          type: 'ai',
          content: `Great! I've placed your order for ${suggestedPart.name}.
• Order ID: ${response.orderId}
• Expected delivery: ${deliveryDate}
• Total amount: $${response.totalAmount}
${response.trackingNumber ? `• Tracking number: ${response.trackingNumber}` : ''}
${suggestedPart.warrantyInfo ? `\nWarranty information: ${suggestedPart.warrantyInfo}` : ''}

Would you like me to help you with anything else?`
        };
        
        setMessages(prev => [...prev, confirmationMessage]);
      } else {
        throw new Error('Order placement failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus('Failed to place order. Please try again.');
      const errorMessage: Message = {
        type: 'ai',
        content: 'I apologize, but there was an issue processing your order. Please try again or contact our support team for assistance.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="neural_narrative_ecommerce-analyzer">
      <div className="chat-section">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.type === 'ai' && <div className="avatar">🤖</div>}
              <div className="text">{message.content}</div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="processing-indicator">
            <span className="dot-pulse"></span>
            Processing...
          </div>
        )}
      </div>

      {suggestedPart && (
        <div className="suggestion-section">
          <div className="part-card">
            <div className="part-header">
              <h3>Recommended Part</h3>
              <span className={classNames('stock-badge', { critical: suggestedPart.inStock === 1 })}>
                In Stock: {suggestedPart.inStock}
              </span>
            </div>
            
            <div className="part-details">
              <h4>{suggestedPart.name}</h4>
              <p>{suggestedPart.description}</p>
              {suggestedPart.manufacturer && (
                <p className="manufacturer">Manufacturer: {suggestedPart.manufacturer}</p>
              )}
              {suggestedPart.modelNumber && (
                <p className="model-number">Model: {suggestedPart.modelNumber}</p>
              )}
              <div className="installation-info">
                <span className="difficulty">
                  Difficulty: {suggestedPart.installationDifficulty || 'Moderate'}
                </span>
                <span className="time">
                  Est. Time: {suggestedPart.estimatedInstallTime || '30-60 minutes'}
                </span>
              </div>
              <div className="price">
                <span className="amount">${suggestedPart.price}</span>
                <span className="label">per unit</span>
              </div>
            </div>

            <div className="order-form">
              <input
                type="email"
                placeholder="Your Email *"
                value={orderDetails.customerEmail || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setOrderDetails({...orderDetails, customerEmail: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={orderDetails.phoneNumber || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setOrderDetails({...orderDetails, phoneNumber: e.target.value})}
              />
              <textarea
                placeholder="Delivery Address *"
                value={orderDetails.customerAddress || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setOrderDetails({...orderDetails, customerAddress: e.target.value})}
                required
              />
              <div className="installation-option">
                <label>
                  <input
                    type="checkbox"
                    checked={orderDetails.installationRequired || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setOrderDetails({
                        ...orderDetails,
                        installationRequired: e.target.checked
                      })}
                  />
                  Request Professional Installation
                </label>
              </div>
              <button 
                onClick={handleOrder} 
                disabled={!connected || isProcessing}
                className={classNames("order-button", { processing: isProcessing })}
                type="button"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>

            {orderStatus && (
              <div className={classNames('order-status', {
                success: orderStatus.includes('successfully'),
                error: !orderStatus.includes('successfully')
              })}>
                {orderStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
