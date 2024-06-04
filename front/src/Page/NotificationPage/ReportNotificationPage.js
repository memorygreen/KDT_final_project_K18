import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ReportNotificationPage = () => {
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    console.error('User is not logged in');
                    return;
                }

                const response = await axios.post('http://localhost:5000/reportCk', {
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

        if (location.state && location.state.notifications) {
            setNotifications(location.state.notifications);
        } else {
            fetchNotifications();
        }
    }, [location.state]);

    const showDetail = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    return (
        <div className="report-notification-page">
            <h1>Report Notifications</h1>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header">제보알림</div>
                        <div className="notification-content" onClick={() => showDetail(notification)}>
                            {notification.POSTER_IDX}번째 포스터에 대한 제보입니다.
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
                </div>
            )}
        </div>
    );
};

export default ReportNotificationPage;