import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useParams, useLocation } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

const Permissionstable = () => {
  const { groupId } = useParams();
  const location = useLocation();
  const showGrantButton = location.state?.showGrantButton || false;
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
      .catch(error => console.error('Lỗi khi lấy quyền:', error));

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
      .catch(error => console.error('Lỗi khi lấy quyền nhóm:', error));
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

  const columns = useMemo(() => {
    const baseColumns = [
      { field: '_id', headerName: 'ID', width: 300 },
      { field: 'controller', headerName: 'Controller', width: 300 },
      { field: 'action', headerName: 'Quyền hành động', width: 260,  
        renderCell: (params) => {
          return (
            <div className={`cellWithStatus ${params.row.action}`}>
              {params.row.action}
            </div>
          );
        },
      },
    ];

    if (showGrantButton) {
      baseColumns.push({
        field: "actions",
        headerName: "Hành động",
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
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [showGrantButton, groupPermissions]);

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Quyền
        {showGrantButton && (
          <Link to="/permissions/new" className="link">
            Thêm mới
          </Link>
        )}
      </div>
      <DataGrid
        className="datagrid"
        rows={permissions}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Permissionstable;