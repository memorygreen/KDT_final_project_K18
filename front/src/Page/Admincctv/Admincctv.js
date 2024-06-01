import React, { useState, useEffect } from 'react';
import './Admincctv.css'; // 여기에서 경로와 파일 이름이 일치하도록 합니다.
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const Admincctv = () => {
    const [cctv, setCctv] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGroup, setCurrentGroup] = useState(1);
    const itemsPerPage = 25;
    const pagesPerGroup = 10;

    useEffect(() => {
        axios.get('/Admincctv')
            .then(response => setCctv(response.data))
            .catch(error => console.error('Error fetching CCTV data:', error));
    }, []);

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
        const endPage = Math.min(startPage + pagesPerGroup - 1, Math.ceil(cctv.length / itemsPerPage));

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

    // 현재 페이지에 맞는 CCTV 데이터를 계산합니다.
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cctv.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <NevBar />
            <div className="cctv-container">
                <h1>CCTV 관리 페이지</h1>
                <div className='btn'>
                    <button className='create'>+ 생성</button>
                </div>
                <table className="cctv-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>위도</th>
                            <th>경도</th>
                            <th>설치장소</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(item => (
                            <tr key={item.CCTV_IDX}>
                                <td>{item.CCTV_IDX}</td>
                                <td>{item.CCTV_LAT}</td>
                                <td>{item.CCTV_LNG}</td>
                                <td>{item.CCTV_LOAD_ADDRESS}</td>
                                <td>{item.CCTV_STATUS}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ul id="page-numbers">
                    {currentGroup > 1 && (
                        <li onClick={handlePreviousGroup} className="prev-group">이전</li>
                    )}
                    {renderPageNumbers()}
                    {currentGroup * pagesPerGroup < Math.ceil(cctv.length / itemsPerPage) && (
                        <li onClick={handleNextGroup} className="next-group">다음</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Admincctv;
