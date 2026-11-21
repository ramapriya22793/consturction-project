import axios from "axios";
import { supabase } from "./supabase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // In local dev without active Supabase session, use demo user header
    config.headers["x-demo-user-id"] = localStorage.getItem("civil_demo_user_id") || "demo-engineer-id";
  }

  return config;
});

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
