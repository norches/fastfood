import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../api/orderApi.js";
import "./status.css";

function Status() {
    const navigate = useNavigate();
    const steps = [
        { title: "Zakaz qabul qilindi", icon: "🟢" },
        { title: "Tayyorlanmoqda", icon: "🍳" },
        { title: "Zakaz yo'lda", icon: "🚴" },
        { title: "Yetkazildi", icon: "📦" },
    ];

    const STEP_TIME = 10 * 60;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const userOrders = await getUserOrders();
                const activeOrders = userOrders.filter(order => {
                    if (!order.createdAt) {
                        console.warn("Order missing createdAt:", order);
                        return false;
                    }
                    const { currentStep } = calculateOrderStatus(order.createdAt);
                    return currentStep < steps.length - 1;
                });
                setOrders(activeOrders);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const calculateOrderStatus = (createdAt) => {
        if (!createdAt) {
            return { currentStep: 0, timeLeft: STEP_TIME };
        }
        const created = new Date(createdAt);
        if (isNaN(created.getTime())) {
            return { currentStep: 0, timeLeft: STEP_TIME };
        }
        const now = new Date();
        const elapsedSeconds = Math.floor((now - created) / 1000);
        const currentStep = Math.min(Math.floor(elapsedSeconds / STEP_TIME), steps.length - 1);
        const timeInCurrentStep = elapsedSeconds % STEP_TIME;
        const timeLeft = STEP_TIME - timeInCurrentStep;
        
        return { currentStep, timeLeft: Math.max(0, timeLeft) };
    };

    useEffect(() => {
        if (orders.length === 0) return;

        const interval = setInterval(() => {
            setOrders(prevOrders => {
                const updatedOrders = prevOrders.filter(order => {
                    if (!order.createdAt) return false;
                    const { currentStep } = calculateOrderStatus(order.createdAt);
                    return currentStep < steps.length - 1;
                });

                return updatedOrders.length !== prevOrders.length ? updatedOrders : [...prevOrders];
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [orders.length, steps.length]);

    if (loading) {
        return (
            <div className="order-container">
                <h2 className="title">Zakaz holati</h2>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-container">
                <h2 className="title">Zakaz holati</h2>
                <p style={{ color: "red" }}>Xatolik: {error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="order-container">
                <h2 className="title">Zakaz holati</h2>
                <p>Hozircha faol zakazlar yo'q</p>
            </div>
        );
    }

    return (
        <div className="order-container">
            <h2 className="title">Zakaz holati</h2>
            {orders.map((order) => {
                const { currentStep, timeLeft } = calculateOrderStatus(order.createdAt);
                return (
                    <div key={order.orderId} style={{ marginBottom: "2rem" }}>
                        <h3 style={{ marginBottom: "1rem" }}>Zakaz #{order.orderId.substring(0, 8)}</h3>
                        <div className="timeline">
                            {steps.map((item, index) => (
                                <div key={index} className="step">
                                    <div className={`circle ${index <= currentStep ? "active" : ""}`}>
                                        {item.icon}
                                    </div>

                                    {index !== steps.length - 1 && (
                                        <div className={`line ${index < currentStep ? "active" : ""}`} />
                                    )}

                                    <p className={`label ${index === currentStep ? "current" : ""}`}>
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {currentStep < steps.length - 1 && (
                            <div className="timer">
                                Keyingi statusga:{" "}
                                <b>
                                    {Math.floor(timeLeft / 60)}:
                                    {String(Math.floor(timeLeft % 60)).padStart(2, "0")}
                                </b>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Status;
