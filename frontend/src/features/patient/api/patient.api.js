import { api } from "../../../services/axiosClient";

const BASE_URL = "/patients";

const handleApiError = (error, defaultValue) => {
  if (import.meta.env.DEV) {
    return defaultValue;
  }
  throw error;
};

export const getPatientDoctors = async () => {
  try {
    const response = await api.get(`${BASE_URL}/doctors`);
    return response.data?.doctors ?? response.data ?? [];
  } catch (error) {
    return handleApiError(error, []);
  }
};

export const getPatientAppointments = async () => {
  try {
    const response = await api.get(`${BASE_URL}/appointments`);
    return response.data?.appointments ?? response.data ?? [];
  } catch (error) {
    return handleApiError(error, []);
  }
};

export const bookPatientAppointment = async ({ doctorId, slotId, date }) => {
  try {
    const response = await api.post(`${BASE_URL}/appointments`, {
      doctorId,
      slotId,
      date,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, null);
  }
};

export const cancelPatientAppointment = async (appointmentId, reason) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/appointments/${appointmentId}`,
      {
        data: { reason },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, null);
  }
};

export const getPatientProfile = async () => {
  try {
    const response = await api.get(`${BASE_URL}/profile`);
    return response.data?.patient ?? response.data ?? {};
  } catch (error) {
    return handleApiError(error, {});
  }
};

export const updatePatientProfile = async (profileData) => {
  try {
    const response = await api.put(`${BASE_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    return handleApiError(error, null);
  }
};
