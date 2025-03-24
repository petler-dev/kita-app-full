import axios from 'axios';

const API_BASE_URL = 'http://192.168.178.177:3001'; // URL вашего сервера

export const getCategories = async (age) => {
    const response = await axios.get(`${API_BASE_URL}/categories`, {
        params: { age },
    });
    return response.data;
};


export const addCategory = async (name, age) => {
    const response = await axios.post(`${API_BASE_URL}/categories`, { name, age });
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

export const addQuestion = async (categoryId, text, tooltip = "") => {
    const response = await axios.post(`${API_BASE_URL}/categories/${categoryId}/questions`, { text, tooltip });
    return response.data;
};

export const deleteQuestion = async (categoryId, questionId) => {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}/questions/${questionId}`);
    return response.data;
};

export const updateQuestion = async (categoryId, questionId, text, tooltip) => {
    const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}/questions/${questionId}`, { text, tooltip });
    return response.data;
};