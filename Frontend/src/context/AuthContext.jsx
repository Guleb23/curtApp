import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        if (authService.isAuthenticated()) {
            const userData = authService.getCurrentUser();
            setUser(userData);
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            const userData = authService.getCurrentUser();
            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            await authService.register(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: authService.isAuthenticated(),
        isAdmin: authService.isAdmin(),
        isUser: authService.isUser(),
        hasRole: (role) => authService.hasRole(role),
        hasAnyRole: (roles) => authService.hasAnyRole(roles),
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
