import React, { useEffect, useState } from 'react';
import './NevBar.css';
import logo from "./assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoNotification from '../../Page/MyPage/My_alram/NoNotificaiton';

const NevBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userCate, setUserCate] = useState(null);
    const [userAlarmCk, setUserAlarmCk] = useState(1);
    const [intervalId, setIntervalId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // 사용자 정보를 서버에서 가져오는 함수
    const fetchUserInfo = (userId) => {
        axios.post('http://localhost:5000/userInfoOne', { user_id: userId })
            .then(response => {
                setUserAlarmCk(response.data.USER_ALARM_CK);
                if (response.data.USER_ALARM_CK === 0 && intervalId) {
                    clearInterval(intervalId);
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    };

    // 사용자 정보와 로그인 상태를 초기 설정
    useEffect(() => {
        const session = sessionStorage.getItem('userId');
        const sessionUserCate = sessionStorage.getItem('userCate');
        setIsLoggedIn(!!session); // session이 존재하면 로그인 상태로 설정
        setUserCate(sessionUserCate);

        if (session) {
            fetchUserInfo(session); // 초기에 사용자 정보를 가져옴
        }

        // 5초마다 USER_ALARM_CK값이 1일 때 업데이트
        const id = setInterval(() => {
            if (session && userAlarmCk === 1) {
                fetchUserInfo(session);
            }
        }, 5000);

        setIntervalId(id); // intervalId 저장

        // 컴포넌트 언마운트 시 clearInterval
        return () => {
            clearInterval(id);
        };
    }, [userAlarmCk]); // userAlarmCk가 변경될 때마다 useEffect 재실행

    // 알림 상태를 업데이트하는 함수
    const updateAlarmStatus = (userId) => {
        axios.post('http://localhost:5000/updateAlarm', { user_id: userId })
            .then(response => {
                setUserAlarmCk(1); // 알림 상태를 1로 업데이트
                setIsModalOpen(true); // 모달 열기
            })
            .catch(error => {
                console.error('Error updating alarm status:', error);
            });
    };

    // 로그아웃 처리
    const handleLogout = () => {
        sessionStorage.clear(); // 세션 스토리지 초기화
        setIsLoggedIn(false); // 로그인 상태 false로 설정
        navigate('/Login'); // 로그인 페이지로 이동
    };

    // 모달 닫기 처리
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // 메뉴 토글
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="all_header">
            <header className="header_class">
                <div className="menu__wrapper">
                    <div className="menu__bar">
                        <Link to="/" className="logo_nev">
                            <img src={logo} alt="logo" />
                        </Link>
                        <nav>
                            {isLoggedIn && (
                                <ul className={`navigation ${isMenuOpen ? '' : 'nevbar_hide'}`}>
                                    <li><Link to='/Mappage'>Map</Link></li>
                                    <li><Link to="/MyPage" className="link-button">MyPage</Link></li>
                                    <li><Link to='/SearchMissingPage'>실종자등록</Link></li>
                                    <li>
                                        <button onClick={() => updateAlarmStatus(sessionStorage.getItem('userId'))}>
                                            {userAlarmCk === 1 ? '' : '알림'}
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </nav>
                    </div>
                    <div className={`action-buttons ${isMenuOpen ? '' : 'nevbar_hide'}`}>
                        {!isLoggedIn && (
                            <>
                                <Link to="/Login" title="Sign in" className="secondary">
                                    Sign in
                                </Link>
                                <Link to="/Signup" title="Sign up" className="primary">
                                    Sign up
                                </Link>
                            </>
                        )}
                        <div className="admin_button">
                            {userCate === 'ADM' && (
                                <li>
                                    <button type="button_admin">
                                        management
                                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                                            <path
                                                d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z">
                                            </path>
                                        </svg>
                                    </button>
                                    <div className="dropdown__wrapper">
                                        <div className="dropdown">
                                            <ul className="list-items-with-description">
                                                <li>
                                                    <Link to="/Adminpage">
                                                        <div className="icon-wrapper">
                                                            <svg className="h-5 w-5 group-hover/menu-item:text-foreground group-focus-visible/menu-item:text-foreground"
                                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                    strokeWidth="1.5"
                                                                    d="M5.18625 8.66531H19.5035V15.331H5.18625V8.66531Z M4 17.0007C4 16.0804 4.7461 15.3343 5.66645 15.3343H18.9984C19.9187 15.3343 20.6648 16.0804 20.6648 17.0007V20.3335C20.6648 21.2539 19.9187 22 18.9984 22H5.66646C4.7461 22 4 21.2539 4 20.3335V17.0007Z M4 3.66646C4 2.7461 4.7461 2 5.66645 2H18.9984C19.9187 2 20.6648 2.7461 20.6648 3.66645V6.99926C20.6648 7.91962 19.9187 8.66572 18.9984 8.66572H5.66646C4.7461 8.66572 4 7.91962 4 6.99926V3.66646Z"
                                                                    stroke="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="item-title">
                                                            <h3>유저 관리</h3>
                                                            <p>유저의 상태 및 정보 관리</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to='/Adminmissing'>
                                                        <div className="icon-wrapper">
                                                            <svg className="h-5 w-5 group-hover/menu-item:text-foreground group-focus-visible/menu-item:text-foreground"
                                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                    strokeWidth="1.5"
                                                                    d="M5.03305 15.8071H12.7252M5.03305 15.8071V18.884H12.7252V15.8071M5.03305 15.8071V12.7302H12.7252V15.8071M15.0419 8.15385V5.07692C15.0419 3.37759 13.6643 215.0419 8.15385V5.07692C15.0419 3.37759 13.6643 2.00001 11.956 2.00001H3.05794C1.34967 2.00001 0 3.37759 0 5.07692V8.15385M15.0419 8.15385H18.8304C20.5387 8.15385 21.8876 9.53143 21.8876 11.2308V18.7692C21.8876 20.4686 20.5387 21.8462 18.8304 21.8462H15.0419M15.0419 8.15385C15.0419 9.85319 16.3908 11.2308 18.0991 11.2308C19.8074 11.2308 21.1562 9.85319 21.1562 8.15385C21.1562 6.45452 19.8074 5.07692 18.0991 5.07692C16.3908 5.07692 15.0419 6.45452 15.0419 8.15385Z"
                                                                    stroke="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="item-title">
                                                            <h3>실종자 관리</h3>
                                                            <p>등록된 실종자의 관리</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </div>
                        <button className="menu__toggle" onClick={toggleMenu}>
                            <svg
                                className="h-6 w-6 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                {isMenuOpen ? (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6ZM5 12C4.44772 12 4 12.4477 4 13C4 13.5523 4.44772 14 5 14H19C19.5523 14 20 13.5523 20 13C20 12.4477 19.5523 12 19 12H5ZM5 18C4.44772 18 4 18.4477 4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18H5Z"
                                    />
                                ) : (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6ZM5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5ZM5 18C4.44772 18 4 17.5523 4 17C4 16.4477 4.44772 16 5 16H19C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18H5Z"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {isLoggedIn && (
                    <div className="user__actions">
                        <button className="logout__button" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </div>
                )}
            </header>
            {isModalOpen && (
                <div className="modal__background">
                    <div className="modal__content">
                        <button className="modal__close" onClick={handleModalClose}>
                            &times;
                        </button>
                        <h2>알림 업데이트 완료</h2>
                        <p>알림 상태가 업데이트되었습니다.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NevBar;

