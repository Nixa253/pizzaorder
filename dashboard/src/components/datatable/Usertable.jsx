import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

const Usertable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosInstance.get('/users')
      .then(response => {
        const data = response.data;
        console.log('API response for users:', data);
        if (data && Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('API response does not contain a valid users array:', data);
          setUsers([]);
        }
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDelete = (id) => {
    axiosInstance.delete(`/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'nameProfile', headerName: 'Name', width: 150 },
    { field: 'number', headerName: 'Number', width: 150 },
    { field: 'address', headerName: 'Address', width: 400 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'groupId', headerName: 'Group ID', width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/users/edit/${params.row._id}`} className="editButton">
              Edit
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
            
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Users
        <Link to="/users/new" className="link">
          Add New
        </Link>
        <Link to="/users/new" className="linkCopy">
          Copy
        </Link>
        <Link to="/users/new" className="linkDelete">
          Delete
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={users}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Usertable;