import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../components/datatable/axiosInstance';

const NewOrder = ({ title }) => {
  const [inputs, setInputs] = useState({
    iduser: "",
    listorder: [],
    price: "",
    dateadded: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users and products
    Promise.all([
      axiosInstance.get('/users'),
      axiosInstance.get('/getAllProduct')
    ]).then(([usersResponse, productsResponse]) => {
      setUsers(usersResponse.data);
      setProducts(productsResponse.data);
    }).catch(error => console.error('Error fetching data:', error));

    if (orderId) {
      axiosInstance.get(`/orders/${orderId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            iduser: data.iduser,
            listorder: data.listorder || [],
            price: data.price.toString(),
            dateadded: new Date(data.dateadded).toISOString().split('T')[0]
          });
        })
        .catch(error => console.error('Error fetching order:', error));
    }
  }, [orderId]);

  const validateForm = () => {
    let formErrors = {};
    if (!inputs.iduser) {
      formErrors.iduser = "User is required";
    }
    if (inputs.listorder.length === 0) {
      formErrors.listorder = "At least one product is required";
    }
    if (!inputs.price.trim() || isNaN(inputs.price)) {
      formErrors.price = "Valid price is required";
    }
    if (!inputs.dateadded) {
      formErrors.dateadded = "Order date is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderData = {
      iduser: inputs.iduser,
      listorder: inputs.listorder,
      price: parseFloat(inputs.price),
      dateadded: new Date(inputs.dateadded)
    };

    const apiCall = orderId
      ? axiosInstance.put(`/updateOrder/${orderId}`, orderData)
      : axiosInstance.post('/createOrder', orderData);

    apiCall
      .then(() => {
        navigate("/orders");
      })
      .catch(error => {
        console.error('Error submitting order:', error);
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

  const handleProductChange = (index, field, value) => {
    const newListOrder = [...inputs.listorder];
    newListOrder[index] = { ...newListOrder[index], [field]: value };
    setInputs(prev => ({ ...prev, listorder: newListOrder }));
  };

  const addProduct = () => {
    setInputs(prev => ({
      ...prev,
      listorder: [...prev.listorder, { idproduct: '', quantity: 1 }]
    }));
  };

  const removeProduct = (index) => {
    setInputs(prev => ({
      ...prev,
      listorder: prev.listorder.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{orderId ? "Edit Order" : "Add New Order"}</h1>
        </div>
        <div className="bottom">        
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>User</label>
                <select
                  name="iduser"
                  value={inputs.iduser}
                  onChange={handleInputChange}
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                {errors.iduser && <span className="error">{errors.iduser}</span>}
              </div>
  
              <div className="formInput">
                <label>Total Price</label>
                <input
                  type="text"
                  name="price"
                  value={inputs.price}
                  onChange={handleInputChange}
                  placeholder="Enter total price"
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
  
              <div className="formInput">
                <label>Order Date</label>
                <input
                  type="date"
                  name="dateadded"
                  value={inputs.dateadded}
                  onChange={handleInputChange}
                />
                {errors.dateadded && <span className="error">{errors.dateadded}</span>}
              </div>
  
              <h3>Order Items</h3>
              {inputs.listorder.map((item, index) => (
                <div key={index} className="itemInput">
                  <select
                    value={item.idproduct}
                    onChange={(e) => handleProductChange(index, 'idproduct', e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    min="1"
                  />
                  <button type="button" onClick={() => removeProduct(index)}>Remove</button>
                </div>
              ))}
              {errors.listorder && <span className="error">{errors.listorder}</span>}
              <button type="button" onClick={addProduct}>Add Product</button>
  
              <button type="submit">{orderId ? "Update Order" : "Create Order"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;