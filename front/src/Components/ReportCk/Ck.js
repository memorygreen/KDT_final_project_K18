//Ck.js
import axios from 'axios';

export const Ck = async (userId) => {
    
    
    if (!userId) {
        console.error('User is not logged in');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/my_capture', {
            user_id: userId // user_id를 함께 전송
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
   
        console.log('captureCk successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error captureCk:', error);
        throw error;
    }
};


