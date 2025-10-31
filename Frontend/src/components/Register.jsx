import React, { use, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [userData, setUserData] = useState({
        login: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        // Валидация логина
        if (!userData.login.trim()) {
            newErrors.login = 'Логин обязателен для заполнения';
        } else if (userData.login.length < 3) {
            newErrors.login = 'Логин должен содержать минимум 3 символа';
        } else if (userData.login.length > 20) {
            newErrors.login = 'Логин не должен превышать 20 символов';
        }

        // Валидация пароля
        if (!userData.password) {
            newErrors.password = 'Пароль обязателен для заполнения';
        } else if (userData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(userData.password)) {
            newErrors.password = 'Пароль должен содержать буквы и цифры';
        }

        // Валидация подтверждения пароля
        if (userData.password !== userData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
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
        setSuccess(false);

        const result = await register({
            login: userData.login,
            password: userData.password,
            email: userData.email
        });

        if (result.success) {
            setSuccess(true);
            setUserData({
                login: '',
                password: '',
                confirmPassword: ''
            });
        } else {
            setErrors({ submit: result.error });
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
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
        padding: '10px',
        border: `1px solid ${errors[fieldName] ? '#e53e3e' : '#e2e8f0'}`,
        borderRadius: '6px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s'
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
                Регистрация
            </h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: '500',
                        color: '#4a5568'
                    }}>
                        Email *
                    </label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Введите вашу почту"
                        value={userData.email}
                        onChange={handleChange}
                        style={getInputStyle('login')}
                        disabled={loading}
                    />
                </div>
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
                        value={userData.login}
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
                <div style={{ marginBottom: '20px' }}>
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
                        placeholder="Введите пароль"
                        value={userData.password}
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

                {/* Подтверждение пароля */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: '500',
                        color: '#4a5568'
                    }}>
                        Подтверждение пароля *
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Повторите пароль"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        style={getInputStyle('confirmPassword')}
                        disabled={loading}
                    />
                    {errors.confirmPassword && (
                        <div style={{
                            color: '#e53e3e',
                            fontSize: '14px',
                            marginTop: '5px'
                        }}>
                            {errors.confirmPassword}
                        </div>
                    )}
                </div>

                {/* Сообщения об ошибках и успехе */}
                {errors.submit && (
                    <div style={{
                        color: '#e53e3e',
                        backgroundColor: '#fed7d7',
                        padding: '10px',
                        borderRadius: '6px',
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        {errors.submit}
                    </div>
                )}

                {success && (
                    <div style={{
                        color: '#276749',
                        backgroundColor: '#c6f6d5',
                        padding: '10px',
                        borderRadius: '6px',
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        Регистрация успешно завершена! Теперь вы можете войти в систему.
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
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>

            {/* Подсказки по паролю */}
            <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#edf2f7',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#4a5568'
            }}>
                <strong>Требования к паролю:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>Минимум 6 символов</li>
                    <li>Должен содержать буквы и цифры</li>
                </ul>
            </div>
        </div>
    );
};

export default Register;