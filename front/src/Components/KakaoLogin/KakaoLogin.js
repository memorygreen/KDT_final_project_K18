import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const KakaoLogin = () => {
  const location = useLocation();

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
            window.location.href = '/';
          } else {
            // 비회원일 경우 회원가입 페이지로 이동
            window.location.href = '/signup';
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchToken();
  }, [location.search]);

  return null;
};

export default KakaoLogin;
