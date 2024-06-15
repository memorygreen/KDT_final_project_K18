import React, { useState, useEffect } from 'react';
import closeIcon from '../assets/xxx.png';
import axios from 'axios'; // Import Axios
import './CardModal.css'; // 모달 스타일이 필요하면 추가

const CardModal = ({ isOpen, onClose, selectedArticle }) => {
    const [showReportForm, setShowReportForm] = useState(false);
    const [showFirstButton, setShowFirstButton] = useState(true);
    const [reportDetails, setReportDetails] = useState({
        location: '',
        time: '',
        details: ''
    });
    console.log(selectedArticle);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // 모달이 열리면 스크롤 비활성화
        } else {
            document.body.style.overflow = 'auto'; // 모달이 닫히면 스크롤 활성화
            // 상태 초기화
            setShowReportForm(false);
            setShowFirstButton(true);
            setReportDetails({
                location: '',
                time: '',
                details: ''
            });
        }

        // 컴포넌트가 언마운트될 때 overflow 속성을 원��로 되돌립니다.
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFirstReportClick = () => {
        setShowReportForm(true); // 제보 양식을 보여주도록 설정
        setShowFirstButton(false); // 초기 버튼을 숨기도록 설정
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportDetails({
            ...reportDetails,
            [name]: value
        });
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();
        // POST request to submit form data
        axios.post('/report', {
            POSTER_IDX: selectedArticle.POSTER_INFO.POSTER_IDX, // Assuming you have access to selectedArticle.POSTER_INFO.POSTER_IDX
            REPORT_SIGHTING_PLACE: reportDetails.location,
            REPORT_SIGHTING_TIME: reportDetails.time,
            REPORT_ETC: reportDetails.details
        })
            .then(response => {
                console.log('Report submitted successfully:', response.data);
                setShowReportForm(false);
                onClose(); // 모달을 닫고 싶으면 추가
                // 감사멘트 추가하기
            })
            .catch(error => {
                console.error('Error submitting report:', error);
                // Handle error
            });
    };

    const handleCloseForm = () => {
        setShowReportForm(false);
        setShowFirstButton(true); // 접기 버튼을 누를 때 제보하기1 버튼 다�� 나타나게
    };

    const missingInfoDetails = [
        { label: '이름', value: selectedArticle.MISSING_NAME },
        { label: '나이', value: selectedArticle.MISSING_AGE },
        { label: '성별',  value: selectedArticle.MISSING_GENDER === 'male' ? '남자' : selectedArticle.MISSING_GENDER === 'female' ? '여자' : selectedArticle.MISSING_GENDER },
        { label: '상의 타입', value: selectedArticle.MISSING_CLOTHES[0].MISSING_TOP_KOR },
        { label: '상의 색상', value: selectedArticle.MISSING_CLOTHES[0].MISSING_TOP_COLOR_KOR },
        { label: '하의 타입', value: selectedArticle.MISSING_CLOTHES[0].MISSING_BOTTOMS_KOR },
        { label: '하의 색상', value: selectedArticle.MISSING_CLOTHES[0].MISSING_BOTTOMS_COLOR_KOR },
        { label: '마지막 위치', value: selectedArticle.MISSING_LOCATION }
    ];
    
    return (
        <div className="modal_backdrop" onClick={onClose}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal_close-btn">
                    <img src={closeIcon} alt="Close" />
                </button>
                {selectedArticle && (
                    <figure className='Card_modal'>
                        <div className='Card_missingInfo'>
                            <div className='Card_missingInfo_title'>실종자 정보</div>
                            <div className='Card_imgs'>
                                <div className='card_img'>
                                    <img src={selectedArticle.POSTER_INFO.POSTER_IMG_PATH} alt="Poster Image" />
                                </div>
                                <div className='card_img'>
                                    <img src={selectedArticle.MISSING_IMG} alt="Missing Image" />
                                </div>
                            </div>
                            {showFirstButton && (
                                <div className='Card_missingInfo_details'>
                                    {missingInfoDetails.map((detail, index) => (
                                        <div key={index} className='Card_missingInfo_detail'>
                                            <div>{detail.label}</div>
                                            <div>{detail.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="button-group">
                                {showFirstButton && (
                                    <button onClick={handleFirstReportClick} className="follow">
                                        제보하기
                                    </button>
                                )}
                                {showReportForm && (
                                    <form className='missing_report' onSubmit={handleReportSubmit}>
                                        <hr />
                                        <div className='missing_report_form'>
                                            <div>발견장소</div>
                                            <div>
                                                <input
                                                    name="location"
                                                    value={reportDetails.location}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className='missing_report_form'>
                                            <div>발견시간</div>
                                            <div>
                                                <input
                                                    type='datetime-local'
                                                    name="time"
                                                    value={reportDetails.time}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className='missing_report_form'>
                                            <div>특이사항</div>
                                            <div>
                                                <input
                                                    name="details"
                                                    value={reportDetails.details}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="report_submit">전송하기</button>
                                        <button type="button" className="report_cancel" onClick={handleCloseForm}>접기</button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </figure>
                )}
            </div>
        </div>
    );
};

export default CardModal;
