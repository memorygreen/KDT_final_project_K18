import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Myuserinfo.css';
import default_profile from '../assets/default_profile.jpeg';
import alram from '../assets/alr.png';
import setting from '../assets/set.png';
import cap from '../assets/cap.png';


const Myuserinfo = ({ sessionId, onIconClick }) => {
    const [showMissingList, setShowMissingList] = useState(true);
    const [userId, setUserId] = useState(sessionId);

    const [userInfo, setUserInfo] = useState();
    const [missingList, setMissingList] = useState([]);

    const handleCapClick = () => {
        onIconClick('capture');  // 외부 함수 호출
        setShowMissingList(true);  // 항상 true로 설정하여 My_missingList가 항상 나타나게 함
    }

    // 알람 및 설정 아이콘 클릭 핸들러
    const handleIconClick = (type) => {
        onIconClick(type);
        setShowMissingList(false);  // 실종자 목록 숨기기
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
        axios.post('/getAllMissing', { user_id: userId })  // 'userId'를 'user_id'로 변경
            .then(response => {
                console.log('Missing data:', response.data);
                setMissingList(response.data);
            })
            .catch(error => {
                console.error('Error fetching missing data:', error);
            });
    };

    const handleMissingClick = (missingId) => {
        axios.post('/getSearchMissing', { session_id: userId, missing_idx: missingId })
            .then(response => {
                console.log('Detailed missing info:', response.data);
                // 여기에 상세 정보를 표시하는 로직을 추가할 수 있습니다.
            })
            .catch(error => {
                console.error('Error fetching detailed missing info:', error);
            });
    }

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
                            <li key={missing.MISSING_IDX} onClick={() => handleMissingClick(missing.MISSING_IDX)}>
                                {missing.MISSING_NAME}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Myuserinfo;