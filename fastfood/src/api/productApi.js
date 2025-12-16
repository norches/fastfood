import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const getProducts = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const getProductImage = (imageName) =>
    `http://localhost:8080/api/products/img?name=${imageName}`;
