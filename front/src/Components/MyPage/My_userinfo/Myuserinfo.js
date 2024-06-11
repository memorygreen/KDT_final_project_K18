import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Myuserinfo.css';
import default_profile from '../assets/default_profile.jpeg';
import alram from '../assets/alr.png';
import setting from '../assets/set.png';
import cap from '../assets/cap.png';


const Myuserinfo = ({ sessionId }) => {
    const [showMissingList, setShowMissingList] = useState(false);
    const [userId, setUserId] = useState(sessionId);

    const [userInfo, setUserInfo] = useState();
    const [missingList, setMissingList] = useState([]);

    const handleIcon2Click = () => {
        setShowMissingList(prevState => !prevState);
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
                <div><img src={alram} alt={alram} /></div>
                <div onClick={handleIcon2Click}><img src={cap} alt={cap} /></div>
                <div><img src={setting} alt={setting} /></div>
                
            </div>
            {showMissingList && (
                <div className='My_missingList'>
                    <ul>
                        {missingList.map((missing) => (
                            <li key={missing.MISSING_ID}>{missing.MISSING_NAME}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Myuserinfo;