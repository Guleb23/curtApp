import React from 'react'

const NoUser = () => {
    return (
        <section className="mt-10 bg-white rounded-2xl shadow border border-gray-200 p-10 text-center flex flex-col items-center">

            <h3 className="text-lg font-semibold text-gray-800">
                Нет данных для отображения
            </h3>

            <p classname="text-gray-500 text-sm max-w-md">
                Таблица пользователей появится здесь после подключения API.
            </p>
        </section>

    )
}

export default NoUser
