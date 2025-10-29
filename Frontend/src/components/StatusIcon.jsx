import { AlertTriangle } from "lucide-react";

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'critical':
            return <AlertTriangle size={16} color="#e53e3e" style={{ marginRight: '8px' }} />;
        case 'warning':
            return <AlertTriangle size={16} color="#dd6b20" style={{ marginRight: '8px' }} />;
        case 'info':
            return <AlertTriangle size={16} color="#3182ce" style={{ marginRight: '8px' }} />;
        default:
            return null;
    }
};

export default StatusIcon;