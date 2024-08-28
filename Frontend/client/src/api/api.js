import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});


export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Failed to place an order:', error);
    throw new Error('Failed to place an order. Please try again.');
  }
};



// export const getPendingOrders = (tableId) => api.get(`/orders/pending/${tableId}`);

export const getPendingOrders = (tableId) => {
  
  return axios.get(`/api/orders/pending/${tableId}`);
};


  // Fetch order summary from the backend
 export  const fetchOrderSummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/summary/orderDetails');
     
   return response.data;
    } catch (error) {
      console.error('Error fetching order summary:', error);
     throw new Error ('Failed to fetch order summary.'); 
    }
  };



export default api;
