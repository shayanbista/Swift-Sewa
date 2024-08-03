// import axios from "axios";

// export const instance = axios.create({
//   baseURL: "http://localhost:8000/",
//   timeout: 20000,
//   headers: { "X-Custom-Header": "foobar" },
// });

// // Add a request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");

//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

import axios from "axios";
import { showToast } from "../constants/toastify";

const instance = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 20000,
  headers: { "X-Custom-Header": "foobar" },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      navigateToLogin();
    }
    return Promise.reject(error);
  }
);

function navigateToLogin() {
  showToast("Please login again", 2000, "red");
  window.location.href = "#/login/";
}

export { instance };
