import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/authService';
import CaseForm from './CaseForm';
import CasesTable from './CasesTable';
import { Plus, RefreshCw, LogOut } from 'lucide-react';
import AdminTable from './AdminTable';
import InfoAboutCase from './InfoAboutCase';

const Dashboard = () => {
    const { user, logout, isUser, isAdmin } = useAuth();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState(null);

    const [detailCase, setDetailCase] = useState(null);

    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    // Объединяем функции загрузки случаев
    const fetchCases = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = isAdmin ? '/case/allcases' : '/case/usercases';
            console.log('Fetching from endpoint:', endpoint);
            const response = await api.get(endpoint);
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching cases:', error);
            alert('Ошибка при загрузке дел');
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    const handleLogout = async () => {
        await logout();
    };
    // Обработчик создания/обновления дела
    const handleCaseCreated = () => {
        fetchCases();
        handleCloseModal();
    };

    const handleDetailOrEditCase = async (caseId) => {
        try {
            const response = await api.get(`/case/detailusercases/${caseId}`);
            const caseData = response.data;
            setEditingCase(caseData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error loading case:', error);
            alert('Ошибка при загрузке дела');
        }
    };
    const handleDetail = async (c) => {
        const caseId = c.id;
        console.log(caseId);
        try {
            const response = await api.get(`/case/detailusercases/${caseId}`);
            const caseData = response.data;
            console.log(response.data);

            setDetailCase(caseData);
            setIsAdminModalOpen(true);
        } catch (error) {
            console.error('Error loading case:', error);
            alert('Ошибка при загрузке дела');
        }

    };



    // Обработчик закрытия модалки
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCase(null);
    };

    const handleCloseAdmin = () => {
        setIsAdminModalOpen(false);
    };
    // Открытие модалки для создания нового дела
    const handleNewCase = () => {
        setEditingCase(null);
        setIsModalOpen(true);
    };

    const isEditing = !!editingCase;

    // Определяем какой компонент показывать
    const renderContent = () => {
        if (isAdmin) {
            return (
                <AdminTable
                    cases={cases}
                    loading={loading}
                    onRefresh={fetchCases}
                    onDetailInfo={handleDetail}
                />
            );
        } else if (isUser) {
            return (
                <CasesTable
                    cases={cases}
                    loading={loading}
                    onRefresh={fetchCases}
                    onEditCase={handleDetailOrEditCase}
                    fetchUserCases={fetchCases}
                />
            );
        } else {
            return (
                <div style={styles.errorContainer}>
                    <h3>Неизвестная роль пользователя</h3>
                    <p>Роль: {user?.role || 'не определена'}</p>
                </div>
            );
        }
    };

    return (
        <div style={styles.container}>

            {/* Хедер */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Судебные дела</h1>
                    <p style={styles.subtitle}>
                        Управление вашими судебными делами и заседаниями
                    </p>
                </div>

                <div style={styles.actions}>
                    <button
                        onClick={fetchCases}
                        disabled={loading}
                        style={styles.buttonSecondary}
                    >
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                        Обновить
                    </button>

                    {isUser && (
                        <button
                            onClick={handleNewCase}
                            style={styles.buttonPrimary}
                        >
                            <Plus size={16} />
                            Новое дело
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        style={styles.buttonDanger}
                    >
                        <LogOut size={16} />
                        Выйти
                    </button>
                </div>
            </div>

            {/* Основной контент */}
            {renderContent()}

            {/* Модалка создания/редактирования дела */}
            {isUser && (
                <CaseForm
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onCaseCreated={handleCaseCreated}
                    editingCase={editingCase}
                    isEditing={isEditing}
                />
            )}
            {isAdmin && (
                <InfoAboutCase
                    isOpen={isAdminModalOpen}
                    onClose={handleCloseAdmin}
                    caseData={detailCase}

                />
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

// Выносим стили в отдельный объект для лучшей читаемости
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f7fafc',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    debugInfo: {
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    title: {
        margin: 0,
        color: '#1a202c',
        fontSize: '24px',
        fontWeight: '700'
    },
    subtitle: {
        margin: '4px 0 0 0',
        color: '#718096',
        fontSize: '14px'
    },
    actions: {
        display: 'flex',
        gap: '12px'
    },
    buttonSecondary: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        backgroundColor: '#edf2f7',
        color: '#4a5568',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    buttonPrimary: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    buttonDanger: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
    },
    errorContainer: {
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#e53e3e'
    }
};

export default Dashboard;