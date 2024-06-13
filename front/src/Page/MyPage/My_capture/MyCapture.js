import { useEffect, useState } from "react";


const MyCapture = ({ sessionId }) => {
    const [captures, setCaptures] = useState([]);

    useEffect(() => {
        fetch('/get_user_captures', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: JSON.stringify({ user_id: sessionId })
        })
            .then(response => response.json())
            .then(data => setCaptures(data))
            .catch(error => console.error('Error fetching user captures:', error));
    }, [sessionId]);

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