import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserUpdate.css'; 

function UserUpdate() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [deletePassword, setDeletePassword] = useState(''); // 탈퇴 확인용 비밀번호
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // 탈퇴 확인 UI 표시 여부
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('userName');
    const userDob = sessionStorage.getItem('userBrtDt');
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
        const userData = { password };
        console.log('Sending user data:', userData);

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

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = async () => {
    if (!deletePassword) {
      alert('탈퇴 확인을 위해 비밀번호를 입력해주세요');
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

      const response = await axios.post('/VerifyPassword', { userId, password: deletePassword }, config);

      if (response.status === 200 && response.data.valid) {
        if (window.confirm('등록한 회원정보가 모두 삭제됩니다. 정말 탈퇴하시겠습니까?')) {
          const deleteResponse = await axios.post('/UserDelete', { userId, password: deletePassword }, config);

          if (deleteResponse.status === 200) {
            alert('회원탈퇴가 완료되었습니다.');
            sessionStorage.clear();
            navigate('/');
          } else {
            alert('회원탈퇴 중 오류가 발생했습니다.');
          }
        }
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('회원탈퇴 중 오류가 발생했습니다.');
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <div className="container_update">
        <h1 className='h1_update'>회원정보 수정</h1>
        {message && <p className="error-message">{message}</p>}
        <form className='form_update'>
          <hr />
          <div className="input-container_update">
            <label>회원 아이디</label>
            <input type="text" value={userId} readOnly />
          </div>
          <div className="input-container_update">
            <label>사용자 이름</label>
            <input type="text" value={name} readOnly />
          </div>
          <div className="input-container_update">
            <label>생년월일</label>
            <input type="date" value={dob} readOnly />
          </div>
          <div className="input-container_update">
            <label>성별</label>
            <input type="text" value={gender} readOnly />
          </div>
          <div className="input-container_update">
            <label>연락처</label>
            <input type="tel" value={phone} onChange={handlePhoneChange} maxLength="13" />
          </div>
          <div className="input-container_update">
            <label>새 비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div className="button-container_update">
            <button type="button" className="button_update" onClick={handleUpdate}>확인</button>
            <button type="button" className="button_update" onClick={() => navigate('/')}>취소</button>
            <button type="button" className="button_update" onClick={handleDeleteClick}>탈퇴</button>
          </div>
          
          {showDeleteConfirmation && (
            <div className="delete-confirmation">
              <label>비밀번호 확인</label>
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
              />
              <button type="button" className="button" onClick={handleDeleteConfirmation}>탈퇴확인</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UserUpdate;
