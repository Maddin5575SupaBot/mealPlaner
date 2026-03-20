import axios from 'axios';
import { mockApi } from './mockData';

// Check if we're in production (GitHub Pages) or development
const isProduction = process.env.NODE_ENV === 'production';
const useMockApi = isProduction; // Use mock API for GitHub Pages deployment

// Create axios instance for development
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response) {
      const { status, data } = error.response;
      return Promise.reject(data || { error: `HTTP ${status}` });
    } else if (error.request) {
      return Promise.reject({ error: 'Network error - no response from server' });
    } else {
      return Promise.reject({ error: error.message });
    }
  }
);

// Recipe API - switches between real and mock API
export const recipeApi = {
  getAll: () => useMockApi ? mockApi.recipes.getAll() : api.get('/recipes'),
  getById: (id) => useMockApi ? mockApi.recipes.getById(id) : api.get(`/recipes/${id}`),
  create: (recipeData) => useMockApi ? mockApi.recipes.create(recipeData) : api.post('/recipes', recipeData),
  update: (id, recipeData) => useMockApi ? mockApi.recipes.update(id, recipeData) : api.put(`/recipes/${id}`, recipeData),
  delete: (id) => useMockApi ? mockApi.recipes.delete(id) : api.delete(`/recipes/${id}`),
  search: (query, category) => useMockApi ? mockApi.recipes.search(query) : api.get('/recipes/search', { params: { q: query, category } }),
  getCategories: () => useMockApi ? mockApi.recipes.getCategories() : api.get('/recipes/categories'),
  getByCategory: (category) => useMockApi ? 
    Promise.resolve(mockApi.recipes.getAll().then(recipes => recipes.filter(r => r.category === category))) : 
    api.get(`/recipes/category/${category}`),
};

// Meal Plan API - switches between real and mock API
export const mealPlanApi = {
  getAll: () => useMockApi ? mockApi.mealPlans.getAll() : api.get('/meal-plans'),
  getById: (id) => useMockApi ? mockApi.mealPlans.getById(id) : api.get(`/meal-plans/${id}`),
  create: (mealPlanData) => useMockApi ? mockApi.mealPlans.create(mealPlanData) : api.post('/meal-plans', mealPlanData),
  update: (id, mealPlanData) => useMockApi ? mockApi.mealPlans.update(id, mealPlanData) : api.put(`/meal-plans/${id}`, mealPlanData),
  delete: (id) => useMockApi ? mockApi.mealPlans.delete(id) : api.delete(`/meal-plans/${id}`),
  generate: (options) => useMockApi ? mockApi.mealPlans.generate(options) : api.post('/meal-plans/generate', options),
  getGroceryList: (id) => useMockApi ? 
    Promise.resolve({ 
      meal_plan_id: id, 
      name: 'Mock Grocery List', 
      note: 'Grocery lists handled by Einkaufsliste app',
      items: [] 
    }) : 
    api.get(`/meal-plans/${id}/grocery-list`),
};

// Health check
export const healthCheck = () => useMockApi ? mockApi.health() : api.get('/health');

export default api;