import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const PUBLIC_VAPID_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [loading, setLoading] = useState(true);

  // Configure global axios defaults
  axios.defaults.baseURL = 'http://localhost:5000/api';
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    // If we have a token on load, we can decode it to get the user ID. 
    // In a production app, you might hit a /api/auth/me endpoint instead.
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, role: payload.role }); // Hydrate partial user object with role
        setupPushSubscription(); // Attempt push subscription if logged in
      } catch (err) {
        console.error('Invalid token found in storage.');
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // Set up axios interceptor for 401 responses (session expired)
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('jwt');
          delete axios.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const setupPushSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          
          let subscription = await registration.pushManager.getSubscription();
          if (!subscription) {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
            });
          }

          // Send subscription to backend
          await axios.post('/auth/subscribe', { subscription });
          console.log('Successfully subscribed to push notifications');
        }
      } catch (err) {
        console.error('Push subscription failed:', err);
      }
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    const { token, data } = res.data;
    setToken(token);
    setUser(data.user);
    localStorage.setItem('jwt', token);
  };

  const register = async (email, password) => {
    const res = await axios.post('/auth/register', { email, password });
    const { token, data } = res.data;
    setToken(token);
    setUser(data.user);
    localStorage.setItem('jwt', token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
