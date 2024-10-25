import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import "./login.scss";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });

      console.log(response.data);
    
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userGroup', response.data.user.groupId);

      // Chuyển hướng đến trang dashboard
      navigate('/home');
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (response) => {
    const tokenId = response.credential;
    console.log(tokenId);

    try {
      const res = await axios.post('http://localhost:5000/auth/google', { token: tokenId });
      console.log(res.data.user.groupId);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userGroup', res.data.user.groupId);
      navigate('/home');
    } catch (err) {
      setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.log('Google login failed:', error);
    setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
  };

  const handleFacebookResponse = async (response) => {
    console.log(response.accessToken);
    try {
      const res = await axios.post('http://localhost:5000/auth/facebook', { accessToken: response.accessToken });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userGroup', res.data.user.groupId);
      navigate('/home');
    } catch (err) {
      if (err.response) {
        console.error('Response error:', err.response.data);
        setError(`Đăng nhập bằng Facebook thất bại: ${err.response.data.message}`);
      } else if (err.request) {
        console.error('Request error:', err.request);
        setError('Không nhận được phản hồi từ server. Vui lòng thử lại.');
      } else {
        console.error('Error:', err.message);
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Chào mừng trở lại</h2>
        <p className="subtitle">Vui lòng nhập thông tin đăng nhập của bạn</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="social-login-buttons">
          <FacebookLogin
            appId={process.env.REACT_APP_FB_CLIENT_ID}       
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookResponse}
            textButton="Đăng nhập bằng Facebook"
            cssClass="facebook-login"
          />
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Đăng nhập bằng Google"
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            cookiePolicy={'single_host_origin'}
            prompt="select_account" 
            className="google-login"
          />
        </div>
        <p className="forgot-password">Quên mật khẩu?</p>
      </div>
    </div>  
  );
};

export default Login;