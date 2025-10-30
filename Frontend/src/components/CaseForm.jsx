import React, { useState, useEffect } from 'react';
import api from '../services/authService';
import InstanceModal from './InstanceModal';
// Главный компонент модалки создания дела
const CaseForm = ({
    isOpen,
    onClose,
    onCaseCreated,
    editingCase = null,
    isEditing = false
}) => {
    const [formData, setFormData] = useState({
        nomerOfCase: '',
        nameOfCurt: '',
        applicant: '',
        defendant: '',
        reason: '',
        dateOfCurt: '',
        resultOfCurt: '',
        dateOfResult: ''
    });
    const [instances, setInstances] = useState([]);
    const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingInstance, setEditingInstance] = useState(null);
    const [isEditingInstance, setIsEditingInstance] = useState(false);

    // Заполняем форму данными при редактировании
    useEffect(() => {
        if (isEditing && editingCase) {
            setFormData({
                nomerOfCase: editingCase.nomerOfCase || '',
                nameOfCurt: editingCase.nameOfCurt || '',
                applicant: editingCase.applicant || '',
                defendant: editingCase.defendant || '',
                reason: editingCase.reason || '',
                dateOfCurt: editingCase.dateOfCurt
                    ? new Date(editingCase.dateOfCurt).toISOString().split('T')[0]
                    : '',
                resultOfCurt: editingCase.resultOfCurt || '',
                dateOfResult: editingCase.dateOfResult
                    ? new Date(editingCase.dateOfResult).toISOString().split('T')[0]
                    : ''
            });
            console.log(editingCase);

            // Загружаем инстанции дела
            setInstances(editingCase.curtInstances || []);
        } else {
            // Сбрасываем форму для создания нового дела
            setFormData({
                nomerOfCase: '',
                nameOfCurt: '',
                applicant: '',
                defendant: '',
                reason: '',
                dateOfCurt: '',
                resultOfCurt: '',
                dateOfResult: ''
            });
            setInstances([]);
        }
    }, [isEditing, editingCase, isOpen]);

    const handleClose = () => {
        setFormData({
            nomerOfCase: '',
            nameOfCurt: '',
            applicant: '',
            defendant: '',
            reason: '',
            dateOfCurt: '',
            resultOfCurt: '',
            dateOfResult: ''
        });
        setInstances([]);
        setMessage('');
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Добавление инстанции
    const handleInstanceAdded = (instanceData) => {
        setInstances([...instances, { ...instanceData, id: Date.now() }]);
    };

    // Удаление инстанции
    const handleRemoveInstance = (index) => {
        const newInstances = instances.filter((_, i) => i !== index);
        setInstances(newInstances);
    };

    // Обработчик редактирования инстанции
    const handleEditInstance = (instance, index) => {
        setEditingInstance({ ...instance, index });
        setIsEditingInstance(true);
        setIsInstanceModalOpen(true);
    };

    // Обработчик обновления инстанции
    const handleUpdateInstance = (instanceId, updatedData) => {
        const updatedInstances = instances.map(instance =>
            instance.id === instanceId ? { ...instance, ...updatedData } : instance
        );
        setInstances(updatedInstances);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const submitData = {
                ...formData,
                dateOfCurt: formData.dateOfCurt ? new Date(formData.dateOfCurt) : null,
                dateOfResult: formData.dateOfResult ? new Date(formData.dateOfResult) : null
            };

            if (isEditing && editingCase) {
                // Режим редактирования - отправляем PUT запрос
                const updateData = {
                    Case: submitData,
                    Instances: instances
                };

                await api.put(`/case/${editingCase.id}`, updateData);
                setMessage('✅ Дело успешно обновлено!');
            } else {
                // Режим создания - отправляем POST запрос
                const caseResponse = await api.post('/case/create', submitData);
                const caseId = caseResponse.data.id;

                // Создаем инстанции
                if (instances.length > 0) {
                    const instancePromises = instances.map(instance =>
                        api.post(`/CurtInstance/${caseId}`, instance)
                    );
                    await Promise.all(instancePromises);
                }
                setMessage('✅ Дело и инстанции успешно созданы!');
            }

            setTimeout(() => {
                handleClose();
                if (onCaseCreated) {
                    onCaseCreated();
                }
            }, 1500);

        } catch (error) {
            setMessage(`❌ Ошибка при ${isEditing ? 'обновлении' : 'создании'} дела`);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
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
                zIndex: 1000
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    width: '90%',
                    maxWidth: '700px',
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
                        <h2 style={{ margin: 0, color: '#333' }}>
                            {isEditing ? 'Редактировать дело' : 'Создать новое дело'}
                        </h2>
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

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* Основные поля дела */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Номер дела *
                                </label>
                                <input
                                    type="text"
                                    name="nomerOfCase"
                                    value={formData.nomerOfCase}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                    placeholder="А40-12345/2024"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Название суда *
                                </label>
                                <input
                                    type="text"
                                    name="nameOfCurt"
                                    value={formData.nameOfCurt}
                                    onChange={handleChange}
                                    required
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
                        </div>

                        {/* Стороны */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Истец *
                                </label>
                                <input
                                    type="text"
                                    name="applicant"
                                    value={formData.applicant}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                    placeholder="ООО 'Ромашка'"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Ответчик *
                                </label>
                                <input
                                    type="text"
                                    name="defendant"
                                    value={formData.defendant}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                    placeholder="ООО 'Василек'"
                                />
                            </div>
                        </div>

                        {/* Причина */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                Причина иска *
                            </label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    resize: 'vertical',
                                    fontSize: '14px'
                                }}
                                placeholder="Взыскание задолженности по договору..."
                            />
                        </div>

                        {/* Даты */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Дата заседания
                                </label>
                                <input
                                    type="date"
                                    name="dateOfCurt"
                                    value={formData.dateOfCurt}
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
                                    Дата решения
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

                        {/* Результат */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                Результат
                            </label>
                            <input
                                type="text"
                                name="resultOfCurt"
                                value={formData.resultOfCurt}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="Иск удовлетворен частично"
                            />
                        </div>

                        {/* Секция инстанций */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    Судебные инстанции
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsInstanceModalOpen(true)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    ＋ Добавить инстанцию
                                </button>
                            </div>

                            {instances.length > 0 ? (
                                <div style={{ border: '1px solid #eee', borderRadius: '4px', padding: '10px' }}>
                                    {instances.map((instance, index) => (
                                        <div key={instance.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px',
                                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                                            borderRadius: '4px'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <strong>{instance.name}</strong>
                                                {instance.dateOfSession && ` - ${new Date(instance.dateOfSession).toLocaleDateString()}`}
                                                {instance.resultOfIstance && ` (${instance.resultOfIstance})`}
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                {/* Кнопка редактирования */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditInstance(instance, index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#007bff',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    title="Редактировать"
                                                >
                                                    ✏️
                                                </button>
                                                {/* Кнопка удаления */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInstance(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#dc3545',
                                                        cursor: 'pointer',
                                                        fontSize: '16px',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px'
                                                    }}
                                                    title="Удалить"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    border: '1px dashed #ddd',
                                    borderRadius: '4px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#6c757d'
                                }}>
                                    Инстанции не добавлены
                                </div>
                            )}
                        </div>

                        {/* Сообщение */}
                        {message && (
                            <div style={{
                                padding: '10px',
                                borderRadius: '4px',
                                backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
                                color: message.includes('✅') ? '#155724' : '#721c24',
                                textAlign: 'center',
                                fontSize: '14px'
                            }}>
                                {message}
                            </div>
                        )}

                        {/* Кнопки */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button
                                type="button"
                                onClick={handleClose}
                                style={{
                                    padding: '10px 20px',
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
                                    padding: '10px 20px',
                                    backgroundColor: loading ? '#6c757d' : (isEditing ? '#ffc107' : '#007bff'),
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {loading ? 'Сохранение...' : (isEditing ? 'Обновить дело' : 'Создать дело')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <InstanceModal
                isOpen={isInstanceModalOpen}
                onClose={() => {
                    setIsInstanceModalOpen(false);
                    setIsEditingInstance(false);
                    setEditingInstance(null);
                }}
                onInstanceAdded={handleInstanceAdded}
                onInstanceUpdated={handleUpdateInstance}
                editingInstance={editingInstance}
                isEditing={isEditingInstance}
            />
        </>
    );
};

export default CaseForm;