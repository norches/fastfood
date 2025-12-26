import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaUser, FaDollarSign, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { getAllOrders } from '../api/orderApi';
import './Admin.css';

function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            if (err.response?.status === 403) {
                setError("Access denied. Visit /login to assign admin role.");
            } else if (err.message?.includes("Session expired") || err.message?.includes("login")) {
                setError("Session expired. Please login again.");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setError(err.response?.data?.message || err.message || "Failed to load orders");
            }
        } finally {
            setLoading(false);
        }
    };

    const parseOrderItems = (ordersData) => {
        try {
            if (typeof ordersData === 'string') {
                return JSON.parse(ordersData);
            }
            return ordersData;
        } catch (e) {
            return [];
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Buyurtmalar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-container">
                <div className="admin-error">
                    <h2>Error</h2>
                    <p>{error}</p>
                    {error.includes("Access denied") && (
                        <div style={{ marginTop: '20px' }}>
                            <a href="/login" style={{
                                color: '#ffd966',
                                textDecoration: 'underline',
                                fontSize: '16px',
                                display: 'block',
                                marginBottom: '15px'
                            }}>
                                Click here to assign admin role
                            </a>
                        </div>
                    )}
                    <button onClick={loadOrders} className="retry-btn" style={{ marginTop: '10px' }}>Qayta urinish</button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>
                    <FaShoppingCart /> Buyurtmalar
                </h1>
                <div>
                    <button onClick={loadOrders} className="refresh-btn">
                        Refresh
                    </button>
                    <button onClick={() => window.location.href = '/admin/products'} className="manage-products-btn">
                        Taomlar
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="admin-empty">
                    <FaShoppingCart className="empty-icon" />
                    <h2>Buyurtmalar yo'q</h2>
                    <p>Hozirda yuklash uchun buyurtmalar yo'q.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order, index) => {
                        const orderItems = parseOrderItems(order.orders);
                        const orderNumber = orders.length - index;

                        return (
                            <div key={order.orderId} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">
                                        <strong>Buyurtma #</strong> {orderNumber}
                                    </div>
                                    <div className="order-total">
                                        {order.total} so'm
                                    </div>
                                </div>

                                <div className="order-customer">
                                    <FaUser className="customer-icon" />
                                    <div>
                                        <strong>{order.firstName}</strong>
                                        {order.lastName && ` ${order.lastName}`}
                                    </div>
                                </div>

                                {orderItems && orderItems.length > 0 && (
                                    <div className="order-items">
                                        <h3>Taomlar:</h3>
                                        <ul>
                                            {orderItems.map((item, idx) => (
                                                <li key={idx} className="order-item">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-details">
                                                        Soni: {item.amount} × {item.price} so'm = {((item.amount || 0) * (item.price || 0))} so'm
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {order.location && (
                                    <div className="order-location">
                                        <FaMapMarkerAlt className="location-icon" />
                                        <span><strong>Manzil:</strong> {order.location}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="admin-stats">
                <div className="stat-card">
                    <FaShoppingCart className="stat-icon" />
                    <div>
                        <h3>{orders.length}</h3>
                        <p>Buyurtmalar soni</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaDollarSign className="stat-icon" />
                    <div>
                        <h3>
                            {orders.reduce((sum, order) => sum + (order.total || 0), 0)} so'm
                        </h3>
                        <p>Jami</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;