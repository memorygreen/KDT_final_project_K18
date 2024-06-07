import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const ReportNotificationPage = () => {
    const location = useLocation();
    const [notifications, setNotifications] = useState(location.state.notifications || []);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    console.error('User is not logged in');
                    return;
                }

                const response = await axios.post('http://localhost:5000/my_report', {
                    user_id: userId
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

        axios.post('http://localhost:5000/report_detail', {
            report_id: notification.REPORT_ID
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.error('Error updating report detail:', error);
        });
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    return (
        <div className="report-notification-page">
            <NevBar />
            <h1>Report Notifications</h1>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header">{notification.POSTER_IDX} 포스터 제보 알림</div>
                        <div className="notification-content" onClick={() => showDetail(notification)}>
                            {notification.REPORT_TIME}에 온 제보입니다
                        </div>
                    </div>
                ))}
            </div>
            {selectedNotification && (
                <div className="modal-content">
                    <div>
                        <p>제보 시간: {selectedNotification.REPORT_TIME}</p>
                        <p>발견 시간: {selectedNotification.REPORT_SIGHTING_TIME}</p>
                        <p>발견 장소: {selectedNotification.REPORT_SIGHTING_PLACE}</p>
                        <p>특이사항: {selectedNotification.REPORT_ETC}</p>
                    </div>
                    <button onClick={handleCloseModal}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ReportNotificationPage;