import React, { useEffect, useState } from "react";
import api from "../services/authService";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArchivePage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchArchive = async () => {
        try {
            setLoading(true);
            const res = await api.get("/case/all-arhcive");
            setCases(res.data);
        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки архива");
        } finally {
            setLoading(false);
        }
    };

    const unArchiveCase = async (id) => {
        if (!window.confirm("Разархивировать дело?")) return;

        try {
            await api.patch(`/case/unarchive/${id}`);
            setCases(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Ошибка разархивирования");
        }
    };

    useEffect(() => {
        fetchArchive();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 p-6 bg-white rounded-lg shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Архив дел
                    </h1>
                    <p className="text-sm text-gray-500">
                        Здесь хранятся все архивированные дела
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
                    >
                        <ArrowLeft size={16} />
                        Назад
                    </button>

                    <button
                        onClick={fetchArchive}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Обновить
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="p-3 border-b">№ Дела</th>
                            <th className="p-3 border-b">Суд</th>
                            <th className="p-3 border-b">Истец</th>
                            <th className="p-3 border-b">Ответчик</th>
                            <th className="p-3 border-b">Дата решения</th>
                            <th className="p-3 border-b text-center">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b">{c.nomerOfCase}</td>
                                <td className="p-3 border-b">{c.nameOfCurt}</td>
                                <td className="p-3 border-b">{c.applicant}</td>
                                <td className="p-3 border-b">{c.defendant}</td>
                                <td className="p-3 border-b">
                                    {c.dateOfResult
                                        ? new Date(c.dateOfResult).toLocaleDateString("ru-RU")
                                        : "—"}
                                </td>
                                <td className="p-3 border-b text-center">
                                    <button
                                        onClick={() => unArchiveCase(c.id)}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                                    >
                                        Разархивировать
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {cases.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                        Архив пуст
                    </p>
                )}
            </div>
        </div>
    );
};

export default ArchivePage;
