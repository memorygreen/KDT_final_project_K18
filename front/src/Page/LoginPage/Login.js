import React, { useState } from 'react';
import './Login.css';
import Kakao_logo from './assets/Kakao_logo.png';
import logo from './assets/logo_black.png';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    password,
                }),
            });

            if (response.status === 401) {
                alert('아이디 또는 패스워드가 틀렸습니다. 다시 입력해 주세요.'); // 비밀번호 불일치
            } else if (response.status === 403) {
                alert('계정 사용이 정지된 회원입니다'); // 계정 정지된 경우 알림 메시지
            } else if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                sessionStorage.setItem('userId', data.USER_ID);
                sessionStorage.setItem('userName', data.USER_NAME);
                sessionStorage.setItem('userBrtDt', data.USER_BRT_DT);
                sessionStorage.setItem('userGender', data.USER_GENDER);
                sessionStorage.setItem('userPhone', data.USER_PHONE);
                sessionStorage.setItem('userStatus', data.USER_STATUS);
                sessionStorage.setItem('userCate', data.USER_CATE);
                window.location.href = '/'; // 메인 페이지로 이동
            } else {
                alert('로그인에 실패했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('Login error:', error.message);
        }
    }

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;

    return (
        <div className="all_login">
            <form className="my-form" onSubmit={handleSubmit}>
                <div className="login-welcome-row">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="logo" />
                    </Link>
                    <h1>환영합니다 &#x1F44F;</h1>
                    <p>아이디와 비밀번호를 입력해주세요.</p>
                </div>
                <div className="input__wrapper">
                    <input
                        type="text"
                        id="id"
                        name="id"
                        // className="in/put__field"
                        className="input_field_re"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <label htmlFor="id" className="input__label">
                        아이디
                    </label>
                    <svg
                        className="input__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                        <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
                    </svg>
                </div>
                <div className="input__wrapper">
                    <input
                        id="password"
                        type="password"
                        className="input_field_re"
                        placeholder='아이디를 입력해주세요'
                        title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="input__label">
                        비밀번호
                    </label>
                    <svg
                        className="input__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                        <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
                    </svg>
                </div>

                {/* <button type="submit" className="login_btn"> */}
                <button type="submit" className="login_btn">
                    로그인
                </button>
                {/* <div className="socials-row"> */}
                <div className="kakao_div">
                    <a href={KAKAO_AUTH_URL} title="Use Kakao">
                        <img src={Kakao_logo} alt="Kakao" />
                        카카오 로그인
                    </a>
                </div>
                <div className="my-form__actions">
                    <div className="my-form__row">
                        <span>아직 회원이 아니신가요?</span>
                        <Link to="/SignUp" className='SignUp' title="Create Account">
                            회원가입
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;