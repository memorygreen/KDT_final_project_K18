import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const ViewMissingListPage = () => {
    const user_id = sessionStorage.getItem('userId');
    const [allMissingData, setAllMissingData] = useState([]);

    console.log("리스트 보는 페이지 세션에 담긴 user id 잘 들어왔나", user_id);

    useEffect(() => {
        // 사용자의 id를 넘겨주면 전체 실종자 가져오기
        axios.post('/getAllMissing', { user_id: user_id })
            .then(response => {
                console.log("user id 보내고 전체 missing 불러오기 성공(성공)", response.data);
                setAllMissingData(response.data);
            })
            .catch(error => {
                console.error('user id 보내고 전체 missing 불러오기 실패(에러)', error);
            });
    }, [user_id]);

    return (
        <div>
            <h1>View Missing List Page</h1>
            <table border="1">
                <thead>
                    <tr>

                        <th>수정 / 삭제</th>
                        <th>USER_ID</th>
                        <th>MISSING_IDX</th>
                        <th>MISSING_NAME</th>
                        <th>BELONGINGS_CATE_KOR</th>
                        <th>BELONGINGS_ETC</th>
                        <th>MISSING_GENDER</th>
                        <th>MISSING_AGE</th>
                        <th>MISSING_IMG</th>
                        <th>MISSING_LOCATION_LAT</th>
                        <th>MISSING_LOCATION_LON</th>
                        <th>MISSING_FINDING</th>
                        <th>MISSING_CLOTHES_ETC</th>
                        <th>MISSING_TOP_KOR</th>
                        <th>MISSING_TOP_COLOR_KOR</th>
                        <th>MISSING_BOTTOMS_KOR</th>
                        <th>MISSING_BOTTOMS_COLOR_KOR</th>
                    </tr>
                </thead>
                <tbody>
                    {allMissingData.map((missing, index) => (
                        <tr key={index}>
                            <td>
                            
                            <button 
                                onClick={() => window.location.href=`/SearchMissingUpdatePage/${missing.MISSING_IDX}`}>
                            수정</button>
                                
                                <button>삭제</button>
                                
                                </td>
                            <td>{missing.USER_ID}</td>
                            <td>{missing.MISSING_IDX}</td>
                            <td><a href='#'>{missing.MISSING_NAME}</a></td>
                            <td>{missing.BELONGINGS_CATE_KOR}</td>
                            <td>{missing.BELONGINGS_ETC}</td>
                            <td>{missing.MISSING_GENDER}</td>
                            <td>{missing.MISSING_AGE}</td>
                            <td><img src={missing.MISSING_IMG} alt="Missing" width="100" /></td>
                            <td>{missing.MISSING_LOCATION_LAT}</td>
                            <td>{missing.MISSING_LOCATION_LON}</td>
                            <td>{missing.MISSING_FINDING}</td>
                            <td>{missing.MISSING_CLOTHES_ETC}</td>
                            <td>{missing.MISSING_TOP_KOR}</td>
                            <td>{missing.MISSING_TOP_COLOR_KOR}</td>
                            <td>{missing.MISSING_BOTTOMS_KOR}</td>
                            <td>{missing.MISSING_BOTTOMS_COLOR_KOR}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a href='#'>실종자 상세보기</a>
        </div>
    );
};
