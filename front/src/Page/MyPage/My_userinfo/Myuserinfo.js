import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Myuserinfo.css';
import default_profile from '../assets/default_profile.jpeg';
import alram from '../assets/alr.png';
import setting from '../assets/set.png';
import cap from '../assets/cap.png';
import CardModal from '../../../Components/Cards/CardModal/CardModal'; // CardModal component imported

const Myuserinfo = ({ sessionId, onIconClick }) => {
    const [showMissingList, setShowMissingList] = useState(true);
    const [userId, setUserId] = useState(sessionId);
    const [userInfo, setUserInfo] = useState();
    const [missingList, setMissingList] = useState([]);
    const [selectedMissing, setSelectedMissing] = useState(null); // State to store selected missing person info
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close

    // 자영 : missing_idx 데이터를 넘겨주는 함수 만들기
    const  handle_missing_name_click = () => {

    }

    // 클릭하면 상세보기 나오는 모달창 나오게 하기
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
    }, []);

    return (
        <div className='Mypage_userinfo_all'>
            <div className='Mypage_userinfo'>
                <img src={userInfo && userInfo.USER_IMG ? userInfo.USER_IMG : default_profile} alt={default_profile} />
                <div className='Mypage_userinfo_name'>{userInfo && userInfo.USER_NAME}</div>
            </div>
            <div className='Mypage_userinfo_icon'>
                <div onClick={() => handleIconClick('notification')}><img src={alram} alt="alram" /></div>
                <div onClick={handleCapClick}><img src={cap} alt="cap" /></div>
                <div onClick={() => handleIconClick('update')}><img src={setting} alt="setting" /></div>
            </div>
            {showMissingList && (
                <div className='My_missingList'>
                    <ul>
                        {missingList.map((missing) => (
                            // <li key={missing.MISSING_IDX} onClick={() => handleMissingClick(missing)}>
                            <li key={missing.MISSING_IDX} onClick={() => handle_missing_name_click()}>
                                {missing.MISSING_NAME}
                                <button onClick={() => handleMissingClick(missing)}>상세보기</button>

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