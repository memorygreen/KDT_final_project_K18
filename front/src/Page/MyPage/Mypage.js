import React, { useEffect, useState } from 'react'
import './Mypage.css';
import Myuserinfo from './My_userinfo/Myuserinfo';
import Notification from './My_alram/Notification';
import MyCapture from './My_capture/MyCapture';
import UserUpdate from './My_modify/UserUpdate';
import NevBar from '../../Components/NevBar/NevBar';

const MyPage = () => {
    const sessionId = sessionStorage.getItem('userId') // session에 있는 id 값 
    const [activeComponent, setActiveComponent] = useState('capture'); // 기본값은 'capture'

    const handleIconClick = (component) => {
        console.log('Changing active component to:', component); // 상태 변화 로깅
        setActiveComponent(component);
    };

    const [missingIdx, setMissingIdx] = useState()


    useEffect(() => { // idx 호출이 잘 됐는지 확인하는 user effect (only 확인용)
        console.log('missing idx changed', missingIdx)
    }, [missingIdx])

    return (
        <div className="Mypages">
            <header><NevBar /></header>
            <div className='Mypage_main'>
                <div className="Mypage_container">
                    <div className='Mypage_userinfo'>
                        <Myuserinfo setMissingIdx={setMissingIdx} sessionId={sessionId} onIconClick={handleIconClick} />
                    </div>
                    <div className='Mypage_content'>
                        {activeComponent === 'capture' && (
                            <div className='Mypage_capture'>
                                <MyCapture sessionId={sessionId} missingIdx={missingIdx} />
                            </div>
                        )}
                        {activeComponent === 'update' && (
                            <div className='Mypage_modify'>
                                <UserUpdate sessionId={sessionId} />
                            </div>
                        )}
                        {activeComponent === 'notification' && (
                            <div className='Mypage_alarm'>
                                <Notification sessionId={sessionId} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default MyPage;