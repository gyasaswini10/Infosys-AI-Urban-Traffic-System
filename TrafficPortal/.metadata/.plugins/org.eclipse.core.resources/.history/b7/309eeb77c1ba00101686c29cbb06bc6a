import axios from "axios";

const API_BASE_URL = "http://localhost:8808/api/auth";

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });
  return response.data; // e.g., token or user info
};

export const signup = async (username, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/signup`, {
    username,
    email,
    password,
  });
  return response.data;
};
