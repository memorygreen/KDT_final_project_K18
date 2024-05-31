import React, { useState, useEffect } from 'react';
import './UserUpdate.css';
import axios from 'axios';

function UserUpdate() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 초기 사용자 정보 가져오기
    axios.get('/api/users/1')
      .then(response => {
        const userData = response.data;
        setUser(userData);
        setName(userData.name);
        setDob(userData.dob);
        setGender(userData.gender);
        setPhone(userData.phone);
      })
      .catch(error => console.error('Error fetching user:', error));
  }, []);

  const updateUser = () => {
    // 사용자 정보 업데이트
    axios.put(`/api/users/${user.id}`, { name, dob, gender, phone })
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error updating user:', error));
  };

  const updatePassword = () => {
    // 비밀번호 업데이트
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    axios.put(`/api/users/${user.id}`, { password })
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error updating password:', error));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>User Profile Update</h1>
      <form>
        <div>
          <label>User ID:</label>
          <span>{user.user_id}</span>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        <div>
          <label>User Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <button type="button" onClick={updatePassword}>Update Password</button>
        <button type="button" onClick={updateUser}>Update User Info</button>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
}

export default UserUpdate;