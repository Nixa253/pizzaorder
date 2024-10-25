import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const Datatable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/readGroups')
      .then(response => {
        const data = response.data;
        console.log('API response:', data); 
        if (data && Array.isArray(data.group)) {
          setData(data.group);
        } else {
          console.error('API response does not contain a valid group array:', data);
          setData([]); 
        }
      })
      .catch(error => console.error('Lỗi khi lấy nhóm:', error));
  }, []);

  const handlePermissionClick = (groupId) => {
    navigate(`/permissions/${groupId}`, { state: { showGrantButton: true } });
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'name', headerName: 'Tên', width: 200 },
    { field: 'description', headerName: 'Mô tả', width: 400 },
    {
      field: "action",
      headerName: "Hành động",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">          
            <div
              className="permissionButton"
              onClick={() => handlePermissionClick(params.row._id)}
            >
              Cấp quyền
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Group
        {/* <Link to="/group/new" className="link">
          Thêm mới
        </Link> */}
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;