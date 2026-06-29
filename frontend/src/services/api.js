import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL ||
   "http://localhost:8080/api/v1",
});

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("cms_token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem("cms_user");

      localStorage.removeItem("cms_token");

      sessionStorage.setItem(
        "sessionExpired",
        "true"
      );

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;