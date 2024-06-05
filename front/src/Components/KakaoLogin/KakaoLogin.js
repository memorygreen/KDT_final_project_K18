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
            // 비회원일 경우 confirm 창 출력
            const proceedToSignup = window.confirm("회원정보가 존재하지 않습니다. 가입하시겠습니까?");
            if (proceedToSignup) {
              navigate('/signup'); // 회원가입 페이지로 이동
            } else {
              navigate('/login'); // 로그인 페이지로 이동
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchToken();
  }, [location.search, navigate]);

  return null; // 해당 컴포넌트는 화면에 아무것도 렌더링하지 않으므로 null 반환
};

export default KakaoLogin;
