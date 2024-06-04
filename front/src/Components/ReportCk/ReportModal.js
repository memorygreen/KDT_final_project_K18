import React,{useState,useEffect} from 'react';
import axios from 'axios';

const ReportModal = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);

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

    return (
        <div className="modal">
            <button onClick={onclose}>Close Modal</button>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header">제보 알림</div>
                        <div className="notification-content">
                            {notification.REPORT_SIGHTING_TIME}에온 제보입니다.
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportModal;