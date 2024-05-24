import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const KakaoLogin = () => {
    const location = useLocation();
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        console.log(code);
        const fetchToken = async () => {
            try {
                if (code) {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/kakao/callback?code=${code}`);
                    const token = response.data;
                    console.log('Token:', token);
                    localStorage.setItem('token', token);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchToken();
    }, [location.search]); // Include 'location.search' in the dependency array

    // ...
};

export default KakaoLogin;