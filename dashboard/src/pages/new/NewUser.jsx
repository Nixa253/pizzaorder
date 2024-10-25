import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../components/datatable/axiosInstance';

const NewUser = ({ title }) => {
    const [inputs, setInputs] = useState({
      username: "",
      nameProfile: "",
      number: "",
      address: "",
      email: "",
      groupId: "",
      password: ""
    });
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of groups
    axiosInstance.get('/readGroups')
      .then(response => {
        const groupsWithNames = response.data.group.map(group => ({
          ...group,
          name: group.name || 'Nhóm không tên'
        }));
        setGroups(groupsWithNames);
      })
      .catch(error => console.error('Lỗi khi lấy danh sách nhóm:', error));

    if (userId) {
      axiosInstance.get(`/users/${userId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            username: data.username,
            nameProfile: data.nameProfile,
            number: data.number,
            address: data.address,
            email: data.email,
            groupId: data.groupId,
            password: "" // Không đặt mật khẩu vì lý do bảo mật
          });
        })
        .catch(error => console.error('Lỗi khi lấy thông tin người dùng:', error));
    }
  }, [userId]);

  const validateForm = () => {
    let formErrors = {};
    if (!inputs.username.trim()) formErrors.username = "Tên đăng nhập là bắt buộc";
    if (!inputs.email.trim()) formErrors.email = "Email là bắt buộc";
    if (!inputs.email.includes('@')) formErrors.email = "Định dạng email không hợp lệ";
    if (!userId && !inputs.password.trim()) formErrors.password = "Mật khẩu là bắt buộc";
    if (!inputs.groupId) formErrors.groupId = "Nhóm là bắt buộc";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData = { ...inputs };
    if (userId) {
      delete userData.password; // Xóa mật khẩu nếu đang chỉnh sửa người dùng hiện có
    }

    const apiCall = userId
      ? axiosInstance.put(`/updateUser/${userId}`, userData)
      : axiosInstance.post('/createUser', userData);

    apiCall
      .then(() => {
        navigate("/users");
      })
      .catch(error => {
        console.error('Lỗi khi gửi thông tin người dùng:', error);
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
          <h1>{userId ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h1>
        </div>
        <div className="bottom">        
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  value={inputs.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đăng nhập"
                />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>

              <div className="formInput">
                <label>Tên</label>
                <input
                  type="text"
                  name="nameProfile"
                  value={inputs.nameProfile}
                  onChange={handleInputChange}
                  placeholder="Nhập tên"
                />
              </div>

              <div className="formInput">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="number"
                  value={inputs.number}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="formInput">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={inputs.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="formInput">
                <label>Nhóm</label>
                <select
                  name="groupId"
                  value={inputs.groupId}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn một nhóm</option>
                  {groups.map(group => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {errors.groupId && <span className="error">{errors.groupId}</span>}
              </div>

              {!userId && (
                <div className="formInput">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={inputs.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
              )}

              <button type="submit">{userId ? "Cập nhật" : "Tạo mới"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;