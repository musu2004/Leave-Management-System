import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const ROLE_LABEL = {
  EMPLOYEE: "Employee",
  MANAGER: "Reporting Manager",
  HR: "HR",
  ADMIN: "Admin",
};

// user = { username (email), role, empId, name }
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("lms_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (u) => {
    localStorage.setItem("lms_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("lms_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
