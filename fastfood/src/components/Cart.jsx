import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaMapMarkerAlt } from 'react-icons/fa';
import { createOrder } from '../api/orderApi';
import { getProductImage } from '../api/productApi';
import LocationMap from './LocationMap';
import './Cart.css';
import {useNavigate} from "react-router-dom";

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClose, products }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
            setError("Iltimos akkauntingizga kiring");
            setTimeout(() => {
                window.location.href = "/register";
            }, 2000);
            return;
        }

        if (cartItems.length === 0) {
            setError("Savatingiz hali bo'sh");
            return;
        }

        if (!selectedLocation) {
            setError("Xaritada yetkazib berish manzilingizni tanlang");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const locationString = `${selectedLocation.lat}, ${selectedLocation.lng}`;

        try {
            await createOrder(cartItems, locationString);
            setOrderSuccess(true);
            setTimeout(() => {
                setOrderSuccess(false);
                setSelectedLocation(null);
                onClose();
                cartItems.forEach(item => onRemoveItem(item.productId));
            }, 2000);
        } catch (err) {
            if (err.response?.status === 401 || err.message?.includes("Session expired") || err.message?.includes("login")) {
                setError("Iltimos qayta akkauntingizga kiring.");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setError(err.response?.data?.message || err.message || "Qayta urinib ko'ring.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getProductDetails = (productId) => {
        return products.find(p => p.id === productId);
    };

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>
                        <FaShoppingCart /> Sizning savatingiz
                    </h2>
                    <button className="cart-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <p>Savatingiz hali bo'sh</p>
                            <p className="cart-empty-sub">Boshlash uchun menyudan narsalarni qo'shing!</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map((item) => {
                                    const product = getProductDetails(item.productId);
                                    if (!product) return null;

                                    return (
                                        <div key={item.productId} className="cart-item">
                                            <img
                                                src={getProductImage(product.image)}
                                                alt={product.name}
                                                className="cart-item-image"
                                            />
                                            <div className="cart-item-details">
                                                <h3>{product.name}</h3>
                                                <p className="cart-item-price">{product.price} so'm</p>
                                                <div className="cart-item-controls">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="quantity-btn"
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                                                        className="quantity-btn"
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                    <button
                                                        onClick={() => onRemoveItem(item.productId)}
                                                        className="remove-btn"
                                                    >
                                                        O'chirish
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="cart-location-section">
                                <label className="location-label">
                                    <FaMapMarkerAlt /> Manzilingizni tanlang *
                                </label>
                                <LocationMap 
                                    onLocationSelect={(location) => {
                                        setSelectedLocation(location);
                                        setError(null);
                                    }}
                                />
                                {selectedLocation && (
                                    <div className="selected-location-info">
                                        <FaMapMarkerAlt className="location-icon" />
                                        <span>
                                            Tanlangan manzil: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Umumiy:</span>
                                    <span className="total-price">{calculateTotal()} so'm</span>
                                </div>
                                
                                {error && (
                                    <div className="cart-error">
                                        {error}
                                    </div>
                                )}
                                
                                {orderSuccess && (
                                    <div className="cart-success">
                                        Buyurtmangiz qabul qilindi! 🎉
                                    </div>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={isSubmitting || cartItems.length === 0}
                                    className="checkout-btn"
                                >
                                    {isSubmitting ? "Jarayonda..." : "Buyurtma berish"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Cart;

