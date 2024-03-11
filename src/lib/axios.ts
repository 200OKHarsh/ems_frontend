import axios from "axios";

const axiosInstance = axios.create({

  baseURL: `${import.meta.env.VITE_APP_URL}/api`
});

export default axiosInstance;