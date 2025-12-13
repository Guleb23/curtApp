import React from "react";

const UserTable = ({ users, onDelete, currentUserId }) => {
    const roleMap = {
        1: "Исполнитель",
        2: "Админ",
        3: "Руководитель"
    };

    return (
        <section className="mt-10 bg-white shadow border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Пользователи</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                            <th className="py-3 px-4 border-b">Логин</th>
                            <th className="py-3 px-4 border-b">ФИО</th>
                            <th className="py-3 px-4 border-b">Email</th>
                            <th className="py-3 px-4 border-b">Роль</th>
                            <th className="py-3 px-4 border-b">ID</th>
                            <th className="py-3 px-4 border-b text-center">Действия</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((u) => {
                                const isCurrent = u.id === currentUserId;

                                // Цвет роли по типу
                                let roleClass = "bg-gray-100 text-gray-700";
                                if (u.role === 1) roleClass = "bg-green-100 text-green-700";
                                if (u.role === 2) roleClass = "bg-red-100 text-red-700";
                                if (u.role === 3) roleClass = "bg-blue-100 text-blue-700";

                                // Если это текущий пользователь — подсветка
                                if (isCurrent) roleClass = "bg-blue-50 text-blue-600 font-semibold";

                                return (
                                    <tr
                                        key={u.id}
                                        className={`transition text-gray-800 hover:bg-gray-50 ${isCurrent ? "bg-blue-50 font-semibold" : ""
                                            }`}
                                    >
                                        <td className="py-3 px-4 border-b">
                                            {u.login}
                                            {isCurrent && (
                                                <span className="ml-2 text-blue-600 text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                                                    Вы
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3 px-4 border-b">{u.fio || "—"}</td>
                                        <td className="py-3 px-4 border-b">{u.email}</td>

                                        <td className="py-3 px-4 border-b">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${roleClass}`}>
                                                {roleMap[u.roleId] || "—"}
                                            </span>
                                        </td>

                                        <td className="py-3 px-4 border-b text-gray-500 text-xs">{u.id}</td>

                                        <td className="py-3 px-4 border-b text-center">
                                            {!isCurrent ? (
                                                <button
                                                    onClick={() => onDelete(u.id)}
                                                    className="px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200 border border-red-300 transition"
                                                >
                                                    Удалить
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    Нельзя удалить себя
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-6 text-center text-gray-500 text-sm">
                                    Нет пользователей
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default UserTable;
