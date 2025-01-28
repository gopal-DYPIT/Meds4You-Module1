import React from 'react';
import Checkout from '../components/Checkout';

function CheckoutPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <Checkout />
      {/* <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Complete Purchase</button>
      </div> */}
    </div>
  );
}

export default CheckoutPage;
