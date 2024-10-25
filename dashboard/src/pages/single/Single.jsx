import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/datatable/axiosInstance";
import {jwtDecode} from "jwt-decode"; 
import { Link } from 'react-router-dom';

const Single = () => {
  const [user, setUser] = useState(null);
  const [_id, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken._id); 
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (_id) {
        try {
          const response = await axiosInstance.get(`/users/${_id}`);
          setUser(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    };

    fetchUser();
  }, [_id]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">
              <Link to={`/users/edit/${user?._id}`} className="editButton">
                Sửa
              </Link>
            </div>
            <h1 className="title">Thông tin người dùng</h1>
            {user ? (
              <div className="item">
                <img
                  src="https://haycafe.vn/wp-content/uploads/2022/03/Anh-avatar-trang-Zalo-cho-nam-ca-tinh-600x600.jpg"
                  alt=""
                  className="itemImg"
                />
                <div className="details">
                  <h1 className="itemTitle">{user.nameProfile}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{user.email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Số điện thoại:</span>
                    <span className="itemValue">{user.number}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Địa chỉ:</span>
                    <span className="itemValue">{user.address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Nhóm:</span>
                    <span className="itemValue">{user.groupId}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Đang tải...</p>
            )}
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="Chi tiêu của người dùng (6 tháng gần nhất)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Giao dịch gần đây</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;