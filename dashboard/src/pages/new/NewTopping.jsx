import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../components/datatable/axiosInstance';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./new.scss";

const NewTopping = ({ title }) => {
  const [inputs, setInputs] = useState({
    name: "",
    category: "",
    price: ""
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const { toppingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all categories
    axiosInstance.get('/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error('Error fetching categories:', error));

    if (toppingId) {
      axiosInstance.get(`/topping/${toppingId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            name: data.name,
            category: data.category || "",
            price: data.price
          });
        })
        .catch(error => console.error('Error fetching topping:', error));
    }
  }, [toppingId]);

  const createCategoryHierarchy = (categories) => {
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category._id] = { ...category, children: [] };
    });

    const rootCategories = [];
    categories.forEach(category => {
      if (category.parentCategory) {
        const parent = categoryMap[category.parentCategory];
        if (parent) {
          parent.children.push(categoryMap[category._id]);
        }
      } else {
        rootCategories.push(categoryMap[category._id]);
      }
    });

    return rootCategories;
  };

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map(category => (
      <div key={category._id} style={{ marginLeft: `${level * 20}px` }}>
        <label>
          <input
            type="radio"
            name="category"
            value={category._id}
            checked={inputs.category === category._id}
            onChange={handleInputChange}
          />
          {category.nameCategory}
        </label>
        {category.children.length > 0 && renderCategoryTree(category.children, level + 1)}
      </div>
    ));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!inputs.name.trim()) {
      formErrors.name = "Tên topping là bắt buộc";
    }
    if (!inputs.category.trim()) {
      formErrors.category = "Danh mục là bắt buộc";
    }
    if (!inputs.price) {
      formErrors.price = "Giá là bắt buộc";
    } else if (isNaN(inputs.price)) {
      formErrors.price = "Giá phải là một số";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const toppingData = {
      name: inputs.name,
      category: inputs.category,
      price: inputs.price
    };
  
    const apiCall = toppingId
      ? axiosInstance.put(`/updateTopping/${toppingId}`, toppingData)
      : axiosInstance.post('/createTopping', toppingData);
  
    apiCall
      .then(() => {
        navigate("/toppings");
      })
      .catch(error => {
        console.error('Error submitting topping:', error);
  
        // Lưu thông báo lỗi từ server vào state
        if (error.response && error.response.data && error.response.data.message) {
          setErrors(prev => ({ ...prev, serverError: error.response.data.message }));
        } else {
          setErrors(prev => ({ ...prev, serverError: 'Error submitting topping. Please try again.' }));
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">        
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Tên topping</label>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên topping"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
  
              <div className="formInput">
                <label>Danh mục</label>
                <div className="categoryTree">
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={inputs.category === ""}
                        onChange={handleInputChange}
                      />
                      Không có
                    </label>
                  </div>
                  {renderCategoryTree(createCategoryHierarchy(categories))}
                </div>
                {errors.category && <span className="error">{errors.category}</span>}
              </div>
  
              <div className="formInput">
                <label>Giá</label>
                <input
                  type="number"
                  name="price"
                  value={inputs.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá"
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
  
              {/* Hiển thị lỗi từ server */}
              {errors.serverError && <div className="error server-error">{errors.serverError}</div>}
  
              <button type="submit">Gửi</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default NewTopping;