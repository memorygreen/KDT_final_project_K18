// CaptureDetail.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaptureDetail = ({ capture, onClose }) => {
    const [cctvAddress, setCctvAddress] = useState('');

    useEffect(() => {
        const fetchCctvAddress = async () => {
            try {
                const response = await axios.post('http://localhost:5000/capture_address', {
                    cctv_idx: capture.CCTV_IDX
                });
                setCctvAddress(response.data.CCTV_LOAD_ADDRESS);
            } catch (error) {
                console.error('CCTV 주소 가져오기 실패:', error);
            }
        };

        fetchCctvAddress();
    }, [capture.CCTV_IDX]);

    return (
        <div className="modal-detail">
            <div>
                <p>캡쳐 CCTV: CCTV{capture.CCTV_IDX}</p>
                <p>캡쳐 장소: {cctvAddress || '주소 불러오는 중...'}</p>
                <p>캡쳐 시간: {capture.CAPTURE_FIRST_TIME}</p>
                <img src={capture.CAPTURE_PATH} alt="Capture" style={{ maxWidth: '100%' }} />
            </div>
            <button onClick={onClose}>닫기</button>
        </div>
    );
};

export default CaptureDetail;