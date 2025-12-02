import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/axiosClient";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrateProfile = async (role) => {
      try {
        const endpoint =
          role === "doctor" ? "/doctors/profile" : "/patients/profile";
        console.log(`Fetching profile from: ${endpoint}`);
        const { data } = await api.get(endpoint);
        console.log("Profile data received:", data);
        const entity = role === "doctor" ? data?.doctor : data?.patient;

        if (!entity) {
          console.error("Profile data missing in response:", data);
          throw new Error("Profile data missing");
        }

        console.log("Setting user:", { ...entity, role });
        setUser({ ...entity, role });
        setIsAuthenticated(true);
      } catch (error) {
        console.error(`Error hydrating ${role} profile:`, error);
        throw error;
      }
    };

    const restoreSession = async () => {
      console.log("Restoring session...");
      try {
        console.log("Checking doctor session...");
        await api.get("/auth/doctor/me");
        console.log("Doctor session valid, hydrating profile...");
        await hydrateProfile("doctor");
        console.log("Doctor profile hydrated successfully");
        return;
      } catch (error) {
        console.log("Doctor session check failed:", error.message);
        // ignore and try patient route
      }

      try {
        console.log("Checking patient session...");
        await api.get("/auth/patient/me");
        console.log("Patient session valid, hydrating profile...");
        await hydrateProfile("patient");
        console.log("Patient profile hydrated successfully");
        return;
      } catch (error) {
        console.log("Patient session check failed:", error.message);
        // no valid session
      }

      console.log("No valid session found");
      setUser(null);
      setIsAuthenticated(false);
    };

    restoreSession().finally(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const loginRequest = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginRequest,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
