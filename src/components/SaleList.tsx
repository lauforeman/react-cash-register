import React from 'react';
import axios from 'axios';
import { API } from '../config/contants';
import { NavLink } from 'react-router-dom';
import { Product } from './ProductList';

type Dict<TValue> = {
    [key: string]: TValue
}

export interface ProductSale {
    productSaleId: number,
    productId: number,
    saleId: number,
    price: number,
    quantity: number,
    product: Product
}

export interface Sale {
    saleId: number,
    date: string,
    total: number,
    isLoan: boolean,
    apartmentNumber: string,
    payment: number,
    productSales: ReadonlyArray<ProductSale>
}

export default function SaleList() {
    const [sales, setSales] = React.useState<ReadonlyArray<Sale>>([]);

    const [showDetail, setShowDetail] = React.useState<Dict<boolean>>({});

    const getSales = React.useCallback(async () => {
        try {
            const response = await axios.get<ReadonlyArray<Sale>>(`${API}/Sale`)
            setSales(response.data);
            setShowDetail(response.data.reduce((dict, sale) => ({ ...dict, [sale.saleId]: false }), {} as Dict<boolean>))
        } catch (error) {

            console.error(error);
        }

    }, [setSales, setShowDetail]);

    React.useEffect(() => {
        getSales();
    }, [getSales]);

    return (
        <div className='sale-list'>
            <NavLink to='/sales/sale/new'>
                <button>Add</button>
            </NavLink>
            <table className='sale-table'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Is Loan</th>
                        <th>Apartament Number</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Change</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map((sale, index) => (
                            <React.Fragment>
                                <tr key={sale.saleId} className={index % 2 === 1 ? 'odd' : 'even'}>
                                    <td>
                                        <button onClick={() =>
                                            setShowDetail({ ...showDetail, [sale.saleId]: !showDetail[sale.saleId]})
                                            }>{showDetail[sale.saleId] ? '↓' : '→'}</button>
                                        {sale.saleId}
                                    </td>
                                    <td>{sale.date}</td>
                                    <td>{sale.isLoan ? 'Yes' : 'No'}</td>
                                    <td>{sale.apartmentNumber}</td>
                                    <td>{sale.total}</td>
                                    <td>{sale.payment}</td>
                                    <td>{sale.payment > 0 ? sale.payment - sale.payment : 0}</td>
                                    <td>
                                        <NavLink to={`/sales/sale/${sale.saleId}`}>
                                            <button disabled={sale.payment > 0}>Edit</button>
                                        </NavLink>
                                    </td>
                                </tr>
                                <tr>
                                    {
                                        showDetail[sale.saleId] && (
                                            <tr>
                                                <td colSpan={8}> Esto es un detalle</td>
                                            </tr>
                                        )
                                    }
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td className='center'>
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}