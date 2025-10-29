import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/authService';
import CaseForm from './CaseForm';
import CasesTable from './CasesTable';
import { Plus, RefreshCw, LogOut, Search, AlertTriangle } from 'lucide-react';
import AdminTable from './AdminTable';
import InfoAboutCase from './InfoAboutCase';

const Dashboard = () => {
    const { user, logout, isUser, isAdmin } = useAuth();
    const [cases, setCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState(null);
    const [detailCase, setDetailCase] = useState(null);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expiredCases, setExpiredCases] = useState([]);

    // Функция для проверки просроченных дел
    const checkExpiredCases = useCallback((casesData) => {
        const now = new Date();
        const expired = casesData.filter(caseItem => {
            if (!caseItem.dateOfResult) return false;

            const resultDate = new Date(caseItem.dateOfResult);
            const daysDiff = Math.floor((now - resultDate) / (1000 * 60 * 60 * 24));

            return daysDiff > 20;
        });

        setExpiredCases(expired);
    }, []);

    const handleSearch = useCallback((term) => {
        if (!term.trim()) {
            setFilteredCases(cases);
            return;
        }

        const lowercasedTerm = term.toLowerCase();
        const filtered = cases.filter(caseItem => {
            // Форматируем дату в формат DD.MM.YYYY для поиска
            const formattedDate = caseItem.dateOfCurt
                ? new Date(caseItem.dateOfCurt).toLocaleDateString('ru-RU')
                : '';

            return (
                // Поиск по стороне дела (applicant)
                (caseItem.applicant && caseItem.applicant.toLowerCase().includes(lowercasedTerm)) ||
                // Поиск по ответчику (defendant)
                (caseItem.defendant && caseItem.defendant.toLowerCase().includes(lowercasedTerm)) ||
                // Поиск по отформатированной дате заседания
                (formattedDate && formattedDate.includes(term)) ||
                // Поиск по номеру дела
                (caseItem.nomerOfCase && caseItem.nomerOfCase.toLowerCase().includes(lowercasedTerm)) ||
                // Поиск по названию суда
                (caseItem.nameOfCurt && caseItem.nameOfCurt.toLowerCase().includes(lowercasedTerm))
            );
        });

        setFilteredCases(filtered);
    }, [cases]);

    // Обработчик изменения поискового запроса
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    // Обработчик очистки поиска
    const handleClearSearch = () => {
        setSearchTerm('');
        setFilteredCases(cases);
    };

    // Объединяем функции загрузки случаев
    const fetchCases = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = isAdmin ? '/case/allcases' : '/case/usercases';
            console.log('Fetching from endpoint:', endpoint);
            const response = await api.get(endpoint);
            const casesData = response.data;
            setCases(casesData);
            setFilteredCases(casesData);
            checkExpiredCases(casesData);
        } catch (error) {
            console.error('Error fetching cases:', error);
            alert('Ошибка при загрузке дел');
        } finally {
            setLoading(false);
        }
    }, [isAdmin, checkExpiredCases]);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    // Обновляем отфильтрованные данные при изменении исходных данных
    useEffect(() => {
        setFilteredCases(cases);
        checkExpiredCases(cases);
    }, [cases, checkExpiredCases]);

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
                    cases={filteredCases}
                    loading={loading}
                    onRefresh={fetchCases}
                    onDetailInfo={handleDetail}
                    expiredCases={expiredCases}
                />
            );
        } else if (isUser) {
            return (
                <CasesTable
                    cases={filteredCases}
                    loading={loading}
                    onRefresh={fetchCases}
                    onEditCase={handleDetailOrEditCase}
                    fetchUserCases={fetchCases}
                    expiredCases={expiredCases}
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

            {/* Уведомление о просроченных делах */}
            {expiredCases.length > 0 && (
                <div style={styles.alertContainer}>
                    <div style={styles.alertHeader}>
                        <AlertTriangle size={20} style={styles.alertIcon} />
                        <span style={styles.alertTitle}>
                            Внимание: Просроченные дела
                        </span>
                    </div>
                    <div style={styles.alertContent}>
                        <p>Обнаружено {expiredCases.length} дел, где прошло более 20 дней с момента решения:</p>
                        <ul style={styles.alertList}>
                            {expiredCases.slice(0, 5).map((caseItem, index) => (
                                <li key={caseItem.id} style={styles.alertListItem}>
                                    <strong>Дело №{caseItem.nomerOfCase}</strong> - {caseItem.applicant} vs {caseItem.defendant}
                                    {caseItem.dateOfResult && (
                                        <span style={styles.alertDate}>
                                            (Решение: {new Date(caseItem.dateOfResult).toLocaleDateString('ru-RU')})
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {expiredCases.length > 5 && (
                            <p style={styles.alertMore}>
                                ... и еще {expiredCases.length - 5} дел
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Панель поиска */}
            <div style={styles.searchContainer}>
                <div style={styles.searchInputContainer}>
                    <Search size={20} style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Поиск по делам: сторона, истец, ответчик, дата заседания..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClearSearch}
                            style={styles.clearButton}
                        >
                            ×
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div style={styles.searchInfo}>
                        Найдено дел: {filteredCases.length}
                        {filteredCases.length !== cases.length && ` из ${cases.length}`}
                    </div>
                )}
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
    },
    searchContainer: {
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    searchInputContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '600px'
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        color: '#718096'
    },
    searchInput: {
        width: '100%',
        padding: '12px 40px 12px 40px',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
        paddingLeft: '40px',
        paddingRight: '40px'
    },
    clearButton: {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        fontSize: '18px',
        color: '#718096',
        cursor: 'pointer',
        padding: '0',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchInfo: {
        marginTop: '8px',
        fontSize: '12px',
        color: '#718096'
    },
    // Стили для уведомления
    alertContainer: {
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#fffaf0',
        border: '1px solid #fbd38d',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    alertHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    },
    alertIcon: {
        color: '#dd6b20',
        marginRight: '8px'
    },
    alertTitle: {
        fontWeight: '600',
        color: '#dd6b20',
        fontSize: '16px'
    },
    alertContent: {
        color: '#744210',
        fontSize: '14px'
    },
    alertList: {
        margin: '8px 0',
        paddingLeft: '20px'
    },
    alertListItem: {
        marginBottom: '4px',
        lineHeight: '1.4'
    },
    alertDate: {
        color: '#975a16',
        fontSize: '12px',
        marginLeft: '8px'
    },
    alertMore: {
        marginTop: '8px',
        fontStyle: 'italic',
        color: '#975a16'
    }
};

export default Dashboard;