import React, { useState } from 'react';

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');  //For a status message
  const [isCalling, setIsCalling] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsCalling(true);
    setMessage('');

    try {
      const response = await fetch('https://8631-2406-3003-2005-5964-587e-61e4-6bd4-c853.ngrok-free.app/api/call', { // Use the backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone }), // Send only the phone number
      });

      if (response.ok) {
        setMessage('Calling you now...');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || 'Failed to initiate call.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
        setIsCalling(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Contact Us</h2>
      <p>Fill out the form below to get in touch with us, or use the contact details provided.</p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Your Name:</label>
          <input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div>
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div>
          <label htmlFor="phone">Your Phone Number:</label>
          <input type="tel" id="phone" name="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <button type="submit" disabled={isCalling} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isCalling ? 'Calling...' : 'Submit and Call'}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <div style={{ marginTop: '2rem' }}>
        <h3>Contact Details</h3>
        <p>Email: business@neuralnarrative.com</p>
        <p>Address: #29 West Coast Road, Singapore 123456</p>
      </div>
    </div>
  );
}

export default ContactPage;