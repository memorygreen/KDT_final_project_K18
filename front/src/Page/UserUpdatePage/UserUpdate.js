import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

function UserUpdate() {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 정보 불러오기 (로그인된 상태를 가정)
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('userName');
    const userDob = sessionStorage.getItem('userDob');
    const userGender = sessionStorage.getItem('userGender');
    const userPhone = sessionStorage.getItem('userPhone');

    setUserId(userId);
    setName(userName);
    setDob(userDob);
    setGender(userGender);
    setPhone(userPhone);
  }, []);

  const handleUpdate = async () => {
    if (!password || !name || !dob || !gender || !phone) {
      setMessage('모든 항목을 입력해주세요');
      return;
    }

    try {
      await axios.put(`/api/users/${userId}`, {
        name, dob, gender, phone, password
      });

      setMessage('회원정보가 성공적으로 수정되었습니다');
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
          <div>
            <label>비밀번호:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label>사용자 이름:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
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
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <button type="button" onClick={handleUpdate}>확인</button>
          <button type="button" onClick={() => navigate('/')}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default UserUpdate;
