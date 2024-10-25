import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

import ErrorBoundary from './ErrorBoundary';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';

const Categoriestable = () => {
  const [state, setState] = useState({
    categories: [],
    selectedRows: [],
    permissions: [],
    isLoading: true,
    confirmDialog: { isOpen: false, title: '', content: '' },
    alert: { isOpen: false, message: '', severity: 'info' }
  });

  const checkPermission = useCallback((permissions, action) => {
    return permissions.some(permission => 
      permission.controller.toLowerCase() === 'categorycontroller' && 
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

      const [categoriesResponse, permissionsResponse] = await Promise.all([
        axiosInstance.get('/categories'),
        axiosInstance.get(`/groupPermission/${userGroup}`)
      ]);

      const categories = categoriesResponse.data;
      const permissions = permissionsResponse.data.groupPermissions;

      setState(prevState => ({
        ...prevState,
        categories: Array.isArray(categories) ? categories : [],
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
      'Bạn có chắc chắn muốn xóa danh mục này không?'
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: () => performDelete(id) } }));
  }, []);

  const performDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteCategory/${id}`);
      setState(prevState => ({
        ...prevState,
        categories: prevState.categories.filter((category) => category._id !== id),
        alert: { isOpen: true, message: 'Xóa danh mục thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa danh mục. Vui lòng thử lại.', severity: 'error' }
      }));
    }
  };

  const performBulkDelete = useCallback(async () => {
    try {
      await axiosInstance.post('/bulkDeleteCategories', { ids: state.selectedRows });
      setState(prevState => ({
        ...prevState,
        categories: prevState.categories.filter((category) => !state.selectedRows.includes(category._id)),
        selectedRows: [],
        alert: { isOpen: true, message: 'Xóa danh mục thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting categories:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa danh mục. Vui lòng thử lại.', severity: 'error' }
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
      `Bạn có chắc chắn muốn xóa ${state.selectedRows.length} danh mục đã chọn không?`
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: performBulkDelete } }));
  }, [state.selectedRows, performBulkDelete]);

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'nameCategory', headerName: 'Tên danh mục', width: 250 },
    { field: 'type', headerName: 'Loại', width: 150 },
    { 
      field: 'parentCategory', 
      headerName: 'Danh mục cha', 
      width: 250,
      valueGetter: (params) => params.row.parentCategory ? params.row.parentCategory.nameCategory : 'Không có'
    },
    { field: 'image', headerName: 'URL hình ảnh', width: 500 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {checkPermission(state.permissions, 'update') && (
              <Link to={`/categories/edit/${params.row._id}`} className="editButton">
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
          Danh mục
          {checkPermission(state.permissions, 'create') && (
            <Link to="/categories/new" className="link">
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
          rows={state.categories}
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

export default Categoriestable;