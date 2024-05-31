import React, { useState } from 'react';
import './Login.css';
import Kakao_logo from './assets/Kakao_logo.png';
import logo from './assets/storeify.png';
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

            if (!response.ok) {
                alert('아이디 또는 패스워드가 틀렸습니다. 다시 입력해 주세요.'); // alert 추가
            } else if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                sessionStorage.setItem('userId', id);
                window.location.href = '/'; // 메인 페이지로 이동
            } else {
                throw new Error('Failed to log in');
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
                    <h1>Welcome back &#x1F44F;</h1>
                    <p>Please enter your details!</p>
                </div>
                <div className="input__wrapper">
                    <input
                        type="text"
                        id="id"
                        name="id"
                        className="input__field"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <label htmlFor="id" className="input__label">
                        ID
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
                        className="input__field"
                        title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="input__label">
                        Password
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
                <button type="submit" className="my-form__button">
                    Login
                </button>
                <div className="socials-row">
                    <a href={KAKAO_AUTH_URL} title="Use Kakao">
                        <img src={Kakao_logo} alt="Kakao" />
                        Log in with Kakao
                    </a>
                </div>
                <div className="my-form__actions">
                    <div className="my-form__row">
                        <span>Don't have an account?</span>
                        <Link to="/SignUp" className='SignUp' title="Create Account">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;