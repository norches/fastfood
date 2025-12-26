import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getProductImage } from "../api/productApi.js";
import burger from "../img/28c866cd86d7bc0f9c0b4329226ce57a4cc97386.png";
import coffee from "../img/aksiya.png";
import xotdog from "../img/xotdog-removebg-preview.png";
import kfc from "../img/iskander.png";
import lavash from "../img/lavash-removebg-preview.png";
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
        navigate("/register");
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
                    <h1 className="logo">SHAX BURGER</h1>
                    <ul className="nav-links">
                        <li className="li" onClick={() => scrollToSection("menu")}>Menyu</li>
                        <li className="li" onClick={() => scrollToSection("why")}>Biz haqimizda</li>
                        <li className="li" onClick={() => scrollToSection("footer")}>Bog'lanish</li>
                    </ul>
                    <div className="nav-icons">
                        {isLoggedIn ? (
                            <div className="user-info">
                                <span className="username" style={{ cursor: "pointer" }}>Akkaunt: {userName}</span>
                                <button onClick={handleLogout} className="logout-button">
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleLoginClick} className="login-button">
                                Kirish
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
                        <p className="ultimate-text">Buxoroda yagona</p>
                        <h1 className="hero-title">Shax Burger</h1>
                        <p className="subtitle">
                            Lazzatdan bahramand bo'ling, bizga qo'shiling!
                        </p>
                    </div>
                    <div className="thumbs">
                        <div className="thumb">
                            <img src={lavash} alt="burger" />
                        </div>
                        <div className="thumb">
                            <img src={xotdog} alt="burger" />
                        </div>
                        <div className="thumb">
                            <img src={kfc} alt="burger" />
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
                        <h1 className="main-text">Bizda aksiya!</h1>
                        <p className="info-text">
                            1. 150.000 so'mdan oshgan buyurtmaga 1L Coca Cola ichimligi qo'shib beriladi. <br />
                            2. 200.000 so'mdan oshgan buyurtmaga 1.5L Coca Cola ichimligi qo'shib beriladi. <br />
                            3. 250.000 so'm va undan oshiq summaga qilingan buyurtmaga yetkazib berish bepul.
                            <br/>
                            <br/>
                            Ta'tib ko'ring va ta'midan bahramand bo'ling.
                        </p>
                    </div>
                    <div className="image-section">
                        <img src={coffee} alt="Coffee" />
                    </div>
                </div>
            </section>

            <section id="menu" className="menu">
                <div className="menu-container">
                    <h2 className="menu-title">Bizning menyuda:</h2>
                    <p className="menu-subtitle">
                        Bizning menyuni ta'tib ko'ring. Har doim tajriba qilishga arziydigan yangi taom mavjud.
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
                                <button onClick={() => addToCart(product.id)}>Buyurtma qilish</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="why" className="why">
                <div className="why-container">
                    <h2 className="why-title">Nima uchun bizni tanlashingiz kerak?</h2>
                    <p className="why-subtitle">
                        Biz shunchaki taomingizni emas, kuningizni ham o'zgartiramiz!
                    </p>

                    <div className="why-grid">
                        <div className="why-card">
                            <span className="why-icon">🏅</span>
                            <h3>Yuqori sifat</h3>
                            <p>Biz sizga eng yaxshini taklif qilamiz</p>
                        </div>

                        <div className="why-card">
                            <span className="why-icon">✨</span>
                            <h3>G'ayrioddiy ta'm</h3>
                            <p>Siz hali ta'tib ko'rmagan ta'm</p>
                        </div>

                        <div className="why-card">
                            <span className="why-icon">💰</span>
                            <h3>Qulay narx</h3>
                            <p>Bizga ovqatlat siz uchun qulay narxda</p>
                        </div>
                    </div>

                    <p className="why-footer">
                        Ajoyib g'oyalar ajoyib qorin to'qligida boshlanadi, Keling, bunga erishishingizga yordam beramiz
                    </p>

                    <button className="why-btn">Bizga qo'shiling</button>
                </div>
            </section>

            <footer id="footer" className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h2 className="footer-logo">SHAX BURGER</h2>
                        <p>
                            Lazzatni tatib ko'ring va sifatli mahsulotlar bilan tayyorlangan eng zo'r burger va qahvalardan bahramand bo'ling.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Linklar</h4>
                        <ul>
                            <li onClick={() => scrollToSection("navbar")}>Boshlanish</li>
                            <li onClick={() => scrollToSection("menu")}>Menyu</li>
                            <li onClick={() => scrollToSection("why")}>Biz haqimizda</li>
                            <li>Bo'glanish</li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Yordam xizmati</h4>
                        <ul>
                            <li>Kontaklarimiz:</li>
                            <h5 style={{marginBottom:"10px"}}>+998949285654</h5>
                            <li>Instagram saxifamiz:</li>
                            <h5>shax_burger</h5>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Bizning manzilimiz</h4>
                        <p>Buxoro shahar, G'ijduvon ko'chasi 9</p>
                        <h3>Samarqand darvoza ro'parasida</h3>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2025 SHAX BURGER. Siz haqqingizda qayg'uramiz.</p>
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