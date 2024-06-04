import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NevModal = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        // 알림 가져오기
        const fetchNotifications = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    console.error('User is not logged in');
                    return;
                }

                const response = await axios.post('http://localhost:5000/my_report', {
                    user_id: userId
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);
    const showDetail = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    const handleGoToReportPage = () => {
        navigate.push('/ReportNotificationPage', { notifications });
    };
    return (
        <div className="modal">
            <button onClick={onClose}>Close Modal</button>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header">제보 알림</div>
                        <div className="notification-content" onClick={() => showDetail(notification)}>
                            {notification.POSTER_IDX}번째 포스터에대한 제보입니다.
                        </div>
                    </div>
                ))}
            </div>
            {selectedNotification && (
                <div className="modal-content">
                    <div>
                        <p>REPORT_TIME: {selectedNotification.REPORT_TIME}</p>
                        <p>REPORT_SIGHTING_TIME: {selectedNotification.REPORT_SIGHTING_TIME}</p>
                        <p>REPORT_SIGHTING_PLACE: {selectedNotification.REPORT_SIGHTING_PLACE}</p>
                        <p>REPORT_ETC: {selectedNotification.REPORT_ETC}</p>
                    </div>
                    <button onClick={handleCloseModal}>Close</button>
                    <button onClick={handleGoToReportPage}>Go to Report Page</button>
                </div>
            )}



        </div>
    );
};

export default NevModal;