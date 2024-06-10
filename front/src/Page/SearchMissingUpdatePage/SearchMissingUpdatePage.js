import React, { useEffect, useState } from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import SearchMissing from '../../Components/SearchMissing/SearchMissing'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SearchMissingUpdatePage = () => {
    const { missing_idx } = useParams(); // URL에서 cctvId를 가져옴

    const [missingData, setMissingData] = useState([]);
    const session_id = sessionStorage.getItem('userId');

    console.log("리스트 보는 페이지 세션에 담긴 user id 잘 들어왔나", session_id);

    useEffect(() => {
        // 사용자의 id를 넘겨주면 전체 실종자 가져오기
        axios.post('/getSearchMissing', { missing_idx: missing_idx, session_id:session_id })
            .then(response => {
                console.log("missing_idx 보내고 전체 missing에 대한 정보 불러오기 성공(성공)", response.data);
                setMissingData(response.data);
            })
            .catch(error => {
                console.error('missing_idx 보내고 전체 missing에 대한 정보 불러오기 실패(에러)', error);
            });
    }, [missing_idx]);

    


    return (
        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar />
            </header>
            
            <div className='Main_start'>
                    <h1>SearchMissing 수정 Page</h1>

            </div>
             
            <div className='Main_card'>
                {missingData ? <SearchMissing initialData={missingData} /> : <div>Missing Update Loading...</div>}
                {/* <SearchMissing initialData={null}/> */}
                
            </div>
        </div>
        



        
    );
};

export default SearchMissingUpdatePage;