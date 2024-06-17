import React, { useEffect, useState } from 'react';
import './NevBar.css';
import logo from "./assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoNotification from '../../Page/MyPage/My_alram/NoNotificaiton';
import alarm from './assets/noti1.png';
import fetchUnreadNotifications from './fetchUnreadNotifications';
const NevBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userCate, setUserCate] = useState(null);
    const [userAlarmCk, setUserAlarmCk] = useState(1);
    const [intervalId, setIntervalId] = useState(null); // interval ID를 위한 상태 변수
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태를 위한 상태 변수
    const [notiIcon, setNotiIcon] = useState('alarm_imgOff');
    const [unreadNotifications, setUnreadNotifications] = useState(0); // 알림 개수 상태 추가
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const session = sessionStorage.getItem('userId');
        const sessionUserCate = sessionStorage.getItem('userCate');
        setIsLoggedIn(session ? true : false);
        setUserCate(sessionUserCate);

        const fetchData = () => {
            axios.post('http://localhost:5000/userInfoOne', { user_id: session })
                .then(response => {
                    setUserAlarmCk(response.data.USER_ALARM_CK);
                    if (userAlarmCk === 0 && intervalId) {
                        clearInterval(intervalId);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                });
        };
        const id = setInterval(fetchData, 10000); // 5초마다 fetchData 함수 실행
        setIntervalId(id);
        return () => {
            clearInterval(id); // 컴포넌트 언마운트 시 clearInterval
        };
    }, []);

    useEffect(() => {
        if (userAlarmCk === 0) {
            setNotiIcon('alarm_imgOn');
        } else {
            setNotiIcon('alarm_imgOff');
        }
    }, [userAlarmCk]);

    const updateAlarmStatus = (userId) => {
        axios.post('http://localhost:5000/updateAlarm', { user_id: userId })
            .then(response => {
                setUserAlarmCk(1); // 사용자 알람 상태를 1로 업데이트
                setIsModalOpen(true);
            })
            .catch(error => {
                console.error('Error updating alarm status:', error);
            });
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate('/Login');
    };

    const handleNotificationClick = () => {
        // 모달 열기
        setIsModalOpen(true);
        ckNoti();
        fetchUnreadNotifications().then(unreadCount => {
            setUnreadNotifications(unreadCount);
        });
    };

    const handleModalClose = () => {
        // 모달 닫기
        setIsModalOpen(false);
    };

    const ckNoti = () => {
        const userId = sessionStorage.getItem('userId');
        axios.post('http://localhost:5000/updateAlarm', { user_id: userId })
            .then(response => {
                setNotiIcon('alarm_imgOff'); //알림 이미지 정지로 변경
                setUserAlarmCk(1); // 사용자 알람 상태를 1로 업데이트
            })
            .catch(error => {
                console.error('Error updating alarm status:', error);
            });
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
                                    <li>
                                        {/* MyPage link replaced with button */}
                                        <Link to="/MyPage" className="link-button">MyPage</Link>
                                    </li>
                                    <li><Link to='/SearchMissingPage'>실종자등록</Link></li>
                                    {/* <a onClick={() => updateAlarmStatus(sessionStorage.getItem('userId'))}>
                                            {userAlarmCk === 1 ? '' : '알림'}
                                    </a> */}
                                    <li>
                                        <img src={alarm} alt="Notification Icon" className={notiIcon} onClick={() => {
                                            if (!isModalOpen) {
                                                handleNotificationClick();
                                            } else {
                                                handleModalClose();
                                            }
                                        }} />
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
                                                                    d="M5.03305 15.8071H12.7252M5.03305 15.8071V18.884H12.7252V15.8071M5.03305 15.8071V12.7302H12.7252V15.8071M15.0419 8.15385V5.07692C15.0419 3.37759 13.6643 2 11.965 2C10.2657 2 8.88814 3.37759 8.88814 5.07692V8.15385M5 11.2307L5 18.9231C5 20.6224 6.37757 22 8.07689 22H15.769C17.4683 22 18.8459 20.6224 18.8459 18.9231V11.2307C18.8459 9.53142 17.4683 8.15385 15.769 8.15385L8.07689 8.15385C6.37757 8.15385 5 9.53142 5 11.2307Z"
                                                                    stroke="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="item-title">
                                                            <h3>실종자 관리</h3>
                                                            <p>실종자의 상태 및 정보 관리</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to='/Admincctv'>
                                                        <div className="icon-wrapper">
                                                            <svg className="h-5 w-5 group-hover/menu-item:text-foreground group-focus-visible/menu-item:text-foreground"
                                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                    strokeWidth="1.5"
                                                                    d="M20.4997 12.1386V9.15811L14.8463 3.53163H6.43717C5.57423 3.53163 4.87467 4.23119 4.87467 5.09413V9.78087M20.4447 9.13199L14.844 3.53125L14.844 7.56949C14.844 8.43243 15.5436 9.13199 16.4065 9.13199L20.4447 9.13199ZM7.12729 9.78087H4.83398C3.97104 9.78087 3.27148 10.4804 3.27148 11.3434V19.1559C3.27148 20.8818 4.67059 22.2809 6.39648 22.2809H18.8965C20.6224 22.2809 22.0215 20.8818 22.0215 19.1559V13.7011C22.0215 12.8381 21.3219 12.1386 20.459 12.1386H10.8032C10.3933 12.1386 9.99969 11.9774 9.70743 11.6899L8.22312 10.2296C7.93086 9.94202 7.53729 9.78087 7.12729 9.78087Z"
                                                                    stroke="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="item-title">
                                                            <h3>CCTV 관리</h3>
                                                            <p>CCTV 상태 및 정보 관리</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </div>
                        {isLoggedIn && (
                            <div>
                                <button onClick={handleLogout} className="primary">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    <button aria-label="Open menu" className="burger-menu" type="button" onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width="24"
                            height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 6l16 0" />
                            <path d="M4 12l16 0" />
                            <path d="M4 18l16 0" />
                        </svg>
                    </button>
                </div>
            </header>
            {isModalOpen &&
                <div className='noti_div'>
                    <div>
                        읽지 않은 알람 <span style={{ color: 'red' }}>{unreadNotifications}</span>개가 있습니다.
                    </div>
                    <Link to='/MyPage'> 페이지이동 </Link>
                </div>
            }
        </div>
    );
};

export default NevBar;
