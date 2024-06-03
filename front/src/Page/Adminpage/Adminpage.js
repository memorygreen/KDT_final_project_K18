import React, { useState, useEffect } from 'react';
import './Adminpage.css'; // 여기에서 경로와 파일 이름이 일치하도록 합니다.
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Adminpage = () => {
    const [posters, setPosters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('/Admin')
            .then(response => {
                console.log(response.data);
                setPosters(response.data);
            })
            .catch(error => {
                console.error('There was a problem with the axios operation:', error);
            });
    }, []);
    // 회원 정지
    const handleStatusChange = (userId, currentStatus) => {
        const action = currentStatus === 'stop' ? '활성화' : '정지';
        const confirmMessage = `정말로 이 사용자를 ${action}시키겠습니까?`;
        const confirmStatusChange = window.confirm(confirmMessage);

        if (confirmStatusChange) {
            const newStatus = currentStatus === 'stop' ? 'action' : 'stop';
            axios.post('/user_status_change', { userId, newStatus })
                .then(response => {
                    console.log(`User status changed:`, response.data);
                    setPosters(posters.map(user =>
                        user.USER_ID === userId ? { ...user, USER_STATUS: newStatus } : user
                    ));
                })
                .catch(error => {
                    console.error('There was a problem with the status change operation:', error);
                });
        }
    };
    // 회원
    const handleCategoryChange = (userId, newCategory) => {
        axios.post('/user_category_change', { userId, newCategory })
            .then(response => {
                console.log(`User category changed:`, response.data);
                setPosters(posters.map(user =>
                    user.USER_ID === userId ? { ...user, USER_CATE: newCategory } : user
                ));
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleRowClick = (userId) => {
        navigate(`/Adminmanage?id=${userId}`);
    };

    // 현재 페이지에 맞는 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = posters.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 함수
    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    // 페이지 번호 렌더링
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(posters.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers.map(number => (
            <li
                key={number}
                id={number}
                onClick={handleClick}
                className={currentPage === number ? 'active' : null}
            >
                {number}
            </li>
        ));
    };

    return (
        <div>
            <NevBar />  
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
                        {currentItems.map((user, index) => (
                            <tr key={index} onClick={() => handleRowClick(user.USER_ID)}>
                                <td>{indexOfFirstItem + index + 1}</td> {/* 번호 */}
                                <td>{user.USER_ID}</td> {/* 아이디 */}
                                <td>{user.USER_NAME}</td> {/* 이름 */}
                                <td>{user.USER_BRT_DT}</td> {/* 생일 */}
                                <td>{user.USER_GENDER}</td> {/* 성별 */}
                                <td>{user.USER_PHONE}</td> {/* 휴대폰 */}
                                <td>
                                    <select
                                        value={user.USER_CATE} 
                                        onClick={e => e.stopPropagation()} // 행 클릭 이벤트 전파 방지
                                        onChange={(e) => handleCategoryChange(user.USER_ID, e.target.value)}
                                    > {/* 회원상태 */}
                                        <option value="INDI">INDI</option>
                                        <option value="ENT">ENT</option>
                                    </select>
                                </td>
                                <td>{user.USER_STATUS}</td>
                                <td>
                                    <button
                                        type='button'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(user.USER_ID, user.USER_STATUS);
                                        }}
                                    >
                                        {user.USER_STATUS === 'stop' ? '해제' : '정지'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ul id="page-numbers">
                    {renderPageNumbers()}
                </ul>
            </div>
        </div>
    );
};

export default Adminpage;
