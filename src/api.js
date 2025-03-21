import axios from 'axios';

const API_BASE_URL = 'http://192.168.178.177:3001'; // URL вашего сервера

export const getCategories = async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
};

export const addCategory = async (name) => {
    const response = await axios.post(`${API_BASE_URL}/categories`, { name });
    return response.data;
};

export const updateCategory = async (id, name) => {
    const response = await axios.put(`${API_BASE_URL}/categories/${id}`, { name });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
    return response.data;
};

export const addQuestion = async (categoryId, text) => {
    const response = await axios.post(`${API_BASE_URL}/categories/${categoryId}/questions`, { text });
    return response.data;
};

export const deleteQuestion = async (categoryId, questionId) => {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}/questions/${questionId}`);
    return response.data;
};

export const updateQuestion = async (categoryId, questionId, text) => {
    const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}/questions/${questionId}`, { text });
    return response.data;
};