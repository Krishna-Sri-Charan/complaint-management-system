import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
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

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;