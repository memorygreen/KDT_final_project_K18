import React from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import ViewCCTV from '../../Components/ViewCCTV/ViewCCTV';

// 자영 (240605) CCTV 상세보기 페이지 
const ViewCCTVPage = () => {

    return (

        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar /></header>
            
            <div className='Main_start'>
                    
            </div>
            
            <div className='Main_card' >
               <ViewCCTV />
            </div>
        </div>
        /** */



        
    );
};

export default ViewCCTVPage;