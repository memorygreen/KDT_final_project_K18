<<<<<<< HEAD
import React, {  useState } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 1ad8fcd4c2b4a496f4ef896b9c6f392406611683
import { useLocation } from 'react-router-dom';
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const ReportNotificationPage = () => {
    const location = useLocation();
    const [notifications] = useState(location.state.notifications || []);
    const [selectedNotification, setSelectedNotification] = useState(location.state.notification || null);

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