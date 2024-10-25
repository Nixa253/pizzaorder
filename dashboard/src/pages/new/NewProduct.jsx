import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../components/datatable/axiosInstance';

const NewProduct = ({ title }) => {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    more: [],
    link: "",
    availableSizes: [],
    availableCrusts: [],
    defaultToppings: []
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories and toppings
    Promise.all([
      axiosInstance.get('/categories'),
      axiosInstance.get('/toppings')
    ]).then(([categoriesResponse, toppingsResponse]) => {
      setCategories(categoriesResponse.data);
      setToppings(toppingsResponse.data);
    }).catch(error => console.error('Error fetching data:', error));

    // If productId exists, fetch product data
    if (productId) {
      axiosInstance.get(`/product/${productId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            name: data.name || "",
            description: data.description || "",
            price: data.price ? data.price.toString() : "",
            image: data.image || "",
            category: data.category._id || "",
            more: data.more || [],
            link: data.link || "",
            availableSizes: data.availableSizes || [],
            availableCrusts: data.availableCrusts || [],
            defaultToppings: data.defaultToppings.map(topping => topping._id) || []
          });
        })
        .catch(error => console.error('Error fetching product:', error));
    }
  }, [productId]);

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
            type="checkbox"
            name="category"
            value={category._id}
            checked={inputs.category === category._id}
            onChange={handleCategoryChange}
          />
          {category.nameCategory}
        </label>
        {category.children.length > 0 && renderCategoryTree(category.children, level + 1)}
      </div>
    ));
  };

  const renderToppingsTree = (toppings) => {
    return toppings.map(topping => (
      <div key={topping._id}>
        <label>
          <input
            type="checkbox"
            name="defaultToppings"
            value={topping._id}
            checked={inputs.defaultToppings.includes(topping._id)}
            onChange={handleToppingsChange}
          />
          {topping.name}
        </label>
      </div>
    ));
  };

  const handleCategoryChange = (e) => {
    setInputs(prev => ({
      ...prev,
      category: e.target.checked ? e.target.value : ""
    }));
  };

  const handleToppingsChange = (e) => {
    const { value, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      defaultToppings: checked
        ? [...prev.defaultToppings, value]
        : prev.defaultToppings.filter(id => id !== value)
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!inputs.name.trim()) formErrors.name = "Tên sản phẩm là bắt buộc";
    if (!inputs.description.trim()) formErrors.description = "Mô tả là bắt buộc";
    if (!inputs.price || isNaN(inputs.price)) formErrors.price = "Giá hợp lệ là bắt buộc";
    if (!inputs.image.trim()) formErrors.image = "URL hình ảnh là bắt buộc";
    if (!inputs.category) formErrors.category = "Danh mục là bắt buộc";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      ...inputs,
      price: parseFloat(inputs.price),
      dateadded: new Date()
    };

    const apiCall = productId
      ? axiosInstance.put(`/updateProduct/${productId}`, productData)
      : axiosInstance.post('/createProduct', productData);

    apiCall
      .then(() => {
        navigate("/products");
      })
      .catch(error => {
        console.error('Error submitting product:', error);
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

  const handleArrayInputChange = (e, field) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{productId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h1>
        </div>
        <div className="bottom">        
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="formInput">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={inputs.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả sản phẩm"
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>

              <div className="formInput">
                <label>Giá</label>
                <input
                  type="text"
                  name="price"
                  value={inputs.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá sản phẩm"
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>

              <div className="formInput">
                <label>URL hình ảnh</label>
                <input
                  type="text"
                  name="image"
                  value={inputs.image}
                  onChange={handleInputChange}
                  placeholder="Nhập URL hình ảnh"
                />
                {errors.image && <span className="error">{errors.image}</span>}
              </div>

              <div className="formInput">
                <label>Danh mục</label>
                <div className="categoryTree">
                  {renderCategoryTree(createCategoryHierarchy(categories))}
                </div>
                {errors.category && <span className="error">{errors.category}</span>}
              </div>

              <div className="formInput">
                <label>Liên kết</label>
                <input
                  type="text"
                  name="link"
                  value={inputs.link}
                  onChange={handleInputChange}
                  placeholder="Nhập liên kết sản phẩm"
                />
              </div>

              <div className="formInput">
                <label>Thông tin thêm (ngăn cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  name="more"
                  value={inputs.more.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'more')}
                  placeholder="Nhập thông tin thêm (ngăn cách bằng dấu phẩy)"
                />
              </div>

              <div className="formInput">
                <label>Kích thước có sẵn (ngăn cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  name="availableSizes"
                  value={inputs.availableSizes.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'availableSizes')}
                  placeholder="Nhập kích thước có sẵn (ngăn cách bằng dấu phẩy)"
                />
              </div>

              <div className="formInput">
                <label>Vỏ bánh có sẵn (ngăn cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  name="availableCrusts"
                  value={inputs.availableCrusts.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'availableCrusts')}
                  placeholder="Nhập vỏ bánh có sẵn (ngăn cách bằng dấu phẩy)"
                />
              </div>

              <div className="formInput">
                <label>Toppings mặc định</label>
                <div className="toppingsTree">
                  {renderToppingsTree(toppings)}
                </div>
              </div>

              <button type="submit">{productId ? "Cập nhật" : "Gửi"}</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;