import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users";

export const getUserByUsername = async (username) => {
  const res = await axios.get(`${BASE_URL}/search/${username}`);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const updateUserById = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteUserById = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};