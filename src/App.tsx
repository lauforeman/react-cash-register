import React from 'react';
import { FaCashRegister } from 'react-icons/fa';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  return (
    <div className="App">
      <h2>
        <FaCashRegister />
        Cash Register
      </h2>
      <div className='app-navigation-content'>
        <Routes>
          <Route path = '/' element={<Navigate replace to ='products'/>}/>
          <Route path = 'products' element={<ProductList/>}/>
          <Route path = 'products/product/new' element={<ProductForm/>}/>
          <Route path = 'products/product/:id' element={<ProductForm/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
