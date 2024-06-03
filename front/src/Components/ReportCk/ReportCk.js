//ReportCk.js
import axios from 'axios';

export const reportCk = async (userId) => {
    
    
    if (!userId) {
        console.error('User is not logged in');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/my_report', {
            user_id: userId // user_id를 함께 전송
        });

        console.log('ReportCk successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error ReportCk:', error);
        throw error;
    }
};