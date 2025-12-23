import axios from "axios";
import { refreshAccessToken } from "./authApi.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/products`;

export const getProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getProductImage = (imageName) =>
  `${BASE_URL}/api/products/img?name=${imageName}`;

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  let token = localStorage.getItem("accessToken");

  return withAuthRetry(async (overrideToken) => {
    const t = overrideToken || token;
    const headers = {};
    if (t) {
      headers["Authorization"] = t;
    }
    console.log("Uploading with token:", t);
    const res = await axios.post(`${API_URL}/img`, formData, { headers });
    return res.data;
  });
};

const withAuthRetry = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshAccessToken();
      return await fn(newToken);
    }
    throw err;
  }
};

export const createProduct = async (dto) => {
  let token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated. Please login first.");
  }

  return withAuthRetry(async (overrideToken) => {
    const t = overrideToken || token;
    const res = await axios.post(API_URL, dto, {
      headers: { Authorization: t },
    });
    return res.data;
  });
};

export const editProduct = async (id, dto) => {
  let token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated. Please login first.");
  }

  return withAuthRetry(async (overrideToken) => {
    const t = overrideToken || token;
    const res = await axios.put(`${API_URL}?id=${id}`, dto, {
      headers: { Authorization: t },
    });
    return res.data;
  });
};

export const deleteProduct = async (id) => {
  let token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated. Please login first.");
  }

  return withAuthRetry(async (overrideToken) => {
    const t = overrideToken || token;
    console.log("Deleting with token:", t);
    const res = await axios.delete(`${API_URL}?id=${id}`, {
      headers: {
        Authorization: t,
      },
    });
    return res.data;
  });
};
