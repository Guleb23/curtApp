import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(credentials);

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        name="login"
                        placeholder="Login"
                        value={credentials.login}
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
                        value={credentials.password}
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
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;