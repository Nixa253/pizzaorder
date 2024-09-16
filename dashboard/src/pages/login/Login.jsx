import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
      navigate('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please enter your credentials to login</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="forgot-password">Forgot password?</p>
      </div>
    </div>  
  );
};

export default Login;