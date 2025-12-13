import React from "react";
import { Mail, Lock, User, UserCircle } from "lucide-react";

const CreateUserModal = ({
    isOpen,
    loading,
    formData,
    errors,
    onClose,
    onSubmit,
    onReset,
    onChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 animate-scaleIn">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Создание нового пользователя
                    </h3>
                    <button
                        className="text-gray-500 hover:text-red-500 transition text-2xl"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="px-6 py-6 space-y-5">

                        {/* Login */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                                <User size={16} />
                                Логин*
                            </label>
                            <input
                                type="text"
                                name="login"
                                value={formData.login}
                                onChange={onChange}
                                placeholder="Введите логин"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                                disabled={loading}
                            />
                            {errors.login && (
                                <p className="text-red-500 text-xs mt-1">{errors.login}</p>
                            )}
                        </div>

                        {/* FIO */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                                <UserCircle size={16} />
                                ФИО
                            </label>
                            <input
                                type="text"
                                name="fio"
                                value={formData.fio}
                                onChange={onChange}
                                placeholder="Введите ФИО"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                                <Lock size={16} />
                                Пароль*
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                placeholder="Введите пароль"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                                disabled={loading}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1 italic">
                                Минимум 6 символов
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                                <Mail size={16} />
                                Email*
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                placeholder="Введите email"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Role select */}
                        <div>
                            <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                                Роль
                            </label>
                            <select
                                name="roleId"
                                value={formData.roleId}
                                onChange={onChange}
                                disabled={loading}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                            >
                                <option value="1">Исполнитель</option>
                                <option value="3">Руководитель</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onReset}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition border border-gray-300"
                            >
                                Сбросить
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition border border-gray-300"
                            >
                                Отмена
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition shadow-sm"
                            >
                                {loading ? "Создание..." : "Создать пользователя"}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
