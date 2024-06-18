import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Myuserinfo.css';
import default_profile from '../assets/default_profile.jpeg';
import alram from '../assets/alr.png';
import setting from '../assets/set.png';
import cap from '../assets/cap.png';
import CardModal from '../../../Components/Cards/CardModal/CardModal'; 
import MyCapture from '../My_capture/MyCapture';

const Myuserinfo = ({ sessionId, onIconClick, onDivClick }) => {
    const [showMissingList, setShowMissingList] = useState(true);
    const [userId, setUserId] = useState(sessionId);
    const [userInfo, setUserInfo] = useState(null);
    const [missingList, setMissingList] = useState([]);
    const [selectedMissing, setSelectedMissing] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMissingClick = (missing) => {
        setSelectedMissing(missing);
        setIsModalOpen(true);
    };

    const handleIconClick = (type) => {
        if (type === 'capture' || type === 'notification') {
            setShowMissingList(true);
        } else {
            setShowMissingList(false);
        }
        onIconClick(type);
    };

    const handleDivClick = (missing) => {
        onDivClick(missing);
        setSelectedMissing(missing);
    };

    const handleAllClick = () => {
        onDivClick(null); // 전체 알림을 보여주기 위해 null을 전달
        setSelectedMissing(null);
    };

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

    const fetchMissingData = () => {
        axios.post('/missing_info_oneuser', { user_id: userId })
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
    }, []);

    return (
        <div className='Mypage_userinfo_all'>
            <div className='Mypage_userinfo'>
                <img className='userinfo_img' src={userInfo && userInfo.USER_IMG ? userInfo.USER_IMG : default_profile} alt="default_profile" />
                <div className='Mypage_userinfo_name'>{userInfo && userInfo.USER_NAME}</div>
            </div>
            <div className='Mypage_userinfo_icon'>
                <div onClick={() => handleIconClick('notification')}>
                    <img src={alram} alt="alram" />
                </div>
                <div onClick={() => handleIconClick('capture')}>
                    <img src={cap} alt="cap" />
                </div>
                <div onClick={() => handleIconClick('update')}>
                    <img src={setting} alt="Settings" />
                </div>
            </div>
            {showMissingList && (
                <div className='My_missingList'>
                    <div className='My_missingList_title' onClick={handleAllClick}>
                        실종자 목록
                    </div>
                    <div className='My_missingList_items'>
                        {missingList.map((missing) => (
                            <div className='My_missingList_item' key={missing.MISSING_IDX} onClick={() => handleDivClick(missing)}>
                                {missing.MISSING_NAME}
                                <button className='Mypage_missing_btn' onClick={(e) => { e.stopPropagation(); handleMissingClick(missing); }}>정보</button>
                            </div>
                        ))}
                    </div>
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
};

export default Myuserinfo;