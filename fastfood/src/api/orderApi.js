import axios from "axios";
import { refreshAccessToken } from "./authApi.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/orders`;
export const createOrder = async (orderItems, location) => {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("User not authenticated. Please login first.");
  }

  const orderDto = orderItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const requestBody = {
    items: orderDto,
    location: location,
  };

  try {
    const res = await axios.post(API_URL, requestBody, {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      try {
        token = await refreshAccessToken();
        const retryRes = await axios.post(API_URL, requestBody, {
          headers: {
            Authorization: token,
          },
        });
        return retryRes.data;
      } catch (retryErr) {
        throw new Error("Session expired. Please login again.");
      }
    }
    if (err.response?.status === 403) {
      throw new Error("Access denied.");
    }

    throw err;
  }
};

export const getUserOrders = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("User not authenticated. Please login first.");
  }

  try {
    const res = await axios.get(`${API_URL}/my`, {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  } catch (err) {
    console.error(
      "getUserOrders error:",
      err.response?.status,
      err.response?.data
    );

    if (err.response?.status === 401) {
      try {
        console.log("Got 401, refreshing token...");
        const newToken = await refreshAccessToken();
        const retryRes = await axios.get(`${API_URL}/my`, {
          headers: {
            Authorization: newToken,
          },
        });
        return retryRes.data;
      } catch (retryErr) {
        console.error("Token refresh failed:", retryErr);
        throw new Error("Session expired. Please login again.");
      }
    }
    if (err.response?.status === 403) {
      throw new Error("Access denied. Admin privileges required.");
    }

    throw err;
  }
};

export const getAllOrders = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("User not authenticated. Please login first.");
  }

  try {
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  } catch (err) {
    console.error(
      "getAllOrders error:",
      err.response?.status,
      err.response?.data
    );

    if (err.response?.status === 401) {
      try {
        console.log("Got 401, refreshing token...");
        const newToken = await refreshAccessToken();
        const retryRes = await axios.get(API_URL, {
          headers: {
            Authorization: newToken,
          },
        });
        return retryRes.data;
      } catch (retryErr) {
        console.error("Token refresh failed:", retryErr);
        throw new Error("Session expired. Please login again.");
      }
    }
    if (err.response?.status === 403) {
      throw new Error("Access denied. Admin privileges required.");
    }

    throw err;
  }
};
