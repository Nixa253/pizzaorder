import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    const token = localStorage.getItem('token');
      axios.get('http://localhost:5000/listCategories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setCategories(response.data); 
      })
      .catch(error => {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.error('There was an error fetching the categories!', error);
        }
      });  
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <h2>Categories:</h2>
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            <h3>{category.img}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;