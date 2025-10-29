import React, { useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { getCaseStatus, getStatusStyles } from '../utils/getCaseStatus';
import StatusIcon from './StatusIcon';

const AdminTable = ({ cases, loading, onDetailInfo }) => {
    const [detailLoading, setDetailLoading] = useState(false);

    const handleGetCase = (caseData) => {
        if (onDetailInfo) {
            onDetailInfo(caseData);
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'nomerOfCase',
            header: '№ дела',
            cell: info => {
                const status = getCaseStatus(info.row.original.dateOfResult);
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
            size: 150,
        },
        {
            accessorKey: 'nameOfCurt',
            header: 'Наименование суда',
            cell: info => info.getValue(),
            size: 200,
        },
        {
            id: 'parties',
            header: 'Стороны по делу',
            cell: info => (
                <div>
                    <div style={{ fontSize: '12px', color: '#2d3748' }}>
                        <strong>Истец:</strong> {info.row.original.applicant}
                    </div>
                    <div style={{ fontSize: '12px', color: '#2d3748' }}>
                        <strong>Ответчик:</strong> {info.row.original.defendant}
                    </div>
                </div>
            ),
            size: 250,
        },
        {
            accessorKey: 'reason',
            header: 'Предмет иска',
            cell: info => (
                <div style={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
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
                const dateOfResult = info.row.original.dateOfResult;
                const status = getCaseStatus(dateOfResult);

                return result ? (
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginBottom: '2px'
                        }}>
                            <FileText size={14} color="#4a5568" />
                            <span style={{ fontSize: '12px' }}>{result}</span>
                        </div>
                        {dateOfResult && (
                            <div style={{
                                fontSize: '11px',
                                color: status ? '#2d3748' : '#718096',
                                fontWeight: status ? '600' : 'normal'
                            }}>
                                {new Date(dateOfResult).toLocaleDateString('ru-RU')}
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
                        )}
                    </div>
                ) : (
                    <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Нет решения</span>
                );
            },
            size: 220,
        },
        {
            id: 'instances',
            header: 'Заседания',
            cell: info => {
                const instances = info.row.original.curtInstances || [];
                return (
                    <div style={{ textAlign: 'center' }}>
                        <span style={{
                            backgroundColor: instances.length > 0 ? '#e6fffa' : '#fed7d7',
                            color: instances.length > 0 ? '#234e52' : '#742a2a',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                        }}>
                            {instances.length}
                        </span>
                    </div>
                );
            },
            size: 100,
        },
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
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>Пока нету дел</div>
            </div>
        );
    }

    return (
        <>
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {/* Индикатор загрузки */}
                {detailLoading && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '6px',
                        zIndex: 1001,
                        fontSize: '14px'
                    }}>
                        Загрузка деталей дела...
                    </div>
                )}

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
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
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
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => {
                                const status = getCaseStatus(row.original.dateOfResult);
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
                                        onClick={() => handleGetCase(row.original)}
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
        </>
    );
};

export default AdminTable;

