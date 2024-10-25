import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert } from '@mui/material';
import axiosInstance from '../../components/datatable/axiosInstance';
import ErrorBoundary from './ErrorBoundary';
import './datatable.scss';

const Toppingtable = () => {
  const [state, setState] = useState({
    toppings: [],
    selectedRows: [],
    permissions: [],
    isLoading: true,
    confirmDialog: { isOpen: false, title: '', content: '' },
    alert: { isOpen: false, message: '', severity: 'info' }
  });

  const checkPermission = useCallback((permissions, action) => {
    return permissions.some(permission => 
      permission.controller.toLowerCase() === 'toppingcontroller' && 
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

      const [toppingsResponse, permissionsResponse] = await Promise.all([
        axiosInstance.get('/getAllToppings'),
        axiosInstance.get(`/groupPermission/${userGroup}`),
        axiosInstance.get('/categories')
      ]);

      const toppings = toppingsResponse.data;
      const permissions = permissionsResponse.data.groupPermissions;

      setState(prevState => ({
        ...prevState,
        toppings: Array.isArray(toppings) ? toppings : [],
        permissions: permissions,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        alert: { isOpen: true, message: 'Error fetching data. Please try again.', severity: 'error' }
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
      'Bạn có chắc chắn muốn xóa topping này không?'
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: () => performDelete(id) } }));
  }, []);

  const performDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteTopping/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting topping:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Error deleting topping. Please try again.', severity: 'error' }
      }));
    }
  };

  const performBulkDelete = useCallback(async () => {
    try {
      await axiosInstance.post('/bulkDeleteToppings', { ids: state.selectedRows });
      fetchData();
    } catch (error) {
      console.error('Error deleting toppings:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Error deleting toppings. Please try again.', severity: 'error' }
      }));
    }
  }, [state.selectedRows, fetchData]);

  const handleBulkDelete = useCallback(() => {
    if (state.selectedRows.length === 0) {
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'No toppings selected for deletion.', severity: 'warning' }
      }));
      return;
    }
  
    openConfirmDialog(
      'Xác nhận xóa hàng loạt',
      `Bạn có chắc chắn muốn xóa ${state.selectedRows.length} topping đã chọn không?`
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: performBulkDelete } }));
  }, [state.selectedRows, performBulkDelete]);

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'name', headerName: 'Tên topping', width: 250 },
    { field: 'category', headerName: 'Danh mục', width: 250 },
    { field: 'price', headerName: 'Giá', width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {checkPermission(state.permissions, 'update') && (
              <Link to={`/toppings/edit/${params.row._id}`} className="editButton">
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
          Topping
          {checkPermission(state.permissions, 'create') && (
            <Link to="/toppings/new" className="link">
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
          rows={state.toppings}
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

export default Toppingtable;