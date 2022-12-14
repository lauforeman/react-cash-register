import React from 'react';
import axios from 'axios';
import { API } from '../config/contants';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from './ProductList';

export interface ProductFormField {
    productId?: number;
    name: string;
    salePrice: number;
    buyPrice: number;
    quantity: number;
    isActive?: boolean;
}

export default function ProductForm() {
    const navigate = useNavigate();

    const {id} = useParams();

    const[productForm, setProductForm] = React.useState<ProductFormField>({
        buyPrice: 0,
        quantity: 0,
        name: '',
        salePrice: 0
    });

    const getProduct = React.useCallback(async () => {
        try {
            const response = await axios.get<Product>(`${API}/Product/${id}`)
            setProductForm({...response.data})
        } catch (error) {
            
            console.error(error);
        }
        
    }, [id, setProductForm]);

    const createProduct = React.useCallback(async () => {
        try {
            await axios.post(`${API}/Product`, productForm)
            navigate('../products', { replace: true });
        } catch (error) {
            
            console.error(error);
        }
        
    }, [productForm, navigate]);

    const updateProduct = React.useCallback(async () => {
        try {
            await axios.put(`${API}/Product/${id}`, productForm)
            navigate('../products', { replace: true });
        } catch (error) {
            
            console.error(error);
        }
        
    }, [id, productForm, navigate]);

    React.useEffect(() => {
        if(id) {
            getProduct();
        }
    }, [id, getProduct])

    const onSaveClick = () => {
        if(id) {
            updateProduct();
        } else{
            createProduct();
        }
    }

    return (
        <form className='product-form'>
            <div className='product-form-header'>
                <h3>Register Product</h3>
            </div>
            <div className="product-form-main">
                <div className="form-field">
                    <label htmlFor='Name'>Name</label>
                    <input id='Name 'type="text" value={productForm.name} onChange={(e) => 
                        setProductForm({ ...productForm, name: e.target.value})} />
                </div>
                <div className="form-field">
                    <label htmlFor='Sale Price'>Sale Price</label>
                    <input id='Sale Price 'type="number" min={0} value={productForm.salePrice} onChange={(e) => 
                        setProductForm({ ...productForm, salePrice: parseInt(e.target.value)})} />
                </div>
                <div className="form-field">
                    <label htmlFor='Buy Price'>Buy Price</label>
                    <input id='Buy Price 'type="number" min={0} value={productForm.buyPrice} onChange={(e) => 
                        setProductForm({ ...productForm, buyPrice: parseInt(e.target.value)})} />
                </div>
                <div className="form-field">
                    <label htmlFor='Quantity'>Quantity</label>
                    <input id='Quantity' type="number" min={0} value={productForm.quantity} onChange={(e) => 
                        setProductForm({ ...productForm, quantity: parseInt(e.target.value)})} />
                </div>
            </div>
            <div className="product-form-footer">
                <button type='button' onClick={() => navigate('../products', {replace: true})}>
                    Cancel
                </button>
                <button type='button' onClick={() => onSaveClick()}>
                    Save
                </button>
            </div>        
        </form>
    )
}