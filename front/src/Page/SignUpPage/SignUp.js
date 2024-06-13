import React, { useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import logo from './assets/logo_black.png'

const Signup = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      id,
      password,
      confirm_password: confirmPassword,
      name,
      dob,
      gender,
      phone,
    };

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // 성공적으로 회원가입 후 로그인 페이지로 리다이렉트
        window.location.href = '/Login';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    let formattedValue = value.replace(/\D/g, ''); // 숫자가 아닌 모든 문자 제거
    if (formattedValue.length > 3 && formattedValue.length <= 7) {
      formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3);
    } else if (formattedValue.length > 7) {
      formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3, 7) + '-' + formattedValue.slice(7, 11);
    }
    setPhone(formattedValue); // 상태 업데이트
  };


  return (
    <div className="background">
      <div className="centering">
        <form className="my-form" onSubmit={handleSubmit}>
          <div className="signup-welcome-row">
            <Link to="/">
              <img className="signup-welcome" alt="Logo" src={logo} />
            </Link>
            <h1>회원가입</h1>
          </div>
          <div className="my-form__content">
            <div className="text-field">
              <label htmlFor="id">아이디</label>
              <input
                aria-label="ID"
                type="text"
                id="id"
                name="id"
                placeholder="사용하실 아이디를 입력해주세요."
                autoComplete="off"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="text-field">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="사용하실 비밀번호를 영어+숫자 6글자 이상 입력해주세요."
                title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-field">
              <label htmlFor="confirm-password">비밀번호 확인</label>
              <input
                id="confirm-password"
                type="password"
                name="confirm-password"
                placeholder="다시 한 번 비밀번호를 입력해주세요."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-field">
              <label htmlFor="name">이름</label>
              <input
                aria-label="Name"
                type="text"
                id="name"
                name="name"
                placeholder="홍길동"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="text-field">
              <label htmlFor="dob">생년월일</label>
              <input
                aria-label="Date of Birth"
                type="date"
                id="dob"
                name="dob"
                placeholder="Your Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="text-field">
              <label htmlFor="phone">휴대폰 번호</label>
              <input
                aria-label="Phone Number"
                type="tel"
                id="phone"
                name="phone"
                placeholder="010-0000-0000"
                autoComplete="off"
                value={phone}
                onChange={handlePhoneChange}
                pattern="^\d{3}-\d{4}-\d{4}$"
                title="Enter phone number in 000-0000-0000 format"
                required
              />
            </div>


            {/* <div className="text-field"> */}
            <div >
              <label>성별</label>
              <div className="gender_radio_btn_div">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <label htmlFor="female">여자</label>

                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <label htmlFor="male">남자</label>
              </div>
            </div>



          </div>
          <div className="my-form__actions">
            {/* <button type="submit" className="my-form__button" >회원가입</button> */}
            <div>
              <button type="submit" className="sign_up_btn" >회원가입</button>
            </div>
            <div className="my-form__signin">
              <Link to="/Login" title="Login" className='Login'>
                로그인
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
