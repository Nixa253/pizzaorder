import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

const Permissionstable = () => {
  const { groupId } = useParams();
  const [permissions, setPermissions] = useState([]);
  const [groupPermissions, setGroupPermissions] = useState([]);

  useEffect(() => {
    axiosInstance.get('/permissions')
      .then(response => {
        const data = response.data;
        console.log('API response for permissions:', data);
        if (data && Array.isArray(data.permissions)) {
          setPermissions(data.permissions);
        } else {
          console.error('API response does not contain a valid permissions array:', data);
          setPermissions([]);
        }
      })
      .catch(error => console.error('Error fetching permissions:', error));

    axiosInstance.get(`/groupPermission/${groupId}`)
      .then(response => {
        const data = response.data;
        console.log('API response for group permissions:', data);
        if (data && Array.isArray(data.groupPermissions)) {
          setGroupPermissions(data.groupPermissions);
        } else {
          console.error('API response does not contain a valid group permissions array:', data);
          setGroupPermissions([]);
        }
      })
      .catch(error => console.error('Error fetching group permissions:', error));
  }, [groupId]);

  const handlePermissionClick = (permissionId, controller, action, isGranted) => {
    if (!isGranted) {
      axiosInstance.post('/createGroupPermission', {
        groupId,
        permissionId,
        controller,
        action
      })
      .then(response => setGroupPermissions([...groupPermissions, response.data.groupPermission]))
      .catch(error => console.error(error));
    } else {
      const groupPermission = groupPermissions.find(gp => gp.permissionId === permissionId);
      if (groupPermission) {
        axiosInstance.delete(`/deleteGroupPermission/${groupPermission._id}`)
          .then(() => setGroupPermissions(groupPermissions.filter(gp => gp._id !== groupPermission._id)))
          .catch(error => console.error(error));
      }
    }
  };

  const handleDelete = (id) => {
    setPermissions(permissions.filter((item) => item._id !== id));
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 300 },
    { field: 'controller', headerName: 'Controller', width: 300 },
    { field: 'action', headerName: 'Action Permission', width: 260,  
        renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.action}`}>
            {params.row.action}
          </div>
        );
      },}, 
    {
        field: "actions",
        headerName: "Action",
        width: 300,
        renderCell: (params) => {
        const isGranted = groupPermissions.some(gp => gp.permissionId === params.row._id);

          return (
            <div className="cellAction">
            <div
            className={isGranted ? 'grantedButton' : 'grantButton'}
            onClick={() => handlePermissionClick(params.row._id, params.row.controller, params.row.action, isGranted)}
          >
            {isGranted ? 'Hủy cấp quyền' : 'Cấp quyền'}
            </div>
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
        Permissions
        <Link to="/permissons/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={permissions}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Permissionstable;