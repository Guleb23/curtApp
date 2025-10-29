import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({
        login: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        // Валидация логина
        if (!credentials.login.trim()) {
            newErrors.login = 'Логин обязателен для заполнения';
        } else if (credentials.login.length < 3) {
            newErrors.login = 'Логин должен содержать минимум 3 символа';
        }

        // Валидация пароля
        if (!credentials.password) {
            newErrors.password = 'Пароль обязателен для заполнения';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        const result = await login(credentials);

        if (!result.success) {
            setErrors({ submit: result.error });
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const getInputStyle = (fieldName) => ({
        width: '100%',
        padding: '12px',
        border: `1px solid ${errors[fieldName] ? '#e53e3e' : '#e2e8f0'}`,
        borderRadius: '6px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
        ':focus': {
            borderColor: errors[fieldName] ? '#e53e3e' : '#3182ce'
        }
    });

    return (
        <div style={{
            maxWidth: '400px',
            margin: '50px auto',
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '30px',
                color: '#2d3748'
            }}>
                Вход в систему
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Поле логина */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: '500',
                        color: '#4a5568'
                    }}>
                        Логин *
                    </label>
                    <input
                        type="text"
                        name="login"
                        placeholder="Введите ваш логин"
                        value={credentials.login}
                        onChange={handleChange}
                        style={getInputStyle('login')}
                        disabled={loading}
                    />
                    {errors.login && (
                        <div style={{
                            color: '#e53e3e',
                            fontSize: '14px',
                            marginTop: '5px'
                        }}>
                            {errors.login}
                        </div>
                    )}
                </div>

                {/* Поле пароля */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: '500',
                        color: '#4a5568'
                    }}>
                        Пароль *
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Введите ваш пароль"
                        value={credentials.password}
                        onChange={handleChange}
                        style={getInputStyle('password')}
                        disabled={loading}
                    />
                    {errors.password && (
                        <div style={{
                            color: '#e53e3e',
                            fontSize: '14px',
                            marginTop: '5px'
                        }}>
                            {errors.password}
                        </div>
                    )}
                </div>

                {/* Сообщения об ошибках */}
                {errors.submit && (
                    <div style={{
                        color: '#e53e3e',
                        backgroundColor: '#fed7d7',
                        padding: '10px',
                        borderRadius: '6px',
                        marginBottom: '15px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {errors.submit}
                    </div>
                )}

                {/* Кнопка отправки */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loading ? '#a0aec0' : '#3182ce',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        marginBottom: '20px'
                    }}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>

        </div>
    );
};

export default Login;