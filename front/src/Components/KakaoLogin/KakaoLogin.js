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
                    const { token, user } = response.data; // token과 user 정보를 동시에 받아옴
                    console.log('Token:', token);
                    console.log('User:', user);
                    
                    localStorage.setItem('token', token);

                    // 사용자 id를 백엔드로 전달하고 로그인 또는 회원가입 처리
                    const loginResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/kakao/login`, {
                        id: user.id
                    });

                    if (loginResponse.data.success) {
                        // 로그인 성공 후 이동할 경로 설정
                        window.location.href = '/'; // 메인 페이지로 이동
                    } else {
                        // 팝업 창 띄워서 회원가입 또는 로그인 페이지로 이동
                        const proceedToSignup = window.confirm("회원정보가 존재하지 않습니다. 가입하시겠습니까?");
                        if (proceedToSignup) {
                            window.location.href = '/signup'; // 회원가입 페이지로 이동
                        } else {
                            window.location.href = '/login'; // 로그인 페이지로 이동
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
