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
      const endpoint =
        role === "doctor" ? "/doctors/profile" : "/patients/profile";
      const { data } = await api.get(endpoint);
      const entity = role === "doctor" ? data?.doctor : data?.patient;

      if (!entity) {
        throw new Error("Profile data missing");
      }

      setUser({ ...entity, role });
      setIsAuthenticated(true);
    };

    const restoreSession = async () => {
      try {
        await api.get("/auth/doctor/me");
        await hydrateProfile("doctor");
        return;
      } catch {
        // ignore and try patient route
      }

      try {
        await api.get("/auth/patient/me");
        await hydrateProfile("patient");
        return;
      } catch {
        // no valid session
      }

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
