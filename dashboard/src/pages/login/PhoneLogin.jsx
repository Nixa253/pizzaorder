import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./phoneLogin.scss"; // Import file SCSS mới

const PhoneLogin = () => {
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate(); 

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      // Thay đổi số 0 đứng đầu thành +84
      const formattedNumber = number.startsWith('0') ? '+84' + number.slice(1) : number;
      await axios.post('http://localhost:5000/sendOtp', { number: formattedNumber });
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError('Không thể gửi OTP. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // Thay đổi số 0 đứng đầu thành +84
      const formattedNumber = number.startsWith('0') ? '+84' + number.slice(1) : number;
      const res = await axios.post('http://localhost:5000/verifyOtp', { number: formattedNumber, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userGroup', res.data.user.groupId);
      navigate('/home');
    } catch (err) {
      setError('Xác thực OTP thất bại. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Đăng nhập bằng SĐT</h2>
        <div className="otp-login">
          <input
            type="text"
            placeholder="Số điện thoại"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <button onClick={handleSendOtp} disabled={loading || otpSent}>
            {loading ? 'Đang gửi OTP...' : 'Gửi OTP'}
          </button>
          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button onClick={handleVerifyOtp} disabled={loading}>
                {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </button>
            </>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>  
  );
};

export default PhoneLogin;