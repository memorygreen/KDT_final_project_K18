import axios from "axios";
import { useEffect, useState } from "react";
import './MyCapture.css';


const MyCapture = ({ sessionId, missingIdx }) => {
    const [captures, setCaptures] = useState([]);

    const fetchUserCaptures = () => {
        axios.post('/get_user_captures', {
            user_id: sessionId,
        })
            .then(response => {
                setCaptures(response.data);
            })
            .catch(error => {
                console.error('실종자 idx 넘기기 실패')
            });
    };
    useEffect(() => {
        fetchUserCaptures();
    }, []);

    useEffect(() => {
        if (missingIdx) {
            axios.post('/get_captures_by_missing', {
                MISSING_IDX: missingIdx,
            })
                .then(response => {
                    setCaptures(response.data);
                })
                .catch(error => {
                    console.error('Error fetching capture data:', error);
                });
        }
    }, [missingIdx]);

    return (
        <div className="Mypage_capture_all">
            <div className="Mypage_capture_all_title" onClick={fetchUserCaptures}>
                캡처 목록
            </div>
            <div className="Mypage_capture_all_grid" >
                {captures.map(capture => (
                    <div className="Mypage_capture_all_grid_item" key={capture.CAPTURE_IDX}>
                        <img src={capture.CAPTURE_PATH} alt={capture.MISSING_NAME} />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default MyCapture;