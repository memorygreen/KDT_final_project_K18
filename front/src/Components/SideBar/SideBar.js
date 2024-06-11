import React, { useState, useRef } from 'react';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';
import logoutIcon from './assets/logoutIcon.png'
import Notifications from './assets/Notifications.png'
import Settings from './assets/Settings.png'
import Dashboard from './assets/Dashboard.png'
import profile from './assets/profile.jpg'
import logo from './assets/logo.png'
// import NotificationModal from '../ReportCk/NotificationModal';
const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate(); // 네비게이션 함수

    const handleExpandClick = () => {
        setIsCollapsed(!isCollapsed);
    };


    const handleSearchFocus = () => {
        setIsCollapsed(false);
    };
    const handleLogout = () => {
        sessionStorage.removeItem('userId'); // 세션 값 삭제
        setIsLoggedIn(false); // 로그인 상태 업데이트
        navigate('/Login'); // 로그인 페이지로 이동
    };
   
    const toggleNotificationModal = () => {
        setIsNotificationModalOpen(!isNotificationModalOpen);
    };
    
    
    

    const handleNotificationsClick = async () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            console.error('User is not logged in');
            return;
        }
        try {
            // 모달 열기
            toggleNotificationModal();
        } catch (error) {
            console.error('Error handling dashboard click:', error);
        }
    };
    return (<div className="all_sidebar">
        <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} ref={sidebarRef}>
            <div className="sidebar-top-wrapper">
                <div className="sidebar-top">
                    <a href="#" className="logo__wrapper">
                        <img src={logo} alt="Logo" className="logo-small" />
                        <span className={`company-name ${isCollapsed ? 'hide' : ''}`}>
                            Where's Willy?
                        </span>
                    </a>
                </div>
                <button className="expand-btn" type="button" onClick={handleExpandClick}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-labelledby="exp-btn"
                        role="img"
                    >
                        <title id="exp-btn">Expand/Collapse Menu</title>
                        <path
                            d="M6.00979 2.72L10.3565 7.06667C10.8698 7.58 10.8698 8.42 10.3565 8.93333L6.00979 13.28"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <div className="search__wrapper">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-labelledby="search-icon"
                    role="img"
                >
                    <title id="search-icon">Search</title>
                    <path
                        d="M9 9L13 13M5.66667 10.3333C3.08934 10.3333 1 8.244 1 5.66667C1 3.08934 3.08934 1 5.66667 1C8.244 1 10.3333 3.08934 10.3333 5.66667C10.3333 8.244 8.244 10.3333 5.66667 10.3333Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <input type="text" aria-labelledby="search-icon" onFocus={handleSearchFocus} />
            </div>
            <div className="sidebar-links">
                <ul>
                    <li>
                        <a href="#dashboard" title="Dashboard" className="sidebar_tooltip" >
                            <img src={Dashboard} alt="logout" width="24" height="24" />
                            <span className="link hide">Dashboard</span>
                            <span className="tooltip__content">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#settings" title="Settings" className="sidebar_tooltip" >
                            <img src={Settings} alt="logout" width="24" height="24" />
                            <span className="link hide">Settings</span>
                            <span className="tooltip__content">Settings</span>
                        </a>
                    </li>
                    <li>
                        <a href="#notifications" title="Notifications" className="sidebar_tooltip" onClick={handleNotificationsClick}>
                            <img src={Notifications} alt="logout" width="24" height="24" />
                            <span className="link hide">Notifications</span>
                            <span className="tooltip__content">Notifications</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="sidebar__profile">
                <div className="avatar__wrapper">
                    <img className="avatar" src={profile} alt="Joe Doe Picture" />
                    <div className="online__status"></div>
                </div>
                <div className="avatar__name hide">
                    <div className="user-name">Willy</div>
                    <div className="email">Where's Willy?</div>
                </div>
                    {/* {isNotificationModalOpen && <NotificationModal onClose={toggleNotificationModal} />} */}
                <button onClick={handleLogout} className='logout'> {/* Link 대신 button 사용 */}
                    <img src={logoutIcon} alt="logout" width="40" height="40" />
                </button>
            </div>
        </nav>
    </div>
    );
};

export default Sidebar;