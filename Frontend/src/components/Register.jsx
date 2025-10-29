import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [userData, setUserData] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const result = await register(userData);

        if (result.success) {
            setSuccess(true);
            setUserData({ login: '', password: '' });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        name="login"
                        placeholder="Login"
                        value={userData.login}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {error && (
                    <div style={{ color: 'red', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ color: 'green', marginBottom: '15px' }}>
                        Registration successful! You can now login.
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none' }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;