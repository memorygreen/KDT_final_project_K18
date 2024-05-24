import React, { useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png'
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 회원가입 로직을 추가하세요.
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="background">
      <div className="centering">
        <form className="my-form" onSubmit={handleSubmit}>
          <div className="signup-welcome-row">
            <Link to="/">
              <img className="signup-welcome" alt="Logo" src={logo} />
            </Link>
            <h1>Sign Up!</h1>
          </div>
          {/* <div className="socials-row">
            <a href="#" title="Use Google">
              <img src="" alt="Google" />
              Use Google
            </a>
            <a href="#" title="Use Facebook">
              <img src="" alt="Facebook" />
              Use Facebook
            </a>
          </div> */}
          {/* <div className="divider">
            <div className="divider-line"></div>
            OR
            <div className="divider-line"></div>
          </div> */}
          <div className="my-form__content">
            <div className="text-field">
              <label htmlFor="email">Email:</label>
              <input
                aria-label="Email"
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-mail"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#A7A2CB"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                <path d="M3 7l9 6l9 -6" />
              </svg>
            </div>
            <div className="text-field">
              <label htmlFor="password">
                Password:
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your Password"
                  title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <svg
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
              </label>
            </div>
            <div className="text-field">
              <label htmlFor="confirm-password">
                Repeat Password:
                <input
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  placeholder="Repeat Password"
                  title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <svg
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
              </label>
            </div>
            <input type="submit" className="my-form__button" value="Sign-Up" />
          </div>
          <div className="my-form__actions">
            {/* <div>
              By registering you agree to our
              <a href="#" title="Reset Password">
                Terms
              </a>
              and <a href="#" title="Reset Password">Privacy</a>
            </div> */}
            <div className="my-form__signin">
              <Link to="/Login" title="Login" className='Login'>
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;