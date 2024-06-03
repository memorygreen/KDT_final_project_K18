import React,{useState,useEffect} from 'react';
import axios from 'axios';

const NevModal = ({ onClose }) => {
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
            <button onClick={onClose}>Close Modal</button>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header">제보알림</div>
                        <div className="notification-content">
                            {notification.POSTER_IDX}번째 포스터에대한 제보입니다.
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NevModal;