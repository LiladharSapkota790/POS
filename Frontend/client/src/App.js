import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableView from './components/TableView';
import MenuView from './components/MenuView';
import OrderView from './components/OrderView';
import CheckoutView from './components/CheckoutView';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/tables" element={<TableView />} />
          <Route path="/menu" element={<MenuView />} />
          <Route path="/order" element={<OrderView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/" element={<TableView />} /> {/* Default home view */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
