import React, { useEffect, useState } from 'react';
import './NevBar.css';
import logo from "./assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoNotification from '../../Page/MyPage/My_alram/NoNotificaiton';
import alarm from './assets/noti1.png';
import fetchUnreadNotifications from './fetchUnreadNotifications';
import cctv from './assets/cctv.png';
import user from './assets/user.png';
import missing from './assets/missing.png';
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
                                                            <img src={user} alt="user" />
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
                                                            <img src={missing} alt="missing" />
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
                                                            <img src={cctv} alt="cctv" />
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
