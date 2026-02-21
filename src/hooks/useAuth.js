import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5001/api/user/profile", {
          withCredentials: true,
        });
        setUserInfo(data);
      } catch (err) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = (userData) => setUserInfo(userData);
  const logout = () => setUserInfo(null);
  
  // ✅ NEW: Update profile function
  const updateProfile = (updatedData) => {
    setUserInfo(updatedData);
  };

  return (
    <AuthContext.Provider value={{ 
      userInfo, 
      login, 
      logout, 
      updateProfile,  // ✅ Add this
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default useAuth;