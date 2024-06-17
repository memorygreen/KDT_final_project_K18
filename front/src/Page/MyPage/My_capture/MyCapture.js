import axios from "axios";
import { useEffect, useState } from "react";
import './MyCapture.css';
import CaptureDetail from "./CaptureDetail";

const MyCapture = ({ sessionId, missingIdx, selectedMissing, onMissingClick }) => {
    const [captures, setCaptures] = useState([]);
    const [selectedCapture, setSelectedCapture] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [title, setTitle] = useState('전체 캡처 목록');

    const fetchUserCaptures = () => {
        axios.post('/get_user_captures', {
            user_id: sessionId,
        })
            .then(response => {
                setCaptures(response.data);
                setTitle('전체 캡처 목록');
            })
            .catch(error => {
                console.error('전체 캡처 목록 가져오기 실패', error);
            });
    };

    const fetchCapturesByMissing = (missingIdx, missingName) => {
        axios.post('/get_captures_by_missing', {
            MISSING_IDX: missingIdx,
        })
            .then(response => {
                setCaptures(response.data);
                setTitle(`${missingName} 캡처 목록`);
            })
            .catch(error => {
                console.error('특정 실종자 캡처 목록 가져오기 실패:', error);
            });
    };

    useEffect(() => {
        fetchUserCaptures();
    }, [sessionId]);

    useEffect(() => {
        if (missingIdx) {
            fetchCapturesByMissing(missingIdx, selectedMissing.MISSING_NAME);
        }
    }, [missingIdx, selectedMissing]);

    const handleCaptureClick = (capture) => {
        setSelectedCapture(capture);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
    };

    const handleTitleClick = () => {
        fetchUserCaptures();
        onMissingClick(null); // Reset selected missing person
    };

    return (
        <div className="Mypage_capture_all">
            <div className="Mypage_capture_all_title" onClick={handleTitleClick}>
                {title}
            </div>
            <div className="Mypage_capture_all_grid">
                {captures.map(capture => (
                    <div className="Mypage_capture_all_grid_item" key={capture.CAPTURE_IDX} onClick={() => handleCaptureClick(capture)}>
                        <img src={capture.CAPTURE_PATH} alt={capture.MISSING_NAME} />
                    </div>
                ))}
            </div>
            {showDetailModal && selectedCapture && (
                <CaptureDetail capture={selectedCapture} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default MyCapture;