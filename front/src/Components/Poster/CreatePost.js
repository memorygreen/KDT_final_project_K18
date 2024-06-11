// CreatePost.js
import axios from 'axios';

export const createPoster = async (prompt) => {
    const userId = sessionStorage.getItem('userId'); // 세션 스토리지에서 userId 가져오기
    console.log('userId:', userId);

    if (!userId) {
        console.error('User is not logged in');
        return; // 사용자 로그인 확인
    }

    let imageURL; // imageURL을 저장할 변수 선언
    console.log(prompt);
    try {
        const response = await axios.post("http://localhost:5000/generate-image", {
            prompt,
        });
        console.log(response.data.image_url);
        imageURL = response.data.image_url; // 응답에서 imageURL 설정
    } catch (error) {
        console.error("Error generating image:", error);
        return; // 이미지 생성 중 오류 발생 시 함수 종료
    }

    // 이미지 URL이 설정된 후에만 포스터 생성 요청 실행
    if (imageURL) {
        try {
            const response = await axios.post('http://localhost:5000/create_poster', {
                user_id: userId, // user_id를 함께 전송
                poster_img_path: imageURL // 이미지 URL 전송
            });

            console.log('Poster created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating poster:', error);
            throw error; // 포스터 생성 오류 발생 시 오류를 던짐
        }
    }
};