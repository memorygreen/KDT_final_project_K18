import React, { useState, useEffect } from 'react';
import './Admincctv.css';
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const Admincctv = () => {
    const [cctv, setCctv] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGroup, setCurrentGroup] = useState(1);
    const [searchField, setSearchField] = useState('');
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newCctv, setNewCctv] = useState({ latitude: '', longitude: '', location: '', status: '', videoUrl: '' });
    const [validationError, setValidationError] = useState('');
    const [videoModal, setVideoModal] = useState({ show: false, videoUrl: '' });
    const itemsPerPage = 25;
    const pagesPerGroup = 10;
    const searchOptions = ['번호', '설치장소', '상태'];
    const statusOptions = ['Active', 'Break', 'Stop'];

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

    const handleSearch = () => {
        axios.get('/Admincctv')
            .then(response => {
                const filteredData = response.data.filter(item => {
                    switch (searchField) {
                        case '번호':
                            return item.CCTV_IDX.toString() === searchText;
                        case '설치장소':
                            return item.CCTV_LOAD_ADDRESS.includes(searchText);
                        case '상태':
                            return item.CCTV_STATUS === searchText;
                        default:
                            return true;
                    }
                });
                setCctv(filteredData);
                setCurrentPage(1);
                setCurrentGroup(1);
            })
            .catch(error => console.error('Error fetching CCTV data:', error));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setValidationError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCctv({ ...newCctv, [name]: value });
    };

    const handleCreateCctv = async (e) => {
        e.preventDefault();
        const { latitude, longitude, location, status, videoUrl } = newCctv;

        if (!latitude || !longitude || !location || !status || !videoUrl) {
            setValidationError('모든 값을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('/create_cctv', newCctv);
            console.log(response.data.message);
            setShowModal(false);
            setNewCctv({ latitude: '', longitude: '', location: '', status: '', videoUrl: '' });
            axios.get('/Admincctv')
                .then(response => setCctv(response.data))
                .catch(error => console.error('에러', error));
        } catch (error) {
            console.error('에러', error);
        }
    };

    const openVideoModal = (videoUrl) => {
        setVideoModal({ show: true, videoUrl });
    };

    const closeVideoModal = () => {
        setVideoModal({ show: false, videoUrl: '' });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cctv.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <NevBar />
            <div className="admin_main">
                <h1>CCTV 관리 페이지</h1>
                <div className='Admin_search-bar'>
                <button className='create' type='button' onClick={openModal}>+ 생성</button>
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
                </div>
                <table className="cctv-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>위도</th>
                            <th>경도</th>
                            <th>설치장소</th>
                            <th>상태</th>
                            <th>영상 보기</th>
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
                                <td>
                                    <button onClick={() => openVideoModal(item.CCTV_PATH)}>영상 보기</button>
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
                                <label>
                                    CCTV 영상 URL :
                                    <input
                                        type="text"
                                        name="videoUrl"
                                        value={newCctv.videoUrl}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <button type="submit">생성</button>
                            </form>
                        </div>
                    </div>
                )}

                {videoModal.show && (
                    <div className="CCTV_modal">
                        <div className="CCTV_modal-content">
                            <span className="CCTV_close" onClick={closeVideoModal}>&times;</span>
                            <h2>영상 보기</h2>
                            <video width="100%" controls>
                                <source src={videoModal.videoUrl} type="video/mp4" />
                                브라우저가 video 태그를 지원하지 않습니다.
                            </video>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admincctv;
