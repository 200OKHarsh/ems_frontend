import axios from "axios";

const axiosInstance = axios.create({

  baseURL: "https://ems-server-mocha.vercel.app/api"
});

export default axiosInstance;