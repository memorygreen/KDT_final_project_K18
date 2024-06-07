import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const CaptureNotificationPage = () => {
    const location = useLocation();
    const [notifications, setNotifications] = useState(location.state.notifications || []);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [cctvAddresses, setCctvAddresses] = useState({});

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    console.error('User is not logged in');
                    return;
                }

                const response = await axios.post('http://localhost:5000/my_capture', {
                    user_id: userId
                });

                setNotifications(response.data);

                // Fetch CCTV addresses for each notification
                for (const notification of response.data) {
                    const cctvResponse = await axios.post('http://localhost:5000/capture_address', {
                        cctv_idx: notification.CCTV_IDX
                    });

                    setCctvAddresses(prevState => ({
                        ...prevState,
                        [notification.CCTV_IDX]: cctvResponse.data.CCTV_LOAD_ADDRESS
                    }));
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const captureDetail = (notification) => {
        setSelectedNotification(notification);
        axios.post('http://localhost:5000/capture_detail', {
            capture_idx: notification.CAPTURE_IDX
        }).catch(error => {
            console.error('Error updating capture detail:', error);
        });
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    return (
        <div className="capture-notification-page">
            <NevBar />
            <h1>Capture Notifications</h1>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.CAPTURE_IDX} className="notification">
                        <div className="notification-header"><b>{notification.CAPTURE_IDX} 캡쳐 알림</b></div>
                        <div className="notification-content" onClick={() => captureDetail(notification)}>
                            {cctvAddresses[notification.CCTV_IDX] || 'Loading address...'} 의 CCTV {notification.CCTV_IDX} 에서
                            <div>{notification.CAPTURE_FIRST_TIME}에 저장된 알림 입니다.</div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedNotification && (
                <div className="modal-content">
                    <div>
                        <p>캡쳐 CCTV: CCTV{selectedNotification.CCTV_IDX}</p>
                        <p>캡쳐 장소: {cctvAddresses[selectedNotification.CCTV_IDX] || 'Loading address...'}</p>
                        <p>캡쳐 시간: {selectedNotification.CAPTURE_FIRST_TIME}</p>
                        <p>사진:</p>
                        <img src={selectedNotification.CAPTURE_PATH} alt="Capture" style={{ maxWidth: '500%' }} />
                    </div>
                    <button onClick={handleCloseModal}>Close</button>
                </div>
            )}
        </div>
    );
};

export default CaptureNotificationPage;