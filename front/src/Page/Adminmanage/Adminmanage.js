import React, { useEffect, useState } from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Adminmanage.css';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Adminmanage = () => {
    const query = useQuery();
    const user_id = query.get('id');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.post('/user_post', { id: user_id });
                setUserInfo(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user_id) {
            fetchUserInfo();
        }
    }, [user_id]);

    const handleDelete = async (poster_idx) => {
        try {
            await axios.post('/delete_poster', { poster_idx });
            alert('포스터 상태가 "글내림"으로 변경되었습니다.');
            setUserInfo(userInfo.map(user => 
                user.POSTER_INFO.POSTER_IDX === poster_idx ? {
                    ...user,
                    POSTER_INFO: {
                        ...user.POSTER_INFO,
                        POSTER_SHOW: 0
                    }
                } : user
            ));
        } catch (error) {
            alert('삭제에 실패했습니다.');
        }
    };

    return (
        <div>
            <header>
                <NevBar />
            </header>
            <div className="admin_main">
                <h1>포스터 관리 페이지</h1>
                <p>사용자 ID: {user_id}</p>
                {loading && <p>로딩 중...</p>}
                {error && <p>에러 발생: {error}</p>}
                {userInfo && userInfo.length > 0 ? (
                    userInfo.map((user, index) => (
                        <div key={index} className="user-info">
                            <div className="images-container">
                                {user.POSTER_INFO.POSTER_IMG_PATH ? (
                                    user.POSTER_INFO.POSTER_IMG_PATH.split(',').map((imgPath, imgIndex) => (
                                        <div key={imgIndex} className='user_poster'>
                                            <img className='pic' src={imgPath} alt={user.MISSING_NAME} />
                                            <br />
                                            <button
                                                type='button'
                                                onClick={() => handleDelete(user.POSTER_INFO.POSTER_IDX)}
                                            >
                                                삭제
                                            </button>
                                            <p>상태: {user.POSTER_INFO.POSTER_SHOW === 1 ? "게시중" : "글내림"}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>이미지 없음</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>사용자 정보를 찾을 수 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Adminmanage;
