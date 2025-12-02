import { api } from "../../../services/axiosClient";

const BASE_URL = "/doctors";

// Helper function to handle API errors
const handleApiError = (error, defaultValue) => {
  if (import.meta.env.DEV) {
    console.error("API Error:", error);
    return defaultValue;
  }
  throw error;
};

// Get doctor's appointments
export const getDoctorAppointments = async () => {
  try {
    const response = await api.get(`${BASE_URL}/appointments`);
    return response.data?.appointments ?? response.data ?? [];
  } catch (error) {
    return handleApiError(error, []);
  }
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await api.put(
      `${BASE_URL}/appointments/${appointmentId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, { id: appointmentId, status });
  }
};

// Get doctor's availability
export const getDoctorAvailability = async () => {
  try {
    const response = await api.get(`${BASE_URL}/slots`);
    return response.data?.slots ?? response.data ?? [];
  } catch (error) {
    return handleApiError(error, []);
  }
};

// Add availability slot
export const addAvailabilitySlot = async (slotData) => {
  try {
    const response = await api.post(`${BASE_URL}/slots`, slotData);
    return response.data;
  } catch (error) {
    return handleApiError(error, { ...slotData, id: Date.now() });
  }
};

// Delete availability slot
export const deleteAvailabilitySlot = async (slotId) => {
  try {
    const response = await api.delete(`${BASE_URL}/slots/${slotId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, { id: slotId });
  }
};

// Get doctor's patients
export const getDoctorPatients = async () => {
  try {
    const response = await api.get(`${BASE_URL}/patients`);
    return response.data?.patients ?? response.data ?? [];
  } catch (error) {
    return handleApiError(error, []);
  }
};

// Get doctor's profile
export const getDoctorProfile = async () => {
  try {
    const response = await api.get(`${BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    return handleApiError(error, null);
  }
};

// Update doctor's profile
export const updateDoctorProfile = async (profileData) => {
  try {
    const response = await api.put(`${BASE_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    return handleApiError(error, null);
  }
};
