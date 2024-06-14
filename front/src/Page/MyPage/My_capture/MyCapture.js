import axios from "axios";
import { useEffect, useState } from "react";


const MyCapture = ({ sessionId,missingIdx }) => {
    const [captures, setCaptures] = useState([]);
    const missing_idx = missingIdx;

    useEffect(() => {
        axios.post('/get_captures_by_missing', {
            session_id: sessionId,
            missing_idx:missing_idx,
        })
            .then(response => {
                console.log('실종자idx 넘기기 성공:', response.data);
                alert("실종자 idx 넘기기성공")
            })
            .catch(error => {
                alert("실종자 idx 넘기기 실패")
                console.error('실종자 idx 넘기기 실패')

            });
  
    }, [missing_idx]);

    return (
        <div className="Mypage_capture_all">
            
            안녕
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '10px' }}>

            {captures.map(capture => (
                <div key={capture.CAPTURE_IDX}>
                    <img src={capture.CAPTURE_PATH} alt={capture.MISSING_NAME} />
                </div>
            ))}
        </div>

            {/* user가 가진 전체 캡처 나오게 하기*/}





        </div>
    )
}
export default MyCapture;