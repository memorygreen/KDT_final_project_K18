import React from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import SearchMissing from '../../Components/SearchMissing/SearchMissing'
const SearchMissingPage = () => {
    return (
        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar /></header>
            <div>
                <h1>SearchMissingPage</h1>
            </div>
            <div>
                <h1>이밑에는 컴포넌트</h1>
                <SearchMissing />
                
                <h1>이 위까지가 컴포넌트</h1>
            </div>

        </div>
    );
};

export default SearchMissingPage;