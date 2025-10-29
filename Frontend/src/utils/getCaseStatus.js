export const getCaseStatus = (dateOfResult) => {
    if (!dateOfResult) return null;

    const resultDate = new Date(dateOfResult);
    const today = new Date();
    const diffTime = today - resultDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
        return { status: 'critical', days: diffDays, message: `Прошло ${diffDays} дней с даты решения` };
    } else if (diffDays > 25) {
        return { status: 'warning', days: diffDays, message: `Прошло ${diffDays} дней с даты решения` };
    } else if (diffDays >= 20) {
        return { status: 'info', days: diffDays, message: `Приближается срок 30 дней. Прошло ${diffDays} дней` };
    }

    return null;
};

export const getStatusStyles = (status) => {
    switch (status) {
        case 'critical':
            return { backgroundColor: '#fed7d7', color: '#742a2a', border: '1px solid #feb2b2' };
        case 'warning':
            return { backgroundColor: '#feebc8', color: '#744210', border: '1px solid #fbd38d' };
        case 'info':
            return { backgroundColor: '#bee3f8', color: '#1a365d', border: '1px solid #90cdf4' };
        default:
            return {};
    }
};