import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import { API } from '../config/contants';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Sale } from './SaleList';
import { Product } from './ProductList';
import { parse } from 'path';

export interface ProductOption extends Product {
    label: string;
    value: number;
    isDisabled: boolean;
}

export interface ProductSaleFormField {
    productId: number;
    quantity: number;
    price?: number;
}

export interface SaleFormField {
    saleId?: number;
    date?: string;
    total?: number;
    isLoan: boolean;
    apartmentNumber: string;
    payment: number;
    change?: number;
    productSales: Array<ProductSaleFormField>;
}

export default function SaleForm() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [products, setProducts] = React.useState<ReadonlyArray<ProductOption>>([]);

    const [saleForm, setSaleForm] = React.useState<SaleFormField>({
        isLoan: false,
        apartmentNumber: '',
        payment: 0,
        productSales: [{
            productId: 0,
            quantity: 1
        }]
    });

    const getProducts = React.useCallback(async () => {
        try {
            const response = await axios.get<ReadonlyArray<Product>>(`${API}/Product`)
            setProducts([...response.data.map(product => ({
                ...product,
                label: product.name,
                value: product.productId,
                isDisabled: !product.isActive
            }))]);
        } catch (error) {
            console.error(error);
        }

    }, [setProducts]);

    const getSale = React.useCallback(async () => {
        try {
            const response = await axios.get<Sale>(`${API}/Sale/${id}`)
            setSaleForm({ ...response.data, productSales: [...response.data.productSales] });
        } catch (error) {

            console.error(error);
        }

    }, [id, setSaleForm]);

    const createSale = React.useCallback(async () => {
        try {
            await axios.post(`${API}/Sale`, saleForm)
            navigate('../sales', { replace: true });
        } catch (error) {

            console.error(error);
        }

    }, [saleForm, navigate]);

    const updateSale = React.useCallback(async () => {
        try {
            await axios.put(`${API}/Sale/${id}`, saleForm)
            navigate('../sales', { replace: true });
        } catch (error) {

            console.error(error);
        }

    }, [id, saleForm, navigate]);

    React.useEffect(() => {
        getProducts();
        if (id) {
            getSale();
        }
    }, [id, getSale, getProducts])

    const onSaveClick = () => {
        if (id) {
            updateSale();
        } else {
            createSale();
        }
    }

    const setProductSale = (index: number) =>
        (productSale: Partial<ProductSaleFormField>) => {
            const productSales = [...saleForm.productSales];
            productSales[index] = {
                ...productSales[index],
                ...productSale
            };
            const total = productSales.reduce(
                (sum, ps) => sum + (ps.price || 0) * ps.quantity,
                0
            );
            setSaleForm({ ...saleForm, total, productSales });
        };

    return (
        <form className='sale-form'>
            <div className='sale-form-header'>
                <h3>Register Sale</h3>
            </div>
            <div className="sale-form-main">
                {id &&
                    (
                        <div className="form-field">
                            <label htmlFor='SaleId'>Sale Id</label>
                            <input id='SaleId ' type="text" value={saleForm.saleId} readOnly />
                        </div>
                    )
                }

                <div className="form-group">
                    <div className="form-group-header">
                        <div className="form-title">Products</div>
                        <button
                            type='button'
                            onClick={() => setSaleForm({
                                ...saleForm,
                                productSales: [
                                    ...saleForm.productSales,
                                    { productId: 0, quantity: 1 }
                                ]
                            })}>
                            +
                        </button>
                    </div>
                    <div className="form-group-body">
                        {saleForm.productSales.map((productSale, index) => (
                            <div key={index} className="form-field">
                                <Select
                                    className='Select'
                                    options={products}
                                    value={products.find(p => p.productId === productSale.productId)}
                                    onChange={(productSale) => setProductSale(index)({
                                        productId: productSale?.productId,
                                        price: productSale?.salePrice,
                                        quantity: 1
                                    })}
                                />
                                <input
                                    readOnly
                                    className='medium'
                                    value={productSale.price || 0} />
                                <input
                                    className='tiny'
                                    min={1}
                                    type="number"
                                    value={productSale.quantity}
                                    onChange={(e) => setProductSale(index)({
                                        quantity: parseInt(e.target.value)
                                    })}
                                />
                                <button
                                    type='button'
                                    onClick={() => setSaleForm({
                                        ...saleForm,
                                        productSales: [
                                            ...saleForm.productSales.filter((_, i) => i !== index)
                                        ]
                                    })}
                                >
                                    -
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-field">
                    <label>Total</label>
                    <input readOnly type="number" value={saleForm.total} />
                </div>
                <div className="form-field">
                    <label>Payment</label>
                    <input type="number" min={0} value={saleForm.payment} onChange={(e) =>
                        setSaleForm({
                            ...saleForm,
                            payment: parseInt(e.target.value),
                            change: parseInt(e.target.value) - (saleForm.total || 0)
                        })} />
                </div>
                <div className="form-field">
                    <label>Change</label>
                    <input readOnly type="number" value={saleForm.change} />
                </div>
                <div className="form-field">
                    <label>Is Loan?</label>
                    <input type="checkbox" checked={saleForm.isLoan} onChange={(e) =>
                        setSaleForm({
                            ...saleForm,
                            isLoan: e.target.checked
                        })} />
                </div>
                {saleForm.isLoan && (
                    <div className="form-field">
                        <label>Apartment Number</label>
                        <input type="text" value={saleForm.apartmentNumber} onChange={(e) =>
                            setSaleForm({
                                ...saleForm,
                                apartmentNumber: e.target.value
                            })} />
                    </div>
                )}
            </div>
            <div className="sale-form-footer">
                <button type='button' onClick={() => navigate('../sales', { replace: true })}>
                    Cancel
                </button>
                <button type='button' onClick={() => onSaveClick()}>
                    Save
                </button>
            </div>
        </form>
    )
}