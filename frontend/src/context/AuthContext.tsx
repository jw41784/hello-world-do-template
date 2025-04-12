import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);
          
          // Get the user ID from localStorage
          const userId = localStorage.getItem('userId');
          if (userId) {
            // Fetch the current user
            const response = await api.get(`/api/users/${userId}/user`);
            setUser(response.data);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        // Handle token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      // Create a unique user ID from the email
      const userId = btoa(email).replace(/[+/=]/g, '');
      
      // Send login request
      const response = await api.post(`/api/users/${userId}/auth`, { email, password });
      const { token } = response.data;
      
      // Save token and userId to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      const userResponse = await api.get(`/api/users/${userId}/user`);
      
      setToken(token);
      setUser(userResponse.data);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  // Register user
  const register = async (username: string, email: string, password: string) => {
    try {
      // Create a unique user ID from the email
      const userId = btoa(email).replace(/[+/=]/g, '');
      
      // Register the user
      await api.post(`/api/users/${userId}/register`, { username, email, password });
      
      // Login after successful registration
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    delete api.defaults.headers.common['Authorization'];
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};