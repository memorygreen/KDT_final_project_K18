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

        // 컴포넌트가 언마운트될 때 overflow 속성을 원래대로 되돌립니다.
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFirstReportClick = () => {
        setShowReportForm(!showReportForm);
        setShowFirstButton(false); // 버튼을 숨기도록 설정
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
        setShowFirstButton(true); // 접기 버튼을 누를 때 제보하기1 버튼 다시 나타나게
    };

    return (
        <div className="modal_backdrop" onClick={onClose}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal_close-btn">
                    <img src={closeIcon} alt="Close" />
                </button>
                {selectedArticle && (
                    <figure className='Card_modal'>
                        <img src={selectedArticle.POSTER_INFO.POSTER_IMG_PATH} alt="sample87" />
                        <figcaption>
                            <h2>{selectedArticle.MISSING_NAME}</h2>
                            <p>{selectedArticle.description}</p>
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
                                            <div>발견장소 :</div>
                                            <div>
                                                <input
                                                    name="location"
                                                    value={reportDetails.location}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className='missing_report_form'>
                                            <div>발견시간 :</div>
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
                                            <div>특이사항 :</div>
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
                        </figcaption>
                    </figure>
                )}
            </div>
        </div>
    );
};

export default CardModal;
