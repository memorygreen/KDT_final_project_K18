import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const KakaoLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    const fetchToken = async () => {
      try {
        if (code) {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/kakao/callback?code=${code}`);
          const { token, user } = response.data;
          console.log('Token:', token);
          console.log('User:', user);

          sessionStorage.setItem('token', token);

          const loginResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/kakao/login`, {
            id: user.id
          });

          if (loginResponse.data.success) {
            // 로그인 성공 시 메인 페이지로 이동
            sessionStorage.setItem('userId', user.id);
            navigate('/');
          } else {
            // 기타 오류 처리
            console.error('Error during login:', loginResponse.data.message);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    // 현재 URL에 코드가 포함되어 있는 경우에만 fetchToken 함수 실행
    if (code) {      
      fetchToken();
    }
  }, [location.search, navigate]);

  return null; // 해당 컴포넌트는 화면에 아무것도 렌더링하지 않으므로 null 반환
};

export default KakaoLogin;
