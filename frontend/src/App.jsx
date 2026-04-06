// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Items from './pages/Items';
import AddItem from './pages/AddItem';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/add" element={<AddCustomer />} />
        <Route path="items" element={<Items />} />
        <Route path="items/add" element={<AddItem />} />
      </Route>
    </Routes>
  );
}

export default App;