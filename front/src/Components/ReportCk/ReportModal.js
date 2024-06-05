import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NevModal = ({ onClose }) => {
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
    //제보 상세보기
    const showDetail = (notification) => {
        navigate('/ReportNotificationPage', { state: { notification, notifications } });
    };
    //제보 상세보기시 조회여부 변경 시간확인 
    // const report_update =async() =>{
       
    //     try {
    //         const response = await axios.post('http://localhost:5000/report_detail', {
    //             report_id:report_id 
        
    //         });
    
    //         console.log('report update successfully:', response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error update:', error);
    //         throw error;
    //     }

    // };
   
    return (
        <div className="modal">
            <button onClick={onClose}>Close Modal</button>
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification">
                        <div className="notification-header"><b>제보 알림</b></div>
                        <div className="notification-content" onClick={() => {showDetail(notification); }}>
                            {notification.POSTER_IDX}번째 포스터에대한 제보입니다.
                        </div>
                    </div>
                ))}
            </div>
                </div>
          
    );
};

export default NevModal;