import axios from 'axios';

const API_URL = 'http://localhost:7080/api/auth';

const api = axios.create({
    baseURL: 'http://localhost:7080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Выносим функции работы с токенами отдельно чтобы избежать циклических зависимостей
const tokenUtils = {
    // Получение данных пользователя из JWT токена
    getUserDataFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                userId: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                login: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
            };
        } catch (error) {
            console.error('Error parsing token:', error);
            return {};
        }
    },

    // Сохранение данных аутентификации
    saveAuthData(tokens) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);

        const userData = this.getUserDataFromToken(tokens.accessToken);
        if (userData.userId) {
            localStorage.setItem('userId', userData.userId);
        }
        if (userData.role) {
            localStorage.setItem('userRole', userData.role);
        }
    },

    // Очистка данных аутентификации
    clearAuthData() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    },

    // Проверка авторизации
    isAuthenticated() {
        const token = localStorage.getItem('accessToken');
        if (!token) return false;

        // Дополнительная проверка срока действия токена
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // конвертируем в миллисекунды
            return Date.now() < exp;
        } catch {
            return false;
        }
    }
};

// Интерцептор для автоматической подстановки токена
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Интерцептор для обработки 401 ошибки и refresh токена
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');

            if (refreshToken && userId) {
                try {
                    const response = await axios.post(`${API_URL}/refresh`, {
                        userId: userId,
                        refreshToken: refreshToken
                    });

                    const tokens = response.data;
                    tokenUtils.saveAuthData(tokens);

                    // Обновляем заголовок и повторяем запрос
                    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Если refresh не удался, полностью разлогиниваем
                    tokenUtils.clearAuthData();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // Нет refresh токена - разлогиниваем
                tokenUtils.clearAuthData();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {
    // Регистрация
    async register(userData) {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    // Логин
    async login(credentials) {
        const response = await axios.post(`${API_URL}/login`, credentials);

        if (response.data) {
            tokenUtils.saveAuthData(response.data);
        }

        return response.data;
    },

    // Logout
    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');

            if (refreshToken && userId) {
                await axios.post(`${API_URL}/logout`, {
                    userId: userId,
                    refreshToken: refreshToken
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            tokenUtils.clearAuthData();
        }
    },

    // Получение данных пользователя из JWT токена
    getUserDataFromToken: tokenUtils.getUserDataFromToken,

    // Очистка данных аутентификации
    clearAuthData: tokenUtils.clearAuthData,

    // Проверка авторизации
    isAuthenticated: tokenUtils.isAuthenticated,

    // Получение роли пользователя
    getUserRole() {
        // Всегда берем актуальную роль из токена, а не из localStorage
        const token = localStorage.getItem('accessToken');
        if (token) {
            const userData = this.getUserDataFromToken(token);
            return userData.role || localStorage.getItem('userRole');
        }
        return null;
    },

    // Проверка роли
    hasRole(role) {
        const userRole = this.getUserRole();
        return userRole === role;
    },

    // Проверка нескольких ролей
    hasAnyRole(roles) {
        const userRole = this.getUserRole();
        return roles.includes(userRole);
    },

    // Проверка является ли админом
    isAdmin() {
        return this.hasRole('Admin') || this.hasRole('Administrator'); // Добавляем варианты
    },

    // Проверка является ли пользователем
    isUser() {
        return this.hasRole('User') || this.hasRole('Client'); // Добавляем варианты
    },

    // Получение данных текущего пользователя
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;

        const token = localStorage.getItem('accessToken');
        const userData = this.getUserDataFromToken(token);

        return {
            userId: localStorage.getItem('userId'),
            role: this.getUserRole(), // Используем метод чтобы получить актуальную роль
            login: userData.login,
            ...userData
        };
    },

    // Обновление токенов (для внешнего использования)
    async refreshTokens() {
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');

        if (!refreshToken || !userId) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/refresh`, {
            userId: userId,
            refreshToken: refreshToken
        });

        tokenUtils.saveAuthData(response.data);
        return response.data;
    }
};

export default api;