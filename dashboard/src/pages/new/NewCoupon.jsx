import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../components/datatable/axiosInstance';
import { format } from 'date-fns';

const NewVoucher = ({ title }) => {
  const [inputs, setInputs] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderValue: "",
    maximumDiscountValue: "",
    applicablePizzas: [],
    startDate: "",
    endDate: "",
    quantity: "",
    usageLimitPerAccount: 1,
    membershipTierRestrictions: [],
    discountRules: [],
    status: "active"
  });
  const [errors, setErrors] = useState({});
  const { voucherId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (voucherId) {
      axiosInstance.get(`/vouchers/${voucherId}`)
        .then(response => {
          const data = response.data;
          setInputs({
            code: data.code,
            description: data.description,
            discountType: data.discountType,
            discountValue: data.discountValue,
            minimumOrderValue: data.minimumOrderValue,
            maximumDiscountValue: data.maximumDiscountValue,
            applicablePizzas: data.applicablePizzas,
            startDate: format(new Date(data.startDate), 'dd/MM/yyyy'),
            endDate: format(new Date(data.endDate), 'dd/MM/yyyy'),
            quantity: data.quantity,
            usageLimitPerAccount: data.usageLimitPerAccount,
            membershipTierRestrictions: data.membershipTierRestrictions,
            discountRules: data.discountRules,
            status: data.status
          });
        })
        .catch(error => console.error('Error fetching voucher:', error));
    }
  }, [voucherId]);

  const validateForm = () => {
    let formErrors = {};
    if (!inputs.code.trim()) {
      formErrors.code = "Mã voucher là bắt buộc";
    }
    if (!inputs.description.trim()) {
      formErrors.description = "Mô tả là bắt buộc";
    }
    if (!inputs.discountValue) {
      formErrors.discountValue = "Giá trị giảm giá là bắt buộc";
    }
    if (!inputs.startDate) {
      formErrors.startDate = "Ngày bắt đầu là bắt buộc";
    }
    if (!inputs.endDate) {
      formErrors.endDate = "Ngày kết thúc là bắt buộc";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const voucherData = {
      code: inputs.code,
      description: inputs.description,
      discountType: inputs.discountType,
      discountValue: inputs.discountValue,
      minimumOrderValue: inputs.minimumOrderValue,
      maximumDiscountValue: inputs.maximumDiscountValue,
      applicablePizzas: inputs.applicablePizzas,
      startDate: new Date(inputs.startDate.split('/').reverse().join('-')),
      endDate: new Date(inputs.endDate.split('/').reverse().join('-')),
      quantity: inputs.quantity,
      usageLimitPerAccount: inputs.usageLimitPerAccount,
      membershipTierRestrictions: inputs.membershipTierRestrictions,
      discountRules: inputs.discountRules,
      status: inputs.status
    };

    const apiCall = voucherId
      ? axiosInstance.put(`/updateVoucher/${voucherId}`, voucherData)
      : axiosInstance.post('/createVoucher', voucherData);

    apiCall
      .then(() => {
        navigate("/vouchers");
      })
      .catch(error => {
        console.error('Error submitting voucher:', error);
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
          <h1>{voucherId ? "Chỉnh sửa Voucher" : "Thêm Voucher mới"}</h1>
        </div>
        <div className="bottom">        
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Mã Voucher</label>
                <input
                  type="text"
                  name="code"
                  value={inputs.code}
                  onChange={handleInputChange}
                  placeholder="Nhập mã voucher"
                />
                {errors.code && <span className="error">{errors.code}</span>}
              </div>

              <div className="formInput">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={inputs.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả voucher"
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>

              <div className="formInput">
                <label>Loại giảm giá</label>
                <select
                  name="discountType"
                  value={inputs.discountType}
                  onChange={handleInputChange}
                >
                  <option value="percentage">Phần trăm</option>
                  <option value="fixed">Cố định</option>
                </select>
              </div>

              <div className="formInput">
                <label>Giá trị giảm giá</label>
                <input
                  type="number"
                  name="discountValue"
                  value={inputs.discountValue}
                  onChange={handleInputChange}
                  placeholder="Nhập giá trị giảm giá"
                />
                {errors.discountValue && <span className="error">{errors.discountValue}</span>}
              </div>

              <div className="formInput">
                <label>Giá trị đơn hàng tối thiểu</label>
                <input
                  type="number"
                  name="minimumOrderValue"
                  value={inputs.minimumOrderValue}
                  onChange={handleInputChange}
                  placeholder="Nhập giá trị đơn hàng tối thiểu"
                />
              </div>

              <div className="formInput">
                <label>Giá trị giảm giá tối đa</label>
                <input
                  type="number"
                  name="maximumDiscountValue"
                  value={inputs.maximumDiscountValue}
                  onChange={handleInputChange}
                  placeholder="Nhập giá trị giảm giá tối đa"
                />
              </div>

              <div className="formInput">
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={inputs.startDate}
                  onChange={handleInputChange}
                />
                {errors.startDate && <span className="error">{errors.startDate}</span>}
              </div>

              <div className="formInput">
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={inputs.endDate}
                  onChange={handleInputChange}
                />
                {errors.endDate && <span className="error">{errors.endDate}</span>}
              </div>

              <div className="formInput">
                <label>Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  value={inputs.quantity}
                  onChange={handleInputChange}
                  placeholder="Nhập số lượng"
                />
              </div>

              <div className="formInput">
                <label>Giới hạn sử dụng mỗi tài khoản</label>
                <input
                  type="number"
                  name="usageLimitPerAccount"
                  value={inputs.usageLimitPerAccount}
                  onChange={handleInputChange}
                  placeholder="Nhập giới hạn sử dụng mỗi tài khoản"
                />
              </div>

              <div className="formInput">
                <label>Hạn chế theo hạng thành viên</label>
                <input
                  type="text"
                  name="membershipTierRestrictions"
                  value={inputs.membershipTierRestrictions}
                  onChange={handleInputChange}
                  placeholder="Nhập hạn chế theo hạng thành viên"
                />
              </div>

              <div className="formInput">
                <label>Quy tắc giảm giá</label>
                <input
                  type="text"
                  name="discountRules"
                  value={inputs.discountRules}
                  onChange={handleInputChange}
                  placeholder="Nhập quy tắc giảm giá"
                />
              </div>

              <div className="formInput">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={inputs.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Hoạt động</option>
                  <option value="expired">Hết hạn</option>
                  <option value="used">Đã sử dụng</option>
                </select>
              </div>

              <button type="submit">{voucherId ? "Cập nhật" : "Gửi"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVoucher;