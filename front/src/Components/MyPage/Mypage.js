import React from 'react'
import Myuserinfo from './My_userinfo/Myuserinfo';

const MyPage = () => {
    const sessionId = sessionStorage.getItem('userId') // session에 있는 id 값 

    return (
        <div className="Mypage_container">
            <div className='Mypage_userinfo'>
            </div>
            <Myuserinfo sessionId={sessionId} />
            <div className='Mypage_capture' >
            </div>
            <div className='Mypage_modify' >
            </div>
            <div className='Mypage_alarm' >
            </div>
        </div >

    );
}

export default MyPage;