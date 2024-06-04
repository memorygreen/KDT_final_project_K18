import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const KakaoLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

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
            // 비회원일 경우 팝업 창 출력
            setShowPopup(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchToken();
  }, [location.search, navigate]);

  const handlePopupConfirm = (action) => {
    if (action === 'confirm') {
      // 회원가입 페이지로 이동
      navigate('/signup');
    } else {
      // 로그인 페이지로 이동
      navigate('/login');
    }
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>회원정보가 없습니다. 가입하시겠습니까?</h3>
            <div className="popup-buttons">
              <button onClick={() => handlePopupConfirm('confirm')}>예</button>
              <button onClick={() => handlePopupConfirm('cancel')}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KakaoLogin;
