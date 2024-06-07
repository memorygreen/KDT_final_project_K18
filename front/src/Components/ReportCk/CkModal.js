import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CkModal = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
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

                const response = await axios.post('http://localhost:5000/my_capture', {
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
    //제보 상세보기
    // const showCDetail = (notification) => {
    //     navigate('/ReportNotificationPage', { state: { notification, notifications } });
        
    //     // 모달을 먼저 표시한 후 업데이트 요청을 비동기적으로 보냅니다.
    //     axios.post('http://localhost:5000/report_detail', {
    //         report_id: notification.REPORT_ID
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).catch(error => {
    //         console.error('Error updating report detail:', error);
    //     });
    // };
  
   
    return (
        <div className="modal">
            <button onClick={onClose}>Close Modal</button>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header"><b>{notification.CAPTURE_IDX}  캡쳐 알림</b></div>
                        <div className="notification-content" >
                        {notification.CAPTURE_FIRST_TIME}에 온 제보입니다
                        </div>
                    </div>
                ))}
            </div>
                </div>
          
    );
 };

export default CkModal;