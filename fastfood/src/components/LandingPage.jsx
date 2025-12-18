import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getProductImage } from "../api/productApi.js";
import burger from "../img/28c866cd86d7bc0f9c0b4329226ce57a4cc97386.png";
import coffee from "../img/coffee.png";
import Cart from "./Cart.jsx";
import "../App.css";
import axios from "axios";

function LandingPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
            fetchUserInfo(token);
        }

        getProducts()
            .then(setProducts)
            .catch(err => console.error("Failed to load menu", err));
    }, []);

    const fetchUserInfo = async (token) => {
        try {
            const decodedToken = parseJwt(token);
            setUserName(decodedToken.firstName || "User");
        } catch (error) {
            console.error("Failed to fetch user info", error);
            handleLogout();
        }
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        setIsLoggedIn(false);
        setUserName("");

        setCartItems([]);
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const addToCart = (productId) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productId === productId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { productId, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="page">
            <nav id="navbar" className="navbar">
                <div className="nav-container">
                    <h1 className="logo">BURGUR</h1>
                    <ul className="nav-links">
                        <li className="li" onClick={() => scrollToSection("menu")}>Menu</li>
                        <li className="li" onClick={() => scrollToSection("why")}>About</li>
                        <li className="li" onClick={() => scrollToSection("footer")}>Contact us</li>
                    </ul>
                    <div className="nav-icons">
                        {isLoggedIn ? (
                            <div className="user-info">
                                <span className="username" onClick={() => navigate("/status")} style={{ cursor: "pointer" }}>Account: {userName}</span>
                                <button onClick={handleLogout} className="logout-button">
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleLoginClick} className="login-button">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div
                className="floating-cart-button"
                onClick={() => setIsCartOpen(true)}
            >
                <FaShoppingCart />
                {getCartItemCount() > 0 && (
                    <span className="floating-cart-badge">{getCartItemCount()}</span>
                )}
            </div>

            <section id="hero" className="hero">
                <div className="hero-text">
                    <div className="headline-group">
                        <p className="ultimate-text">THE ULTIMATE</p>
                        <h1 className="hero-title">Burger Club</h1>
                        <p className="subtitle">
                            Savor the Flavor, Join the Club!
                        </p>
                    </div>
                    <div className="thumbs">
                        <div className="thumb">
                            <img src={burger} alt="burger" />
                        </div>
                        <div className="thumb">
                            <img src={burger} alt="burger" />
                        </div>
                        <div className="thumb">
                            <img src={burger} alt="burger" />
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={burger} alt="Burger" />
                </div>
            </section>

            <section className="info">
                <div className="info-section">
                    <div className="text-section">
                        <h1 className="main-text">Discover the best burger</h1>
                        <p className="info-text"> At Burgur, we don't just serve burgers; we serve quality. Each burger is crafted with the finest ingredients to deliver the perfect balance of flavor, texture, and satisfaction. Whether you're craving a classic or something new, every bite is an experience that takes you beyond ordinary fast food.
                            Our secret? It is the passion we put into every burger, the love for the craft, and the commitment to offering you the best taste you'll ever find. At Burgur, every burger is a masterpiece designed to delight your taste buds and fuel your hunger.
                            Taste the difference. Feel the joy. Burgur – where every burger is better than the last.
                        </p>
                    </div>
                    <div className="image-section">
                        <img src={coffee} alt="Coffee" />
                    </div>
                </div>
            </section>

            <section id="menu" className="menu">
                <div className="menu-container">
                    <h2 className="menu-title">Enjoy a new blend of coffee style</h2>
                    <p className="menu-subtitle">
                        Explore all flavours of coffee with us. There is always a new cup worth experiencing
                    </p>
                    <div className="menu-grid">
                        {products.map(product => (
                            <div className="menu-card" key={product.id}>
                                <img
                                    src={getProductImage(product.image)}
                                    alt={product.name}
                                />
                                <h3>{product.name}</h3>
                                <p className="menu-desc">{product.description}</p>
                                <span className="menu-price">{product.price} so'm</span>
                                <button onClick={() => addToCart(product.id)}>Order Now</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="why" className="why">
                <div className="why-container">
                    <h2 className="why-title">Why are we different?</h2>
                    <p className="why-subtitle">
                        We don't just make your coffee, we make your day!
                    </p>

                    <div className="why-grid">
                        <div className="why-card ">
                            <span className="why-icon">☕</span>
                            <h3>Supreme Beans</h3>
                            <p>Beans that provides great taste</p>
                        </div>

                        <div className="why-card">
                            <span className="why-icon">🏅</span>
                            <h3>High Quality</h3>
                            <p>We provide the highest quality</p>
                        </div>

                        <div className="why-card">
                            <span className="why-icon">✨</span>
                            <h3>Extraordinary</h3>
                            <p>Coffee like you have never tasted</p>
                        </div>

                        <div className="why-card">
                            <span className="why-icon">💰</span>
                            <h3>Affordable Price</h3>
                            <p>Our Coffee prices are easy to afford</p>
                        </div>
                    </div>

                    <p className="why-footer">
                        Great ideas start with great coffee, Lets help you achieve that
                    </p>

                    <button className="why-btn">Join Us</button>
                </div>
            </section>

            <footer id="footer" className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h2 className="footer-logo">BURGUR</h2>
                        <p>
                            Savor the flavor and enjoy the finest burgers & coffee crafted
                            with passion and quality ingredients.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li onClick={() => scrollToSection("navbar")}>Starting</li>
                            <li onClick={() => scrollToSection("menu")}>Menu</li>
                            <li onClick={() => scrollToSection("why")}>About</li>
                            <li>Contact us</li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li>Contact</li>
                            <li>FAQ</li>
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Newsletter</h4>
                        <p>Get updates & special offers</p>
                        <div className="newsletter-box">
                            <input type="email" placeholder="Your email" />
                            <button>Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2025 Burgur. All rights reserved.</p>
                </div>
            </footer>

            {isCartOpen && (
                <Cart
                    cartItems={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    onClose={() => setIsCartOpen(false)}
                    products={products}
                />
            )}
        </div>
    );
}

export default LandingPage;