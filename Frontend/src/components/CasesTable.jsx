import React, { useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Calendar, FileText } from 'lucide-react';
import api from '../services/authService';
import StatusIcon from './StatusIcon';
import { getCaseStatus, getStatusStyles } from '../utils/getCaseStatus';

const CasesTable = ({ cases, loading, fetchUserCases, onEditCase }) => {
    const [selectedCase, setSelectedCase] = useState(null);

    const handleEditCase = (caseData) => {
        if (onEditCase) {
            onEditCase(caseData);
        }
    };

    const handleDeleteCase = async (caseId) => {
        if (!window.confirm('Вы уверены, что хотите удалить это дело?')) {
            return;
        }

        try {
            await api.delete(`/case/${caseId}`);
            fetchUserCases();
            alert('Дело успешно удалено');
        } catch (error) {
            console.error('Error deleting case:', error);
            alert('Ошибка при удалении дела');
        }
    };


    // Колонки таблицы с добавленными статусами
    const columns = useMemo(() => [
        {
            accessorKey: 'nomerOfCase',
            header: '№ дела',
            cell: info => {
                const status = getCaseStatus(info.row.original.dateOfResult, info.row.original.isMarkeredByAdmin, info.row.original.isUnMarkeredByAdmin);
                return (
                    <div style={{
                        fontWeight: '600',
                        color: '#1a365d',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {status && <StatusIcon status={status.status} />}
                        {info.getValue()}
                    </div>
                );
            },
            size: 200,
        },
        {
            accessorKey: 'nameOfCurt',
            header: 'Наименование суда',
            cell: info => info.getValue(),
            size: 200,
        },
        {
            accessorKey: 'applicant',
            header: 'Истец',
            cell: info => (
                <div style={{ fontSize: '12px', color: '#2d3748' }}>
                    {info.getValue()}
                </div>
            ),
            size: 200,
        },
        {
            accessorKey: 'defendant',
            header: 'Ответчик',
            cell: info => (
                <div style={{ fontSize: '12px', color: '#2d3748' }}>
                    {info.getValue()}
                </div>
            ),
            size: 200,
        },
        {
            accessorKey: 'reason',
            header: 'Предмет иска',
            cell: info => (
                <div style={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '12px',
                    color: '#2d3748'
                }}>
                    {info.getValue()}
                </div>
            ),
            size: 200,
        },
        {
            accessorKey: 'dateOfCurt',
            header: 'Судебное заседание',
            cell: info => {
                const date = info.getValue();
                return date ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} color="#4a5568" />
                        <span>{new Date(date).toLocaleDateString('ru-RU')}</span>
                    </div>
                ) : (
                    <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Не назначено</span>
                );
            },
            size: 180,
        },
        {
            accessorKey: 'resultOfCurt',
            header: 'Решение суда',
            cell: info => {
                const result = info.getValue();
                return result ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <FileText size={14} color="#4a5568" />
                        <span style={{ fontSize: '12px' }}>{result}</span>
                    </div>
                ) : (
                    <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Нет решения</span>
                );
            },
            size: 220,
        },
        {
            accessorKey: 'dateOfResult',
            header: 'Дата решения',
            cell: info => {
                const dateOfResult = info.getValue();
                const status = getCaseStatus(info.row.original.dateOfResult, info.row.original.isMarkeredByAdmin, info.row.original.isUnMarkeredByAdmin);

                return dateOfResult ? (
                    <div>
                        <div style={{
                            fontSize: '12px',
                            color: status ? '#2d3748' : '#718096',
                            fontWeight: status ? '600' : 'normal'
                        }}>
                            {new Date(dateOfResult).toLocaleDateString('ru-RU')}
                        </div>
                        {status && (
                            <div style={{
                                fontSize: '10px',
                                color: status.status === 'critical' ? '#e53e3e' :
                                    status.status === 'warning' ? '#dd6b20' : '#3182ce',
                                marginTop: '2px'
                            }}>
                                {status.message}
                            </div>
                        )}
                    </div>
                ) : (
                    <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Нет даты</span>
                );
            },
            size: 150,
        },
        {
            id: 'actions',
            header: 'Действия',
            cell: info => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditCase(info.row.original.id);
                        }}
                        style={{
                            padding: '4px 8px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                        title="Редактировать дело"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCase(info.row.original.id);
                        }}
                        style={{
                            padding: '4px 8px',
                            backgroundColor: '#e53e3e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        🗑️
                    </button>
                </div>
            ),
            size: 120,
        }
    ], []);

    const table = useReactTable({
        data: cases,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#4a5568'
            }}>
                Загрузка дел...
            </div>
        );
    }

    if (cases.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#718096',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                margin: '20px 0'
            }}>
                <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>Дела не найдены</div>
                <div>Создайте первое дело, чтобы увидеть его здесь</div>
            </div>
        );
    }

    return (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* Легенда статусов */}
            <div style={{
                padding: '12px 16px',
                backgroundColor: '#f7fafc',
                borderBottom: '1px solid #e2e8f0',
                fontSize: '12px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
            }}>
                <strong>Легенда:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#bee3f8', border: '1px solid #3182ce' }}></div>
                    <span>20-25 дней</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#feebc8', border: '1px solid #dd6b20' }}></div>
                    <span>26-30 дней</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#fed7d7', border: '1px solid #e53e3e' }}></div>
                    <span>Более 30 дней</span>
                </div>
            </div>

            {/* Таблица */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} style={{
                                backgroundColor: '#f7fafc',
                                borderBottom: '1px solid #e2e8f0'
                            }}>
                                {headerGroup.headers.map(header => {
                                    // Пропускаем отрисовку групповых заголовков для обычных колонок
                                    if (header.depth > 0 && !header.column.columnDef.header) {
                                        return null;
                                    }
                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                padding: '12px 16px',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                fontSize: '12px',
                                                textTransform: 'uppercase',
                                                color: '#4a5568',
                                                letterSpacing: '0.05em',
                                                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                                userSelect: 'none',
                                                width: header.getSize(),
                                                border: '1px solid #e2e8f0',
                                                borderBottom: '1px solid #e2e8f0'
                                            }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <ChevronUp
                                                            size={12}
                                                            color={header.column.getIsSorted() === 'asc' ? '#2d3748' : '#cbd5e0'}
                                                        />
                                                        <ChevronDown
                                                            size={12}
                                                            color={header.column.getIsSorted() === 'desc' ? '#2d3748' : '#cbd5e0'}
                                                            style={{ marginTop: '-4px' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => {
                            const status = getCaseStatus(row.original.dateOfResult, row.original.isMarkeredByAdmin, row.original.isUnMarkeredByAdmin);
                            const rowStyles = status ? getStatusStyles(status.status) : {};

                            return (
                                <tr
                                    key={row.id}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        ...rowStyles
                                    }}
                                    onMouseEnter={e => {
                                        if (status) {
                                            e.currentTarget.style.filter = 'brightness(0.95)';
                                        } else {
                                            e.currentTarget.style.backgroundColor = '#f8fafc';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (status) {
                                            e.currentTarget.style.filter = 'brightness(1)';
                                        } else {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                    onClick={() => setSelectedCase(row.original)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            style={{
                                                padding: '16px',
                                                fontSize: '14px',
                                                color: '#2d3748',
                                                borderBottom: '1px solid #f1f5f9'
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Пагинация */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#f7fafc',
                borderTop: '1px solid #e2e8f0'
            }}>
                <div style={{ fontSize: '14px', color: '#4a5568' }}>
                    Показано {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        cases.length
                    )} из {cases.length} дел
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        style={{
                            padding: '6px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                            opacity: table.getCanPreviousPage() ? 1 : 0.5
                        }}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <span style={{ fontSize: '14px', color: '#4a5568' }}>
                        Страница {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
                    </span>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        style={{
                            padding: '6px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                            opacity: table.getCanNextPage() ? 1 : 0.5
                        }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CasesTable;