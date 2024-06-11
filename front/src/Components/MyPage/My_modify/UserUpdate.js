import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NevBar from '../../NevBar/NevBar';
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
    const userDob = sessionStorage.getItem('userBrtDt'); // 여기서 userBrtDt를 가져옴
    const userGender = sessionStorage.getItem('userGender') || 'male';
    const userPhone = sessionStorage.getItem('userPhone');

    setUserId(userId);
    setName(userName);
    setDob(formatDate(userDob));
    setGender(userGender);
    setPhone(userPhone);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
    if (!password) {
      alert('비밀번호를 입력해주세요');
      return;
    }
  
    try {
      const sessionToken = sessionStorage.getItem('sessionToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json'
        }
      };
  
      if (userId) {
        const userData = { password }; // 비밀번호만 포함된 객체
        console.log('Sending user data:', userData); // 전송 데이터 로그 출력
  
        const response = await axios.put(`/UserUpdate/${userId}`, userData, config);
  
        if (response.status === 200) {
          setMessage('비밀번호가 성공적으로 수정되었습니다');
        } else {
          setMessage('비밀번호 수정 중 오류가 발생했습니다');
        }
      }
    } catch (error) {
      setMessage('비밀번호 수정 중 오류가 발생했습니다');
      console.error('Error updating password:', error);
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
          <div>
            <label>사용자 이름:</label>
            <input type="text" value={name} readOnly />
          </div>
          <div>
            <label>생년월일:</label>
            <input type="date" value={dob} readOnly />
          </div>
          <div>
            <label>성별:</label>
            <input type="text" value={gender} readOnly />
          </div>
          <div>
            <label>연락처:</label>
            <input type="tel" value={phone} onChange={handlePhoneChange} maxLength="13" />
          </div>
          <div>
            <label>새 비밀번호:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="button" onClick={handleUpdate}>확인</button>
          <button type="button" onClick={() => navigate('/')}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default UserUpdate;
