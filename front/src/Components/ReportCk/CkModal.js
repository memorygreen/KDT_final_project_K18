import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CkModal = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [cctvAddresses, setCctvAddresses] = useState({});
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
                // Fetch CCTV addresses for each notification
                for (const notification of response.data) {
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
     //캡쳐 상세보기
    const CaptureDetail = (notification) => {
        navigate('/CaptureNotificationPage', { state: { notification, notifications } });
        
        // 모달을 먼저 표시한 후 업데이트 요청을 비동기적으로 보냅니다.
        axios.post('http://localhost:5000/capture_detail', {
            capture_idx: notification.CAPTURE_IDX
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.error('Error updating capture detail:', error);
        });
    };
  
   
    return (
        <div className="modal">
            <button onClick={onClose}>Close Modal</button>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header"><b>{notification.CAPTURE_IDX}  캡쳐 알림</b></div>
                        <div className="notification-content" onClick={() => CaptureDetail(notification)}>
                        {cctvAddresses[notification.CCTV_IDX] || 'Loading address...'} 의 CCTV {notification.CCTV_IDX} 에서
                        <div>{notification.CAPTURE_FIRST_TIME} 저장된 알림 입니다.</div>
                        </div>
                        
                    </div>
                ))}
            </div>
                </div>
          
    );
 };

export default CkModal;