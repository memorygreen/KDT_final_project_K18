// UserUpdate.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

function UserUpdate() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('userName');
    const userDob = sessionStorage.getItem('userDob');
    const userGender = sessionStorage.getItem('userGender') || 'male';
    const userPhone = sessionStorage.getItem('userPhone');

    setUserId(userId);
    setName(userName);
    setDob(userDob);
    setGender(userGender);
    setPhone(userPhone);
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.slice(0, 11).match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return phoneNumber;
  };

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };

  const handleUpdate = async () => {
    if (!name || !dob || !gender || !phone) {
      alert('모든 항목을 입력해주세요');
      return;
    }

    try {
      const sessionToken = sessionStorage.getItem('sessionToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      };

      const userId = sessionStorage.getItem('userId'); // 사용자 아이디를 가져옴

      if (userId) { // userId가 빈 문자열("")이거나 null이 아닌 경우에만 요청 보냄
        const userData = { name, dob, gender, phone };

        // 비밀번호가 입력되었을 경우에만 userData에 추가
        if (password) {
          userData.password = password;
        }

        const response = await axios.put(`/api/users/${userId}`, userData, config);

        if (response.status === 200) {
          sessionStorage.setItem('userName', name);
          sessionStorage.setItem('userDob', dob);
          sessionStorage.setItem('userGender', gender);
          sessionStorage.setItem('userPhone', phone);
          setMessage('회원정보가 성공적으로 수정되었습니다');
        } else {
          setMessage('회원정보 수정 중 오류가 발생했습니다');
        }
      } 
    } catch (error) {
      setMessage('회원정보 수정 중 오류가 발생했습니다');
      console.error('Error updating user:', error);
    }
  };
  

  return (
    <div>
      <NevBar />
      <div className="container">
        <h1>회원정보 수정</h1>
        {message && <p className="error-message">{message}</p>}
        <form>
          <div>
            <label>회원 아이디:</label>
            <input type="text" value={userId} readOnly />
          </div>
          {password !== undefined && (
          <div>
            <label>비밀번호:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        )}
          <div>
            <label>사용자 이름:</label>
            <input type="text" value={name} maxLength="15" onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label>생년월일:</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
          </div>
          <div>
            <label>성별:</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div>
            <label>연락처:</label>
            <input type="tel" value={phone} onChange={handlePhoneChange} maxLength="13" />
          </div>
          <button type="button" onClick={handleUpdate}>확인</button>
          <button type="button" onClick={() => navigate('/')}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default UserUpdate;
