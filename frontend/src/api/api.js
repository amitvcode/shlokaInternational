import axios from "axios";
import config from "../config";

const API = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${config.apiBaseUrl}/${path.startsWith('uploads/') ? '' : 'uploads/'}${path}`;
};
