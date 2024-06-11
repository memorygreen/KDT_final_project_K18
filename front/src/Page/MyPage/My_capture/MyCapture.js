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
        <div>
            {captures.map(capture => (
                <div key={capture.CAPTURE_IDX}>
                    <img src={capture.CAPTURE_PATH} alt={capture.MISSING_NAME} />
                </div>
            ))}
        </div>
    )
}
export default MyCapture;