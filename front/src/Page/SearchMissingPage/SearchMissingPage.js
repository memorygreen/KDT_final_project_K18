import React from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import SearchMissing from '../../Components/SearchMissing/SearchMissing'
const SearchMissingPage = () => {
    return (

        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar /></header>
            
            <div className='Main_start'>
                    <h1>SearchMissingPage</h1>
            </div>
            
            <div className='Main_card' >
                <SearchMissing initialData={null}/>
            </div>
        </div>
        /** */



        
    );
};

export default SearchMissingPage;