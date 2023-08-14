/**
 * 添加请求拦截器
 * Add a request interceptor
 */
import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  function (config) {
    console.log("请求", config);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    console.log("响应", response);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// axios.interceptors.request.use(
//   function (config) {
//     console.log("请求", config);
//     alert("ddd");
//     // Do something before request is sent
//     // 获取你的 Cookie 信息，假设你存储在名为 "myCookie" 的变量中
//     const cookieValue = getCookieValue("JSESSIONID");
//     alert(cookieValue);
//     // 添加 Cookie 头到请求配置
//     if (cookieValue) {
//       config.headers["Cookie"] = cookieValue;
//     }
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );
//
// // Add a response interceptor
// axios.interceptors.response.use(
//   function (response) {
//     console.log("响应", response);
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );
//
// // 获取 Cookie 值的函数示例
// function getCookieValue(cookieName: string) {
//   const cookies = document.cookie.split(";");
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split("=");
//     if (name === cookieName) {
//       return value;
//     }
//   }
//   return null;
// }
