import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../components/datatable/axiosInstance';

const NewCategory = ({ title }) => {
  const [inputs, setInputs] = useState({
    nameCategory: "",
    imageUrl: ""
  });
  const [errors, setErrors] = useState({});
  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      axiosInstance.get(`/categories/${categoryId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            nameCategory: data.nameCategory,
            imageUrl: data.image 
          });
        })
        .catch(error => console.error('Error fetching category:', error));
    }
  }, [categoryId]);

  const validateForm = () => {
    let formErrors = {};
    if (!inputs.nameCategory.trim()) {
      formErrors.nameCategory = "Category name is required";
    }
    if (!inputs.imageUrl.trim()) {
      formErrors.imageUrl = "Image URL is required";
    } else if (!isValidUrl(inputs.imageUrl)) {
      formErrors.imageUrl = "Please enter a valid URL";
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
        if (error.response && error.response.data) {
          setErrors(error.response.data);
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
                <label>Category Name</label>
                <input
                  type="text"
                  name="nameCategory"
                  value={inputs.nameCategory}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                />
                {errors.nameCategory && <span className="error">{errors.nameCategory}</span>}
              </div>

              <div className="formInput">
                <label>Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={inputs.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
                {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
              </div>

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCategory;