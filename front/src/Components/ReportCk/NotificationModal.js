import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationModal = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [cctvAddresses, setCctvAddresses] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    console.error('User is not logged in');
                    return;
                }

                const [captureResponse, reportResponse] = await Promise.all([
                    axios.post('http://localhost:5000/my_capture', {
                        user_id: userId
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }),
                    axios.post('http://localhost:5000/my_report', {
                        user_id: userId
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                const combinedNotifications = [
                    ...captureResponse.data.map(notification => ({ ...notification, type: 'capture' })),
                    ...reportResponse.data.map(notification => ({ ...notification, type: 'report' }))
                ];

                combinedNotifications.sort((a, b) => new Date(b.CAPTURE_FIRST_TIME || b.REPORT_TIME) - new Date(a.CAPTURE_FIRST_TIME || a.REPORT_TIME));

                setNotifications(combinedNotifications);

                for (const notification of captureResponse.data) {
                    const cctvResponse = await axios.post('http://localhost:5000/capture_address', {
                        cctv_idx: notification.CCTV_IDX
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
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

    const handleDetailClick = (notification) => {
        if (notification.type === 'capture') {
            navigate('/CaptureNotificationPage', { state: { notification, notifications } });
            captureDetail(notification); 
            axios.post('http://localhost:5000/capture_detail', {
                capture_idx: notification.CAPTURE_IDX
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(error => {
                console.error('Error updating capture detail:', error);
            });
        } else if (notification.type === 'report') {
            navigate('/ReportNotificationPage', { state: { notification, notifications } });
            reportDetail(notification);
            axios.post('http://localhost:5000/report_detail', {
                report_id: notification.REPORT_ID
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(error => {
                console.error('Error updating report detail:', error);
            });
        }
    };
    const captureDetail = (notification) => {
        axios.post('http://localhost:5000/capture_detail', {
            capture_idx: notification.CAPTURE_IDX
        }).catch(error => {
            console.error('Error updating capture detail:', error);
        });
    };
    const reportDetail = (notification) => {
        axios.post('http://localhost:5000/report_detail', {
            report_id: notification.REPORT_ID
        }).catch(error => {
            console.error('Error updating report detail:', error);
        });
    };


    return (
        <div className="modal">
            <button onClick={onClose}>Close Modal</button>
            <div className="notification-container" >
                {notifications.map(notification => (
                    <div key={notification.id} className="notification" onClick={() => handleDetailClick(notification)}>
                        <div className="notification-header" >
                            <b>{notification.type === 'capture' ? `${notification.MISSING_NAME} 추정 캡쳐 알림` : `${notification.MISSING_NAME} 추정 제보 알림`}</b>
                        </div>
                        <div className="notification-content" >
                            {notification.type === 'capture' ?
                                <>
                                    {cctvAddresses[notification.CCTV_IDX] || 'Loading address...'} 의 CCTV {notification.CCTV_IDX} 에서
                                    <div>{notification.CAPTURE_FIRST_TIME}에 온 <img src={notification.CAPTURE_PATH} alt="Capture" style={{ maxWidth: '100%' }} />입니다.
                                    </div>
                                </>
                                :
                                <div>{notification.REPORT_TIME}에 온 제보입니다</div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationModal;