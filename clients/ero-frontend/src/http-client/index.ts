import axios from "axios";
import { BASE_URL } from "../assets/constants";

export const HttpClient = axios.create({
  baseURL: BASE_URL,
});
