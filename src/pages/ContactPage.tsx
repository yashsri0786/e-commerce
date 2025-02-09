import React from 'react';

function ContactPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Contact Us</h2>
      <p>Fill out the form below to get in touch with us, or use the contact details provided.</p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div >
          <label htmlFor="name" >Your Name:</label>
          <input type="text" id="name" name="name"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}/>
        </div>
        <div>
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}/>
        </div>
        <div>
          <label htmlFor="phone">Your Phone Number:</label>
          <input type="tel" id="phone" name="phone" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h3>Contact Details</h3>
        <p>Email: business@neuralnarrative.com</p>
        <p>Address: #29 West Coast Road, Singapore 123456</p>
      </div>
    </div>
  );
}

export default ContactPage;