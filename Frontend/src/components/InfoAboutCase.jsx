import React from 'react';
import { X, Calendar, FileText, User, Building, Link as LinkIcon, Clock, Award } from 'lucide-react';

const InfoAboutCase = ({ isOpen, onClose, caseData }) => {
    // Если модалка закрыта или нет данных, не рендерим
    if (!isOpen || !caseData) return null;

    console.log('Case data in modal:', caseData);

    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString || dateString === '1111-11-11T00:00:00Z') {
            return 'Не указана';
        }
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                {/* Хедер модалки */}
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.title}>
                        <FileText size={20} style={{ marginRight: '8px' }} />
                        Дело № {caseData.nomerOfCase}
                    </h2>
                    <button
                        onClick={onClose}
                        style={modalStyles.closeButton}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Контент модалки */}
                <div style={modalStyles.content}>
                    {/* Основная информация */}
                    <div style={modalStyles.section}>
                        <h3 style={modalStyles.sectionTitle}>
                            <Building size={16} style={{ marginRight: '8px' }} />
                            Основная информация
                        </h3>
                        <div style={modalStyles.infoGrid}>
                            <div style={modalStyles.infoItem}>
                                <strong>Суд:</strong> {caseData.nameOfCurt}
                            </div>
                            <div style={modalStyles.infoItem}>
                                <strong>Номер дела:</strong> {caseData.nomerOfCase}
                            </div>

                        </div>
                    </div>

                    {/* Стороны по делу */}
                    <div style={modalStyles.section}>
                        <h3 style={modalStyles.sectionTitle}>
                            <User size={16} style={{ marginRight: '8px' }} />
                            Стороны по делу
                        </h3>
                        <div style={modalStyles.infoGrid}>
                            <div style={modalStyles.infoItem}>
                                <strong>Истец:</strong> {caseData.applicant}
                            </div>
                            <div style={modalStyles.infoItem}>
                                <strong>Ответчик:</strong> {caseData.defendant}
                            </div>
                            <div style={modalStyles.infoItem}>
                                <strong>Предмет иска:</strong> {caseData.reason}
                            </div>
                        </div>
                    </div>

                    {/* Судебное заседание */}
                    <div style={modalStyles.section}>
                        <h3 style={modalStyles.sectionTitle}>
                            <Calendar size={16} style={{ marginRight: '8px' }} />
                            Судебное заседание
                        </h3>
                        <div style={modalStyles.infoGrid}>
                            <div style={modalStyles.infoItem}>
                                <strong>Дата заседания:</strong> {formatDate(caseData.dateOfCurt)}
                            </div>
                            {caseData.resultOfCurt && (
                                <div style={modalStyles.infoItem}>
                                    <Award size={14} style={{ marginRight: '4px' }} />
                                    <strong>Решение суда:</strong> {caseData.resultOfCurt}
                                </div>
                            )}
                            <div style={modalStyles.infoItem}>
                                <strong>Дата решения:</strong> {formatDate(caseData.dateOfResult)}
                            </div>
                        </div>
                    </div>

                    {/* Инстанции заседаний */}
                    {caseData.curtInstances && caseData.curtInstances.length > 0 && (
                        <div style={modalStyles.section}>
                            <h3 style={modalStyles.sectionTitle}>
                                <Clock size={16} style={{ marginRight: '8px' }} />
                                Инстанции ({caseData.curtInstances.length})
                            </h3>
                            <div style={modalStyles.instancesList}>
                                {caseData.curtInstances.map((instance, index) => (
                                    <div key={instance.id} style={modalStyles.instanceItem}>
                                        <div style={modalStyles.instanceHeader}>
                                            <span style={modalStyles.instanceNumber}>
                                                {instance.name == "Верховный суд" ? "" : index + 1} {instance.name}
                                            </span>
                                        </div>
                                        <div style={modalStyles.instanceDetails}>
                                            {instance.nameOfCurt && (
                                                <div style={modalStyles.instanceField}>
                                                    <strong>Суд:</strong> {instance.nameOfCurt}
                                                </div>
                                            )}
                                            {instance.employee && (
                                                <div style={modalStyles.instanceField}>
                                                    <strong>Сотрудник:</strong> {instance.employee}
                                                </div>
                                            )}
                                            {instance.dateOfSession && (
                                                <div style={modalStyles.instanceField}>
                                                    <strong>Дата заседания:</strong> {formatDate(instance.dateOfSession)}
                                                </div>
                                            )}
                                            {instance.resultOfIstance && (
                                                <div style={modalStyles.instanceField}>
                                                    <strong>Результат:</strong> {instance.resultOfIstance}
                                                </div>
                                            )}
                                            {instance.dateOfResult && (
                                                <div style={modalStyles.instanceField}>
                                                    <strong>Дата результата:</strong> {formatDate(instance.dateOfResult)}
                                                </div>
                                            )}
                                            {instance.link && (
                                                <div style={modalStyles.instanceField}>
                                                    <LinkIcon size={12} style={{ marginRight: '4px' }} />
                                                    <strong>Ссылка:</strong>
                                                    <a
                                                        href={instance.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#3182ce', marginLeft: '4px' }}
                                                    >
                                                        перейти
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Если нет инстанций */}
                    {(!caseData.curtInstances || caseData.curtInstances.length === 0) && (
                        <div style={modalStyles.placeholder}>
                            <Clock size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                            <p>Заседаний по данному делу пока не было</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Стили для модального окна
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f7fafc',
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a202c',
        display: 'flex',
        alignItems: 'center',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '4px',
        color: '#718096',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: '20px',
        maxHeight: 'calc(80vh - 80px)',
        overflowY: 'auto',
    },
    section: {
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f1f5f9',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 12px 0',
        color: '#2d3748',
        display: 'flex',
        alignItems: 'center',
    },
    infoGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    infoItem: {
        padding: '8px 12px',
        fontSize: '14px',
        color: '#4a5568',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
    },
    instancesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    instanceItem: {
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        overflow: 'hidden',
    },
    instanceHeader: {
        padding: '12px',
        backgroundColor: '#f7fafc',
        borderBottom: '1px solid #e2e8f0',
    },
    instanceNumber: {
        fontWeight: '600',
        color: '#2d3748',
        fontSize: '14px',
    },
    instanceDetails: {
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    instanceField: {
        fontSize: '13px',
        color: '#4a5568',
        display: 'flex',
        alignItems: 'center',
    },
    placeholder: {
        padding: '20px',
        backgroundColor: '#f7fafc',
        borderRadius: '6px',
        textAlign: 'center',
        color: '#718096',
        fontSize: '14px',
        border: '2px dashed #e2e8f0',
    },
};

export default InfoAboutCase;