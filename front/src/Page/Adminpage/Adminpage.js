import React, { useState, useEffect } from 'react';
import './Adminpage.css'; // 여기에서 경로와 파일 이름이 일치하도록 합니다.
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const Adminpage = () => {
    const [posters, setPosters] = useState([]);

    useEffect(() => {
        // 포스터 데이터 가져오기
        axios.post('/Admin')
            .then(response => {
                // 성공적으로 데이터를 받았을 때 처리
                console.log(response.data);
                setPosters(response.data);
            })
            .catch(error => {
                // 에러 처리
                console.error('There was a problem with the axios operation:', error);
            });
    }, []);

    const handleStatusChange = (userId, currentStatus) => {
        const action = currentStatus === 'stop' ? '활성화' : '정지';
        const confirmMessage = `정말로 이 사용자를 ${action}시키겠습니까?`;
        const confirmStatusChange = window.confirm(confirmMessage);

        if (confirmStatusChange) {
            const newStatus = currentStatus === 'stop' ? 'action' : 'stop';
            // 상태 변경 요청 보내기
            axios.post('/user_status_change', { userId, newStatus })
                .then(response => {
                    console.log(`User status changed:`, response.data);
                    // 상태 업데이트
                    setPosters(posters.map(user =>
                        user.USER_ID === userId ? { ...user, USER_STATUS: newStatus } : user
                    ));
                })
                .catch(error => {
                    console.error('There was a problem with the status change operation:', error);
                });
        }
    };

    return (
        <div>
            <header>
                <NevBar />
            </header>
            <div className="main">
                <h1>운영자 페이지</h1>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>생일</th>
                            <th>성별</th>
                            <th>휴대폰</th>
                            <th>회원구분</th>
                            <th>활동상태</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {posters.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.USER_ID}</td>
                                <td>{user.USER_NAME}</td>
                                <td>{user.USER_BRT_DT}</td>
                                <td>{user.USER_GENDER}</td>
                                <td>{user.USER_PHONE}</td>
                                <td>{user.USER_CATE}</td>
                                <td>{user.USER_STATUS}</td>
                                <td>
                                    <button
                                        type='button'
                                        onClick={() => handleStatusChange(user.USER_ID, user.USER_STATUS)}
                                    >
                                        {user.USER_STATUS === 'stop' ? '해제' : '정지'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Adminpage;
