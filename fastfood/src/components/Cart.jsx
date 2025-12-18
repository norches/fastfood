import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaMapMarkerAlt } from 'react-icons/fa';
import { createOrder } from '../api/orderApi';
import { getProductImage } from '../api/productApi';
import LocationMap from './LocationMap';
import './Cart.css';

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
            setError("Please login first to place an order");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty");
            return;
        }

        if (!selectedLocation) {
            setError("Please select your delivery location on the map");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const locationString = `${selectedLocation.lat}, ${selectedLocation.lng}`;

        try {
            console.log("Placing order with token:", token.substring(0, 20) + "...");
            await createOrder(cartItems, locationString);
            setOrderSuccess(true);
            setTimeout(() => {
                setOrderSuccess(false);
                setSelectedLocation(null);
                onClose();
                cartItems.forEach(item => onRemoveItem(item.productId));
            }, 2000);
        } catch (err) {
            console.error("Order failed:", err);
            if (err.response?.status === 401 || err.message?.includes("Session expired") || err.message?.includes("login")) {
                setError("Session expired. Please login again.");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setError(err.response?.data?.message || err.message || "Failed to place order. Please try again.");
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
                        <FaShoppingCart /> Your Cart
                    </h2>
                    <button className="cart-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <p>Your cart is empty</p>
                            <p className="cart-empty-sub">Add items from the menu to get started!</p>
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
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="cart-location-section">
                                <label className="location-label">
                                    <FaMapMarkerAlt /> Select Delivery Location *
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
                                            Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span className="total-price">{calculateTotal()} so'm</span>
                                </div>
                                
                                {error && (
                                    <div className="cart-error">
                                        {error}
                                    </div>
                                )}
                                
                                {orderSuccess && (
                                    <div className="cart-success">
                                        Order placed successfully! 🎉
                                    </div>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={isSubmitting || cartItems.length === 0}
                                    className="checkout-btn"
                                >
                                    {isSubmitting ? "Processing..." : "Confirm Order"}
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

