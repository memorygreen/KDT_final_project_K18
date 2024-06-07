import React from 'react'
import SearchMissingUpdatePage from '../SearchMissingUpdatePage/SearchMissingUpdatePage'
import NevBar from '../../Components/NevBar/NevBar';

export const MyPage = () => {

    //missing id 받는 곳

    const sessionId = sessionStorage.getItem('userId') // session에 있는 id 값 

    return (
        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar /></header>
            <div className='Main_start'>
                <h1>MyPage</h1>
            </div>

            <div className='Main_card' >
                <a href={`/ViewMissingListPage/${sessionId}`}>등록한 실종자 정보 보기</a>
            </div>
        </div >

    );
}
