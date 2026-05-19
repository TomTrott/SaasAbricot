import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000",
});
// Interceptor pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;