import axios from "axios";

const axiosInstance = axios.create({

  baseURL: `${process.env.APP_URL}`
});

export default axiosInstance;