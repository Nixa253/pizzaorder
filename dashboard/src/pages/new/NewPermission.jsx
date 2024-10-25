import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../components/datatable/axiosInstance';

const NewPermission = ({ title }) => {
  const [inputs, setInputs] = useState({
    controller: "",
    action: ""
  });
  const [errors, setErrors] = useState({});
  const { permissionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (permissionId) {
      axiosInstance.get(`/permission/${permissionId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            controller: data.controller,
            action: data.action
          });
        })
        .catch(error => console.error('Lỗi khi lấy quyền:', error));
    }
  }, [permissionId]);

  const validateForm = () => {
    let formErrors = {};
    if (!inputs.controller.trim()) {
      formErrors.controller = "Controller là bắt buộc";
    }
    if (!inputs.action.trim()) {
      formErrors.action = "Action là bắt buộc";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const permissionData = {
      controller: inputs.controller,
      action: inputs.action
    };

    const apiCall = permissionId
      ? axiosInstance.put(`/updatePermission/${permissionId}`, permissionData)
      : axiosInstance.post('/createPermission', permissionData);

    apiCall
      .then(() => {
        navigate("/permissions");
      })
      .catch(error => {
        console.error('Lỗi khi gửi quyền:', error);
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
                <label>Controller</label>
                <input
                  type="text"
                  name="controller"
                  value={inputs.controller}
                  onChange={handleInputChange}
                  placeholder="Nhập tên controller"
                />
                {errors.controller && <span className="error">{errors.controller}</span>}
              </div>

              <div className="formInput">
                <label>Action</label>
                <input
                  type="text"
                  name="action"
                  value={inputs.action}
                  onChange={handleInputChange}
                  placeholder="Nhập tên hàng động"
                />
                {errors.action && <span className="error">{errors.action}</span>}
              </div>

              <button type="submit">Gửi</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPermission;