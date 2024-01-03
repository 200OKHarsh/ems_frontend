import axios from "axios";

const axiosInstance = axios.create({

  baseURL: "https://ems-server-1likx0oi2-200ok-harshs-projects.vercel.app/api"
});

export default axiosInstance;