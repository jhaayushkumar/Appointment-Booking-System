import { api } from "../../../services/axiosClient";

export const login = async (role, credentials) => {
  const res = await api.post(`/auth/${role}/login`, credentials);
  return res.data;
};

export const registerPatient = async ( data) => {
  const res = await api.post('/auth/patient/signup', data);
  return res.data;
};

export const registerDoctor = async (data) => {
  const res = await api.post("/auth/doctor/signup", data);
  return res.data;
};
