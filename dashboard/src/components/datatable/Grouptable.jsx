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
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  // const handleDelete = (id) => {
  //   setData(data.filter((item) => item._id !== id));
  // };

  const handlePermissionClick = (groupId) => {
    navigate(`/permissions/${groupId}`);
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 400 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">          
            {/* <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div> */}
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
        Add New Group
        <Link to="/group/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;