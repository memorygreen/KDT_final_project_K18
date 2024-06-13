import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Myuserinfo.css';
import default_profile from '../assets/default_profile.jpeg';
import alram from '../assets/alr.png';
import setting from '../assets/set.png';
import cap from '../assets/cap.png';
import CardModal from '../../../Components/Cards/CardModal/CardModal'; // CardModal component imported
import alramck from '../assets/alrck.png'

const Myuserinfo = ({ sessionId, onIconClick, setMissingIdx}) => {
    const [showMissingList, setShowMissingList] = useState(true);
    const [userId, setUserId] = useState(sessionId);
    const [userInfo, setUserInfo] = useState();
    const [missingList, setMissingList] = useState([]);
    const [selectedMissing, setSelectedMissing] = useState(null); // State to store selected missing person info
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close
    const [notificationStatus, setNotificationStatus] = useState('read'); // State to check if notification is read or unread

    const handleMissingClick = (missing) => {
        setSelectedMissing(missing); // Store selected missing person info
        setIsModalOpen(true); // Open modal
    };

    const handleCapClick = () => {
        onIconClick('capture');  // Call external function
        setShowMissingList(true);  // Always set to true to show My_missingList
    }

    // 알람 및 설정 아이콘 클릭 핸들러
    const handleIconClick = (type) => {
        onIconClick(type);
        setShowMissingList(false);  // Hide missing list
        if (type === 'notification') {
            setNotificationStatus('read'); // Set notification as read
        }
    }

    // 유저 정보 불러오기
    const fetchUserInfo = () => {
        axios.post('/userInfoOne', { user_id: userId })
            .then(response => {
                console.log('User info:', response.data);
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    };

    // 실종자 목록 불러오기
    const fetchMissingData = () => {
        axios.post('/missing_info_oneuser', { user_id: userId })  // 'userId' changed to 'user_id'
            .then(response => {
                console.log('Missing data:', response.data);
                setMissingList(response.data);
            })
            .catch(error => {
                console.error('Error fetching missing data:', error);
            });
    };

    useEffect(() => {
        fetchMissingData();
        fetchUserInfo();

        // Setup push notification listener
        const eventSource = new EventSource('http://127.0.0.1:5000/notify');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.user_id === userId) {
                fetchUserInfo();
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);
    const notificationIcon = userInfo && userInfo.USER_NOTIFICATION_STATUS === 'unread' ? alramck : alram;

    return (
        <div className='Mypage_userinfo_all'>
            <div className='Mypage_userinfo'>
                <img src={userInfo && userInfo.USER_IMG ? userInfo.USER_IMG : default_profile} alt={default_profile} />
                <div className='Mypage_userinfo_name'>{userInfo && userInfo.USER_NAME}</div>
            </div>
            <div className='Mypage_userinfo_icon'>
                <div onClick={() => handleIconClick('notification')}>
                    <img src={notificationIcon} alt="alram" />
                </div>
                <div onClick={handleCapClick}><img src={cap} alt="cap" /></div>
                <div onClick={() => handleIconClick('update')}><img src={setting} alt="setting" /></div>
            </div>
            {showMissingList && (
                <div className='My_missingList'>
                    <ul>
                        {missingList.map((missing) => (
                            // <li key={missing.MISSING_IDX} onClick={() => handleMissingClick(missing)}>
                            <li key={missing.MISSING_IDX} onClick={() => {setMissingIdx(missing.MISSING_IDX)}}>
                                {missing.MISSING_NAME}
                                <button className='Mypage_missing_btn' onClick={() => handleMissingClick(missing)}>상세보기</button>
                                <button className='Mypage_missing_btn' onClick={() => handleMissingClick(missing)}>삭제</button>


                            </li>
                            
                        ))}
                    </ul>
                </div>
            )}
            {isModalOpen && (
                <CardModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedArticle={selectedMissing}
                />
            )}
        </div>
    );
}

export default Myuserinfo;