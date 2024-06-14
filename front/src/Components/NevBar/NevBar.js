import React, { useEffect, useState } from 'react';
import './NevBar.css';
import logo from "./assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const NevBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userCate, setUserCate] = useState(null);
    const [userAlarmCk, setUserAlarmCk] = useState(1);
    const [intervalId, setIntervalId] = useState(null); // interval ID를 위한 상태 변수
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const session = sessionStorage.getItem('userId');
        const sessionUserCate = sessionStorage.getItem('userCate');
        setIsLoggedIn(session ? true : false);
        setUserCate(sessionUserCate);
        if (session) {
            fetchUserInfo(session);
        }
        // 5초마다  USER_ALARM_CK값이 1일떄 업데이트 한 번씩 USER_ALARM_CK이  값을 업데이트
        const id = setInterval(() => {
            if (session && userAlarmCk === 1) {
                fetchUserInfo(session);
            }
        }, 5000);
        setIntervalId(id); // Store the interval ID

        return () => {
            clearInterval(intervalId); // Clear interval on component unmount
        };
    }, [userAlarmCk]);
    const fetchUserInfo = (userId,session) => {
        axios.post('http://localhost:5000/userInfoOne', { user_id: userId })
            .then(response => {
                setUserAlarmCk(response.data.USER_ALARM_CK);
                if (response.data.USER_ALARM_CK === 0 && intervalId) {
                    clearInterval(intervalId); // Clear interval if USER_ALARM_CK is 0
                } else if (response.data.USER_ALARM_CK === 1 && !intervalId) {
                    const id = setInterval(() => {
                        if (session && userAlarmCk === 1) {
                            fetchUserInfo(session);
                        }
                    }, 5000);
                    setIntervalId(id); // Reset interval if USER_ALARM_CK is 1
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    };
    const updateAlarmStatus = (userId) => {
        axios.post('http://localhost:5000/updateAlarm', { user_id: userId  })
            .then(response => {
                setUserAlarmCk(1); // 사용자 알람 상태를 1로 업데이트
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
                                    <a to='#' onClick={() => updateAlarmStatus(sessionStorage.getItem('userId'))}>
                                            {userAlarmCk === 1 ? '' : '알림'}
                                    </a>
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
                                                <li>
                                                    <Link to="">
                                                        <div className="icon-wrapper">
                                                            <svg className="h-5 w-5 group-hover/menu-item:text-foreground group-focus-visible/menu-item:text-foreground"
                                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                    strokeWidth="1.5"
                                                                    d="M6.6594 21.8201C8.10788 22.5739 9.75418 23 11.5 23C17.299 23 22 18.299 22 12.5C22 10.7494 21.5716 9.09889 20.8139 7.64754M16.4016 3.21191C14.9384 2.43814 13.2704 2 11.5 2C5.70101 2 1 6.70101 1 12.5C1 14.287 1.44643 15.9698 2.23384 17.4428M2.23384 17.4428C1.81058 17.96 1.55664 18.6211 1.55664 19.3416C1.55664 20.9984 2.89979 22.3416 4.55664 22.3416C6.21349 22.3416 7.55664 20.9984 7.55664 19.3416C7.55664 17.6847 6.21349 16.3416 4.55664 16.3416C3.62021 16.3416 2.78399 16.7706 2.23384 17.4428ZM21.5 5.64783C21.5 7.30468 20.1569 8.64783 18.5 8.64783C16.8432 8.64783 15.5 7.30468 15.5 5.64783C15.5 3.99097 16.8432 2.64783 18.5 2.64783C20.1569 2.64783 21.5 3.99097 21.5 5.64783ZM18.25 12.5C18.25 16.2279 15.2279 19.25 11.5 19.25C7.77208 19.25 4.75 16.2279 4.75 12.5C4.75 8.77208 7.77208 5.75 11.5 5.75C15.2279 5.75 18.25 8.77208 18.25 12.5Z"
                                                                    stroke="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="item-title">
                                                            <h3>NULL</h3>
                                                            <p>비할당 버튼</p>
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
                            <button onClick={handleLogout} className="primary">
                                Logout
                            </button>
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
        </div>
    );
};

export default NevBar;
