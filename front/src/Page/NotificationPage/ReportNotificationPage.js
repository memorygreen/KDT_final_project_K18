import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const ReportNotificationPage = () => {
    const location = useLocation();
    const [notifications] = useState(location.state.notifications || []);
    const [selectedNotification, setSelectedNotification] = useState(location.state.notification || null);

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