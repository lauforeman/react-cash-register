import React from 'react';
import axios from 'axios';
import { API } from '../config/contants';
import { NavLink } from 'react-router-dom';
import Loading from 'react-loading';

export interface Product {
    productId: number;
    name: string;
    salePrice: number;
    buyPrice: number;
    quantity: number;
    isActive: boolean;
}

export default function ProductList() {

    const[products, setProducts] = React.useState<ReadonlyArray<Product>>([]);

    const[isLoading, setLoading] = React.useState<boolean>(false);


    const getProducts = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get<ReadonlyArray<Product>>(`${API}/Product`)
            setProducts(response.data);
        } catch (error) { 
            console.error(error);
        }
        setLoading(false);
    }, [setProducts, setLoading]);

    const toggleProduct = React.useCallback(async (id: number) => {
        try {
            await axios.patch(`${API}/Product/Toggle/${id}`)
            const updateProducts = [...products];
            const product = updateProducts.find(p => p.productId === id);
            if (product){
                product.isActive = !product?.isActive;
            }
            setProducts(updateProducts);
        } catch (error) {
            
            console.error(error);
        }
        
    }, [products, setProducts]);

    React.useEffect(() => {
        getProducts();
    }, [getProducts]);

    return (
        <div className='product-list'>
            <NavLink to='/products/product/new'>
                 <button>Add</button>
            </NavLink>
            <table className='product-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Sale Price</th>
                        <th>Buy Price</th>
                        <th>Quantity</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product, index) => 
                        (<tr key = {product.productId} className ={index % 2 === 1 ? 'odd' : 'even'}>
                            <td>{product.name}</td>
                            <td>{product.salePrice}</td>
                            <td>{product.buyPrice}</td>
                            <td>{product.quantity}</td>
                            <td>{product.isActive ? 'Yes' : 'No'}</td>
                            <td>
                                 <NavLink to={`/products/product/${product.productId}`}>
                                     <button>Edit</button>
                                 </NavLink>
                                <button onClick={() => toggleProduct(product.productId)}>
                                    {product.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="center"> {isLoading ? (
                                <Loading type='balls' color='black' className='loading-animation'/>
                            ) :
                                <>No Data Available</>
                            }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}