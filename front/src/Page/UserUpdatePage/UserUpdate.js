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
    const userGender = sessionStorage.getItem('userGender') || 'male'; // 성별 값이 없는 경우 기본값으로 'male' 설정
    const userPhone = sessionStorage.getItem('userPhone');

    setUserId(userId);
    setName(userName);
    setDob(userDob);
    setGender(userGender);
    setPhone(userPhone);
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    // 숫자만 남기고 나머지 문자 제거
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    // 숫자가 11자리를 넘어가면 자르고, 숫자 3자-4자-4자 형식으로 변환
    const match = cleaned.slice(0, 11).match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return phoneNumber;
  };

  const handlePhoneChange = (e) => {
    // 입력된 전화번호 형식을 변환하여 state 업데이트
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };

  const handleUpdate = async () => {
    if (!password || !name || !dob || !gender || !phone) {
      alert('모든 항목을 입력해주세요');
      return;
    }

    try {
      await axios.put(`/api/users/${userId}`, {
        name, dob, gender, phone, password
      });

      // 회원 정보 업데이트 후 세션에 저장
      sessionStorage.setItem('userName', name);
      sessionStorage.setItem('userDob', dob);
      sessionStorage.setItem('userGender', gender);
      sessionStorage.setItem('userPhone', phone);

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
            <input type="tel" value={phone} onChange={handlePhoneChange} maxLength="13" />
            {/* maxLength 속성을 사용하여 최대 입력 가능한 길이를 13으로 설정 */}
          </div>
          <button type="button" onClick={handleUpdate}>확인</button>
          <button type="button" onClick={() => navigate('/')}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default UserUpdate;
