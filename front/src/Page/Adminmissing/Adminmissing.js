import React, { useEffect, useState } from 'react';
import './Adminmissing.css'; // 여기에서 경로와 파일 이름이 일치하도록 합니다.
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const Adminmissing = () => {
    const [missingData, setMissingData] = useState([]);

    useEffect(() => {
        axios.post('/Admin_mis')
        .then(response => {
            setMissingData(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the data!", error);
        });
    }, []);

    const finding_change = (idx, user_id, newfinding) => {
        axios.post('/missing_finding_change', { idx, user_id, newfinding })
        .then(response => {
            console.log(response.data);
            setMissingData(missingData.map(item =>
                item.MISSING_IDX === idx && item.USER_ID === user_id ? { ...item, MISSING_FINDING: newfinding } : item
            ));
        }).catch(error => {
            console.error(error);
        });
    }

    const poster_change = (poster_idx, new_show) => {
        axios.post('/poster_show_change', { poster_idx, new_show })
        .then(response => {
            console.log(response.data);
            setMissingData(missingData.map(item =>
                item.POSTER_IDX === poster_idx ? { ...item, POSTER_SHOW: new_show } : item
            ));
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <div>
            <NevBar />
            <div>test</div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>소지품</th>
                        <th>일단킵</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>성별</th>
                        <th>나이</th>
                        <th>이미지?</th>
                        <th>위도</th>
                        <th>경도</th>
                        <th>인상착의</th>
                        <th>상의구분</th>
                        <th>상의색상</th>
                        <th>하의구분</th>
                        <th>하의색상</th>
                        <th>실종시간</th>
                        <th>실종자 찾는지 유무</th>
                        <th>게시상태</th>   
                    </tr>
                </thead>
                <tbody>
                    {missingData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.MISSING_IDX}</td>
                            <td>{item.BELONGINGS_CATE_KOR}</td>
                            <td>{item.BELONGINGS_ETC}</td>
                            <td>{item.USER_ID}</td>
                            <td>{item.MISSING_NAME}</td>
                            <td>{item.MISSING_GENDER}</td>
                            <td>{item.MISSING_AGE}</td>
                            <td>{item.MISSING_IMG}</td>
                            <td>{item.MISSING_LOCATION_LAT}</td>
                            <td>{item.MISSING_LOCATION_LON}</td>
                            <td>{item.MISSING_CLOTHES_ETC}</td>
                            <td>{item.MISSING_TOP_KOR}</td>
                            <td>{item.MISSING_TOP_COLOR_KOR}</td>
                            <td>{item.MISSING_BOTTOMS_KOR}</td>
                            <td>{item.MISSING_BOTTOMS_COLOR_KOR}</td>
                            <td>{item.POSTER_CREATED_AT}</td>
                            <td>
                                <select
                                    value={item.MISSING_FINDING}
                                    onClick={e => e.stopPropagation()}
                                    onChange={(e) => finding_change(item.MISSING_IDX, item.USER_ID, e.target.value)}>
                                    <option value="finding">finding</option>
                                    <option value="stop">stop</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    value={item.POSTER_SHOW}
                                    onClick={e => e.stopPropagation()}
                                    onChange={(e) => poster_change(item.POSTER_IDX, e.target.value)}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Adminmissing;
