import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../components/datatable/axiosInstance';

const NewCategory = ({ title }) => {
  const [inputs, setInputs] = useState({
    nameCategory: "",
    type: "",
    parentCategory: "",
    imageUrl: ""
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all categories
    axiosInstance.get('/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error('Error fetching categories:', error));

    if (categoryId) {
      axiosInstance.get(`/categories/${categoryId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            nameCategory: data.nameCategory,
            type: data.type,
            parentCategory: data.parentCategory || "",
            imageUrl: data.image 
          });
        })
        .catch(error => console.error('Error fetching category:', error));
    }
  }, [categoryId]);

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
            name="parentCategory"
            value={category._id}
            checked={inputs.parentCategory === category._id}
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
    if (!inputs.nameCategory.trim()) {
      formErrors.nameCategory = "Tên danh mục là bắt buộc";
    }
    if (!inputs.type.trim()) {
      formErrors.type = "Loại là bắt buộc";
    }
    if (!inputs.imageUrl.trim()) {
      formErrors.imageUrl = "URL hình ảnh là bắt buộc";
    } else if (!isValidUrl(inputs.imageUrl)) {
      formErrors.imageUrl = "Vui lòng nhập URL hợp lệ";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const categoryData = {
      nameCategory: inputs.nameCategory,
      type: inputs.type,
      parentCategory: inputs.parentCategory || null,
      image: inputs.imageUrl
    };
  
    const apiCall = categoryId
      ? axiosInstance.put(`/updateCategory/${categoryId}`, categoryData)
      : axiosInstance.post('/createCategory', categoryData);
  
    apiCall
      .then(() => {
        navigate("/categories");
      })
      .catch(error => {
        console.error('Error submitting category:', error);
  
        // Lưu thông báo lỗi từ server vào state
        if (error.response && error.response.data && error.response.data.message) {
          setErrors(prevErrors => ({
            ...prevErrors,
            serverError: error.response.data.message  // Lưu thông báo lỗi từ server
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            serverError: "Phân cấp danh mục không hợp lệ: một danh mục không thể là cha mẹ hoặc tổ tiên của chính nó."
          }));
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
                <label>Tên danh mục</label>
                <input
                  type="text"
                  name="nameCategory"
                  value={inputs.nameCategory}
                  onChange={handleInputChange}
                  placeholder="Nhập tên danh mục"
                />
                {errors.nameCategory && <span className="error">{errors.nameCategory}</span>}
              </div>
  
              <div className="formInput">
                <label>Loại</label>
                <input
                  type="text"
                  name="type"
                  value={inputs.type}
                  onChange={handleInputChange}
                  placeholder="Nhập loại danh mục"
                />
                {errors.type && <span className="error">{errors.type}</span>}
              </div>
  
              <div className="formInput">
                <label>Danh mục cha</label>
                <div className="categoryTree">
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="parentCategory"
                        value=""
                        checked={inputs.parentCategory === ""}
                        onChange={handleInputChange}
                      />
                      Không có
                    </label>
                  </div>
                  {renderCategoryTree(createCategoryHierarchy(categories))}
                </div>
              </div>
  
              <div className="formInput">
                <label>URL hình ảnh</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={inputs.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Nhập URL hình ảnh"
                />
                {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
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

export default NewCategory;