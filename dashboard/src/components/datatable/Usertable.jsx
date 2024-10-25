import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

import ErrorBoundary from './ErrorBoundary';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';

const Usertable = () => {
  const [state, setState] = useState({
    users: [],
    selectedRows: [],
    permissions: [],
    isLoading: true,
    confirmDialog: { isOpen: false, title: '', content: '' },
    alert: { isOpen: false, message: '', severity: 'info' }
  });

  const checkPermission = useCallback((permissions, action) => {
    return permissions.some(permission => 
      permission.controller.toLowerCase() === 'usercontroller' && 
      permission.action.toLowerCase() === action.toLowerCase()
    );
  }, []);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const userGroup = localStorage.getItem('userGroup');
      if (!userGroup) {
        throw new Error('User group not found');
      }

      const [usersResponse, permissionsResponse] = await Promise.all([
        axiosInstance.get('/users'),
        axiosInstance.get(`/groupPermission/${userGroup}`)
      ]);

      const users = usersResponse.data;
      const permissions = permissionsResponse.data.groupPermissions;

      setState(prevState => ({
        ...prevState,
        users: Array.isArray(users) ? users : [],
        permissions: permissions,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        alert: { isOpen: true, message: 'Lỗi khi lấy dữ liệu. Vui lòng thử lại.', severity: 'error' }
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openConfirmDialog = (title, content) => {
    setState(prev => ({ ...prev, confirmDialog: { isOpen: true, title, content } }));
  };

  const closeConfirmDialog = () => {
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, isOpen: false } }));
  };

  const handleDelete = useCallback((id) => {
    openConfirmDialog(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa người dùng này không?'
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: () => performDelete(id) } }));
  }, []);

  const performDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteUser/${id}`);
      setState(prevState => ({
        ...prevState,
        users: prevState.users.filter((user) => user._id !== id),
        alert: { isOpen: true, message: 'Xóa người dùng thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting user:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa người dùng. Vui lòng thử lại.', severity: 'error' }
      }));
    }
  };

  const performBulkDelete = useCallback(async () => {
    try {
      await axiosInstance.post('/bulkDeleteUsers', { ids: state.selectedRows });
      setState(prevState => ({
        ...prevState,
        users: prevState.users.filter((user) => !state.selectedRows.includes(user._id)),
        selectedRows: [],
        alert: { isOpen: true, message: 'Xóa người dùng thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting users:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa người dùng. Vui lòng thử lại.', severity: 'error' }
      }));
    }
  }, [state.selectedRows]);
  
  const handleBulkDelete = useCallback(() => {
    if (state.selectedRows.length === 0) {
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Không có hàng nào được chọn để xóa', severity: 'warning' }
      }));
      return;
    }
  
    openConfirmDialog(
      'Xác nhận xóa hàng loạt',
      `Bạn có chắc chắn muốn xóa ${state.selectedRows.length} người dùng đã chọn không?`
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: performBulkDelete } }));
  }, [state.selectedRows, performBulkDelete]);

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'username', headerName: 'Tên đăng nhập', width: 150 },
    { field: 'nameProfile', headerName: 'Tên', width: 150 },
    { field: 'number', headerName: 'Số điện thoại', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'groupId', headerName: 'ID nhóm', width: 250 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {checkPermission(state.permissions, 'update') && (
              <Link to={`/users/edit/${params.row._id}`} className="editButton">
                Sửa
              </Link>
            )}
            {checkPermission(state.permissions, 'delete') && (
              <div
                className="deleteButton"
                onClick={() => handleDelete(params.row._id)}
              >
                Xóa
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState(prev => ({ ...prev, alert: { ...prev.alert, isOpen: false } }));
  };

  return (
    <ErrorBoundary>
      <div className="datatable">
        <div className="datatableTitle">
          Người dùng
          {checkPermission(state.permissions, 'create') && (
            <Link to="/users/new" className="link">
              Thêm mới
            </Link>
          )}
          {checkPermission(state.permissions, 'delete') && (
            <div className="linkDelete" onClick={handleBulkDelete}>
              Xóa đã chọn
            </div>
          )}
        </div>
        <DataGrid
          className="datagrid"
          rows={state.users}
          columns={columns}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
          onSelectionModelChange={(newSelection) => {
            setState(prevState => ({
              ...prevState,
              selectedRows: newSelection
            }));
          }}
          loading={state.isLoading}
        />

        <Dialog
          open={state.confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="confirmDialog"
        >
          <DialogTitle id="alert-dialog-title">{state.confirmDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {state.confirmDialog.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog}>Hủy</Button>
            <Button onClick={() => {
              state.confirmDialog.onConfirm();
              closeConfirmDialog();
            }} autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={state.alert.isOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={state.alert.severity} sx={{ width: '100%' }}>
            {state.alert.message}
          </Alert>
        </Snackbar>
      </div>
    </ErrorBoundary>
  );
};

export default Usertable;