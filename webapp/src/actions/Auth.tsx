import { createContext } from 'react';
import { Api } from './Apis';
import axios from 'axios';
import toast from 'react-hot-toast';


// Create a context
export const AuthContext = createContext({
    getOAuthUrl: () => {},
    verifyAuth: async (): Promise<boolean> => { return false },
    logout: () => {}
});

// Create a provider component
export const AuthProvider = ({ children }) => {  
  const getOAuthUrl = async () => {
    const response = await axios.get(Api('oauthUrl'));
    const { url } = response.data;
    // Redirect the user to the OAuth URL
    window.location.href = url;
  };

  const verifyAuth = async () => {
    // Simple auth flow for demonstration purposes 
    const response = await axios.get(Api('oauthVerify'));
    if (response.status === 200 && response.data.status_code !== 401) {
        const {email} = response.data;
        // Store the grant_id and user_email in the user state
        localStorage.setItem('user', email)
        return true
    }
    else {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('user');
        return false
    }
  };

  // Simulate a logout function
  const logout = () => {
    axios.get(Api('logout'));
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ getOAuthUrl, verifyAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};