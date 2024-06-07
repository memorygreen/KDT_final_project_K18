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

          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userId', user.id);
          sessionStorage.setItem('userName', user.name);

          navigate('/'); // 메인 페이지로 이동
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (code) {
      fetchToken();
    }
  }, [location.search, navigate]);

  return null; // 해당 컴포넌트는 화면에 아무것도 렌더링하지 않으므로 null 반환
};

export default KakaoLogin;
