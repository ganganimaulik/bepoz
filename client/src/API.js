import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getAllUsers = () => {
  return axios.get(`${API_URL}/api/users/all`);
};
export const getUserById = (id) => {
  return axios.get(`${API_URL}/api/users/${id}`);
};

export const updateUserCart = (user, cart) => {
  return axios.put(`${API_URL}/api/users/update-cart`, { user, cart });
};

export const getAllProducts = () => {
  return axios.get(`${API_URL}/api/products/all`);
};

export const getCheckoutResult = (user) => {
  return axios.get(`${API_URL}/api/users/checkout/${user.id}`);
};
