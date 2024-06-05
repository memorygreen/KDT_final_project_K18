import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewCCTV = () => {
    const { cctvId } = useParams(); // URL에서 cctvId를 가져옴
    const [cctvUrl, setCctvUrl] = useState('');

    useEffect(() => {
        console.log("CCTV_IDX : ", cctvId);

        // cctvId 를 백에 넘기고 그 값에 해당하는 CCTV 영상 db에서  url 불러오는 코드 
        const fetchCCTVData = async () => {
            try {
                const response = await axios.post('/getCCTVurl', {
                    cctv_idx: cctvId,
                });
                console.log('데이터 백으로 보내기 성공:', response.data);
                if (response.data && response.data.length > 0) {
                    setCctvUrl(response.data[0].CCTV_PATH); // 데이터 상태를 설정
                }
            } catch (error) {
                console.error('Error fetching CCTV URL:', error);
            }
        };

        fetchCCTVData();
    }, [cctvId]); // cctvId가 변경될 때마다 실행

    return (
        <div>
            {cctvUrl ? (
                <video controls width="80%">
                    <source src={cctvUrl} type="video/mp4" />
                </video>
            ) : (
                <p>Loading video...</p>
            )}
        </div>
    );
};

export default ViewCCTV;
