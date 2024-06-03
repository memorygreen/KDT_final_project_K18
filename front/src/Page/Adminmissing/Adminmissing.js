import React, { useEffect, useState } from 'react';
import './Adminmissing.css'; // 여기에서 경로와 파일 이름이 일치하도록 합니다.
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const Adminmissing = () => {
    const [missingData, setMissingData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGroup, setCurrentGroup] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchText, setSearchText] = useState('');
    const itemsPerPage = 25;
    const pagesPerGroup = 10;
    const searchOptions = ['아이디', '이름'];

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const handlePreviousGroup = () => {
        setCurrentGroup(currentGroup - 1);
        setCurrentPage((currentGroup - 2) * pagesPerGroup + 1);
    };

    const handleNextGroup = () => {
        setCurrentGroup(currentGroup + 1);
        setCurrentPage(currentGroup * pagesPerGroup + 1);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const startPage = (currentGroup - 1) * pagesPerGroup + 1;
        const endPage = Math.min(startPage + pagesPerGroup - 1, Math.ceil(missingData.length / itemsPerPage));

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map(number => (
            <li
                key={number}
                id={number}
                onClick={handleClick}
                className={currentPage === number ? 'active' : null}
            >
                {number}
            </li>
        ));
    };

    useEffect(() => {
        axios.post('/Admin_mis')
        .then(response => {
            console.log(response.data); // 데이터가 올바르게 수신되었는지 확인
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
        axios.post('/poster_show_change', { poster_idx, new_show: Number(new_show) })
        .then(response => {
            console.log(response.data);
            setMissingData(missingData.map(item =>
                item.POSTER_IDX === poster_idx ? { ...item, POSTER_SHOW: Number(new_show) } : item
            ));
        }).catch(error => {
            console.error(error);
        });
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = missingData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <NevBar />
            <div>test</div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>소지품</th>
                        <th>소지품 특이사항</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>성별</th>
                        <th>나이</th>
                        <th>이미지?</th>
                        <th>위도</th>
                        <th>경도</th>
                        <th>인상착의 특이사항</th>
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
                    {currentItems.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
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
            <ul id='page-numbers'>
                {currentGroup > 1 && (
                    <li onClick={handlePreviousGroup} className='prev-group'> 이전 </li>
                )}
                {renderPageNumbers()}
                {currentGroup * pagesPerGroup < Math.ceil(missingData.length / itemsPerPage) && (
                    <li onClick={handleNextGroup} className="next-group">다음</li>
                )}
            </ul>
        </div>
    );
}

export default Adminmissing;
