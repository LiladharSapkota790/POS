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



export default api;
