import React, { useState, useEffect } from 'react';

// Компонент модалки для добавления/редактирования инстанции
const InstanceModal = ({
    isOpen,
    onClose,
    onInstanceAdded,
    onInstanceUpdated,
    editingInstance,
    isEditing = false
}) => {
    const [formData, setFormData] = useState({
        name: '',
        nameOfCurt: '',
        dateOfSession: '',
        link: '',
        employee: '',
        resultOfIstance: '',
        dateOfResult: ''
    });
    const [loading, setLoading] = useState(false);

    // Заполняем форму данными при редактировании
    useEffect(() => {
        if (isEditing && editingInstance) {
            setFormData({
                name: editingInstance.name || '',
                nameOfCurt: editingInstance.nameOfCurt || '',
                dateOfSession: editingInstance.dateOfSession
                    ? new Date(editingInstance.dateOfSession).toISOString().split('T')[0]
                    : '',
                link: editingInstance.link || '',
                employee: editingInstance.employee || '',
                resultOfIstance: editingInstance.resultOfIstance || '',
                dateOfResult: editingInstance.dateOfResult
                    ? new Date(editingInstance.dateOfResult).toISOString().split('T')[0]
                    : ''
            });
        } else {
            // Сбрасываем форму для создания нового
            setFormData({
                name: '',
                nameOfCurt: '',
                dateOfSession: '',
                link: '',
                employee: '',
                resultOfIstance: '',
                dateOfResult: ''
            });
        }
    }, [isEditing, editingInstance, isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const submitData = {
            ...formData,
            dateOfSession: formData.dateOfSession ? new Date(formData.dateOfSession) : null,
            dateOfResult: formData.dateOfResult ? new Date(formData.dateOfResult) : null
        };

        if (isEditing && editingInstance) {
            // Режим редактирования
            onInstanceUpdated(editingInstance.id, submitData);
        } else {
            // Режим добавления
            onInstanceAdded(submitData);
        }

        setLoading(false);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            nameOfCurt: '',
            dateOfSession: '',
            link: '',
            employee: '',
            resultOfIstance: '',
            dateOfResult: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
            }}>
                {/* Заголовок и кнопка закрытия */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '15px'
                }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                        {isEditing ? 'Редактировать инстанцию' : 'Добавить судебную инстанцию'}
                    </h3>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '0',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                            Тип
                        </label>
                        <select placeholder="Инстанция или верховный суд"
                            name='name'
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                            <option value="Инстанция">Выберите инстанцию</option>
                            <option value="Инстанция">Инстанция</option>
                            <option value="Верховный суд">Верховный суд</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                            Название суда
                        </label>
                        <input
                            type="text"
                            name="nameOfCurt"
                            value={formData.nameOfCurt}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                            placeholder="Арбитражный суд г. Москвы"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                Дата заседания
                            </label>
                            <input
                                type="date"
                                name="dateOfSession"
                                value={formData.dateOfSession}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                Дата результата
                            </label>
                            <input
                                type="date"
                                name="dateOfResult"
                                value={formData.dateOfResult}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                            Ссылка
                        </label>
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                            Судья/Сотрудник
                        </label>
                        <input
                            type="text"
                            name="employee"
                            value={formData.employee}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                            placeholder="Иванов И.И."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                            Результат
                        </label>
                        <input
                            type="text"
                            name="resultOfIstance"
                            value={formData.resultOfIstance}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                            placeholder="Рассмотрение отложено"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: loading ? '#6c757d' : (isEditing ? '#ffc107' : '#28a745'),
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {loading ? 'Сохранение...' : (isEditing ? 'Сохранить' : 'Добавить')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InstanceModal;