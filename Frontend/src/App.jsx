import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = React.useState('login');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div>
      <nav style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <button
          onClick={() => setCurrentView('login')}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Войти
        </button>
        <button
          onClick={() => setCurrentView('register')}
          style={{ padding: '8px 16px' }}
        >
          Регистрация
        </button>
      </nav>

      {currentView === 'login' ? <Login /> : <Register />}
    </div>
  );
}

export default App;