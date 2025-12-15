import { FaShoppingCart, FaUserShield } from "react-icons/fa";
import burger from "../img/28c866cd86d7bc0f9c0b4329226ce57a4cc97386.png";
import "../App.css";

function LandingPage() {
    return (
        <div className="page">

            <nav className="navbar">
                <div className="nav-container">

                    <h1 className="logo">BURGUR</h1>

                    <ul className="nav-links">
                        <li>Home</li>
                        <li>Menu</li>
                        <li>About</li>
                        <li>Shop</li>
                    </ul>

                    <div className="nav-icons">
                        <FaShoppingCart />
                        <FaUserShield />
                    </div>

                </div>
            </nav>

            <section className="hero">
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

        </div>
    );
}

export default LandingPage;
