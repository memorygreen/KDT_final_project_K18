import React, { useState, useEffect } from 'react';
import './Admincctv.css'; // 여기에서 경로와 파일 이름이 일치하도록 합니다.
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const Admincctv = () => {
    const [cctv, setCctv] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGroup, setCurrentGroup] = useState(1);
    const [searchField, setSearchField] = useState(''); // 검색 필드 상태 변수
    const [searchText, setSearchText] = useState(''); // 검색 텍스트 상태 변수
    const [showModal, setShowModal] = useState(false); // 모달 상태 변수 추가
    const [newCctv, setNewCctv] = useState({ latitude: '', longitude: '', location: '', status: '' }); // 새로운 CCTV 상태 변수
    const [validationError, setValidationError] = useState(''); // 유효성 검사 에러 메시지 상태 변수
    const itemsPerPage = 25; // 25개씩 출력
    const pagesPerGroup = 10; // 10페이지씩 출력
    const searchOptions = ['번호', '위도', '경도', '설치장소', '상태']; // 검색 옵션
    const statusOptions = ['Active', 'Break', 'Stop']; // 상태 옵션

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

    // CCTV 상태 변경 
    const handle_cctv = (chg_cctvidx, chg_cctv) => {
        axios.post('/user_cctv_change', { chg_cctvidx, chg_cctv })
            .then(response => {
                console.log(`cctv 상태 : `, response.data);
                setCctv(cctv.map(item =>
                    item.CCTV_IDX === chg_cctvidx ? { ...item, CCTV_STATUS: chg_cctv } : item
                ));
            })
            .catch(error => {
                console.error(error);
            });
    };

    // 검색 
    const handleSearch = () => {
        axios.get('/Admincctv')
            .then(response => {
                const filteredData = response.data.filter(item => {
                    switch (searchField) {
                        case '번호':
                            return item.CCTV_IDX.toString() === searchText;
                        case '위도':
                            return item.CCTV_LAT.toString().includes(searchText);
                        case '경도':
                            return item.CCTV_LNG.toString().includes(searchText);
                        case '설치장소':
                            return item.CCTV_LOAD_ADDRESS.includes(searchText);
                        case '상태':
                            return item.CCTV_STATUS === searchText;
                        default:
                            return true;
                    }
                });
                setCctv(filteredData);
                setCurrentPage(1); // 검색 후 첫 페이지로 이동
                setCurrentGroup(1); // 검색 후 첫 그룹으로 이동
            })
            .catch(error => console.error('Error fetching CCTV data:', error));
    };

    // 엔터키 
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // 모달 열기 
    const openModal = () => {
        setShowModal(true);
    };

    // 모달 닫기 
    const closeModal = () => {
        setShowModal(false);
        setValidationError(''); // 모달 닫을 때 유효성 검사 에러 메시지 초기화
    };

    // 새로운 CCTV 입력
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCctv({ ...newCctv, [name]: value });
    };

    // 새로운 CCTV 생성
    const handleCreateCctv = (e) => {
        e.preventDefault();
        const { latitude, longitude, location, status } = newCctv;

        // 값이 입력되었는지 확인
        if (!latitude || !longitude || !location || !status) {
            setValidationError('모든 값을 입력해주세요.');
            return;
        }

        axios.post('/create_cctv', newCctv)
            .then(response => {
                console.log(response.data.message);
                setShowModal(false);
                setNewCctv({ latitude: '', longitude: '', location: '', status: '' });
                axios.get('/Admincctv')
                    .then(response => setCctv(response.data))
                    .catch(error => console.error('에러', error));
            })
            .catch(error => {
                console.error('에러', error);
            });
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

                <button className='create' type='button' onClick={openModal}>+ 생성</button>

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
                                <td>
                                    <select
                                        value={item.CCTV_STATUS}
                                        onClick={e => e.stopPropagation()}
                                        onChange={(e) => handle_cctv(item.CCTV_IDX, e.target.value)}
                                    >
                                        {statusOptions.map((status, index) => (
                                            <option key={index} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td> 
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
                <div className="search-bar">
                    <select value={searchField} onChange={e => setSearchField(e.target.value)}>
                        <option value="">선택</option>
                        {searchOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="검색어 입력"
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>

                {showModal && (
                    <div className="CCTV_modal">
                        <div className="CCTV_modal-content">
                            <span className="CCTV_close" onClick={closeModal}>&times;</span>
                            <h2>새 CCTV 생성</h2>
                            {validationError && <p className="error">{validationError}</p>}
                            <form onSubmit={handleCreateCctv}>
                                <label>
                                    위도 :
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={newCctv.latitude}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    경도 :
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={newCctv.longitude}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    설치장소 :
                                    <input
                                        type="text"
                                        name="location"
                                        value={newCctv.location}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    상태 :
                                    <select
                                        name="status"
                                        value={newCctv.status}
                                        onChange={handleInputChange}
                                    >
                                        {statusOptions.map((status, index) => (
                                            <option key={index} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <button type="submit">생성</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admincctv;
