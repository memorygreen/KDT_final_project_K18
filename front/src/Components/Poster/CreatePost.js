// CreatePost.js
import axios from 'axios';

export const createPoster = async () => {
    const userId = sessionStorage.getItem('userId'); // 세션 스토리지에서 userId 가져오기
    console.log('userId:', userId);
    
    if (!userId) {
        console.error('User is not logged in');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/create_poster', {
            user_id: userId // user_id를 함께 전송
        });

        console.log('Poster created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating poster:', error);
        throw error;
    }
};