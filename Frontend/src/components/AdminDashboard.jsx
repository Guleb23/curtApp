import React, { useEffect, useState } from "react";
import { LogOut, UserPlus, Users } from "lucide-react";
import CreateUserModal from "./CreateUserModal";
import axios from "axios";
import api from "../services/authService";
import NoUser from "./NoUser";
import UserTable from "./UserTable";

const AdminDashboard = ({ onLogout, user }) => {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [users, setUsers] = useState([]);



    const [formData, setFormData] = useState({
        login: "",
        fio: "",
        password: "",
        email: "",
        roleId: 1
    });

    useEffect(() => {
        loadUsers();
        console.log(user);

    }, []);


    const validateForm = () => {
        const newErrors = {};

        if (!formData.login.trim()) newErrors.login = "Логин обязателен";
        if (!formData.password) newErrors.password = "Пароль обязателен";
        else if (formData.password.length < 6)
            newErrors.password = "Пароль должен быть не менее 6 символов";

        if (!formData.email.trim()) newErrors.email = "Email обязателен";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Некорректный email";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        const success = await createUser();

        if (success) {
            alert("Пользователь успешно создан!");
            setFormData({ login: "", fio: "", password: "", email: "" });
            setErrors({});
            setIsCreateUserModalOpen(false);
        }

        setLoading(false);
    };

    const createUser = async () => {
        try {
            const res = await api.post("/Admin/user", formData);

            loadUsers();

            return true;
        } catch (err) {
            console.error("Ошибка создания пользователя:", err);
            alert("Не удалось создать пользователя.");
            return false;
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleReset = () => {
        setFormData({ login: "", fio: "", password: "", email: "" });
        setErrors({});
    };


    const loadUsers = () => {
        api.get("/Admin/users")
            .then(res => {
                setUsers(res.data);
                console.log("Пользователи:", res.data);
            })
            .catch(err => console.error("Ошибка загрузки:", err));
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Удалить пользователя?")) return;

        try {
            await api.delete(`/Admin/user/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error("Ошибка удаления:", err);
            alert("Не удалось удалить пользователя.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* HEADER */}
            <header className="flex items-center justify-between bg-white rounded-2xl p-6 shadow border border-gray-200">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Административная панель</h1>
                    <p className="text-gray-500 text-sm">Управление системой и пользователями</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                        onClick={() => setIsCreateUserModalOpen(true)}
                    >
                        <UserPlus size={18} />
                        Создать пользователя
                    </button>

                    <button onClick={() => onLogout()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 transition">
                        <LogOut size={18} />
                        Выйти
                    </button>
                </div>
            </header>

            {/* STATS */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                        <Users size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{users.length}</h3>
                        <p className="text-gray-500 text-sm">Пользователей</p>
                    </div>
                </div>
            </div>

            {users.length === 0 ? (
                <NoUser />
            ) : (
                <UserTable users={users} onDelete={deleteUser} currentUserId={user.userId} />
            )}

            {/* MODAL */}
            <CreateUserModal
                isOpen={isCreateUserModalOpen}
                loading={loading}
                formData={formData}
                errors={errors}
                onClose={() => setIsCreateUserModalOpen(false)}
                onSubmit={handleSubmit}
                onReset={handleReset}
                onChange={handleChange}
            />
        </div>
    );
};

export default AdminDashboard;
