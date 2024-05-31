import React from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Adminmanage = () => {
    const query = useQuery();
    const userId = query.get('id');
    
    return (
        <div>
            <header>
                <NevBar />
            </header>
            <div className="main">
                <h1>사용자 관리 페이지</h1>
                <p>관리할 사용자 ID: {userId}</p>
            </div>
        </div>
    );
};

export default Adminmanage;
