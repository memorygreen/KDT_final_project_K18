import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';

const Notification = ({ sessionId, missingIdx }) => {
    const [notifications, setNotifications] = useState([]);
    const [cctvAddresses, setCctvAddresses] = useState({});
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [filter, setFilter] = useState('all');
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [userId, setUserId] = useState(sessionId);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
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
    }, [userId]);

    useEffect(() => {
        if (missingIdx) {
            const fetchNotificationsForMissing = async () => {
                try {
                    const [captureResponse, reportResponse] = await Promise.all([
                        axios.post('http://localhost:5000/one_capture', {
                            MISSING_IDX: missingIdx
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }),
                        axios.post('http://localhost:5000/one_report', {
                            MISSING_IDX: missingIdx
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

            fetchNotificationsForMissing();
        } else {
            const fetchNotifications = async () => {
                try {
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
        }
    }, [missingIdx, userId]);

    useEffect(() => {
        setFilter('all');
        setFilteredNotifications(notifications);
    }, [notifications]);

    const handleDetailClick = async (notification) => {
        if (notification.type === 'capture') {
            try {
                await axios.post('http://localhost:5000/capture_detail', {
                    capture_idx: notification.CAPTURE_IDX
                });
                // 클릭 후 바로 회색으로 변경
                notification.CAPTURE_ALARM_CK = 1;
            } catch (error) {
                console.error('Error updating capture detail:', error);
            }
        } else if (notification.type === 'report') {
            try {
                await axios.post('http://localhost:5000/report_detail', {
                    report_id: notification.REPORT_ID
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // 클릭 후 바로 회색으로 변경
                notification.REPORT_NOTIFICATION = 1;
            } catch (error) {
                console.error('Error updating report detail:', error);
            }
        }
        setSelectedNotification(notification);
        // 상태 업데이트를 통해 UI를 강제로 리렌더링
        setNotifications([...notifications]);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    const handleCaptureButtonClick = () => {
        const captureNotifications = notifications.filter(notification => notification.type === 'capture');
        setFilteredNotifications(captureNotifications);
        setFilter('capture');
    };
    const handleReportButtonClick = () => {
        const reportNotifications = notifications.filter(notification => notification.type === 'report');
        setFilteredNotifications(reportNotifications);
        setFilter('report');
    };
    const handleAllButtonClick = () => {
        setFilteredNotifications(notifications);
        setFilter('all');
    };

    return (
        <div className="Mypage_alram_all">
            <div className="notification-buttons">
                <button onClick={handleAllButtonClick}>전체 알림</button>
                <button onClick={handleReportButtonClick}>제보 알림</button>
                <button onClick={handleCaptureButtonClick}>발견 알림</button>
            </div>
            <div className="notification-container">
                {filteredNotifications.map(notification => (
                    <div key={notification.id} className={`notification ${notification.REPORT_NOTIFICATION === 1 || notification.CAPTURE_ALARM_CK === 1 ? 'notification-gray' : ''}`} onClick={() => handleDetailClick(notification)}>
                        <div className="notification-header">
                            <b>{notification.type === 'capture' ? `${notification.MISSING_NAME} 추정 캡처 알림` : `${notification.MISSING_NAME} 추정 제보 알림`}</b>
                        </div>
                        <div className={`notification-content ${notification.REPORT_NOTIFICATION === 1 || notification.CAPTURE_ALARM_CK === 1 ? 'notification-content-gray-text' : ''}`}>
                            {notification.type === 'capture' ?
                                <>
                                    <div>{cctvAddresses[notification.CCTV_IDX] || 'Loading address...'} 의 CCTV {notification.CCTV_IDX} 에서</div>
                                    <div>
                                        {notification.CAPTURE_FIRST_TIME}에 온 <img src={notification.CAPTURE_PATH} alt="Capture" style={{ maxWidth: '100%' }} />입니다.
                                    </div>
                                </>
                                :
                                <div>{notification.REPORT_TIME}에 온 제보입니다</div>
                            }                        
                        </div>
                    </div>
                ))}
            </div>
            {selectedNotification && (
                <div className="modal-detail">
                    <div>
                        {selectedNotification.type === 'capture' ? (
                            <>
                                <p>캡처 CCTV: CCTV{selectedNotification.CCTV_IDX}</p>
                                <p>캡처 장소: {cctvAddresses[selectedNotification.CCTV_IDX] || 'Loading address...'}</p>
                                <p>캡처 시간: {selectedNotification.CAPTURE_FIRST_TIME}</p>
                                <img src={selectedNotification.CAPTURE_PATH} alt="Capture" style={{ maxWidth: '100%' }} />
                            </>
                        ) : (
                            <>
                                <p>제보 시간: {selectedNotification.REPORT_TIME}</p>
                                <p>발견 시간: {selectedNotification.REPORT_SIGHTING_TIME}</p>
                                <p>발견 장소: {selectedNotification.REPORT_SIGHTING_PLACE}</p>
                                <p>특이사항: {selectedNotification.REPORT_ETC}</p>
                            </>
                        )}
                    </div>
                    <button className='close-button' onClick={handleCloseModal}>닫기</button>
                </div>
            )}
        </div>
    );
};

export default Notification;