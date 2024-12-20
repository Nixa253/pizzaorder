import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';
import ErrorBoundary from './ErrorBoundary';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';

const Productstable = () => {
  const [state, setState] = useState({
    products: [],
    selectedRows: [],
    permissions: [],
    isLoading: true,
    confirmDialog: { isOpen: false, title: '', content: '' },
    alert: { isOpen: false, message: '', severity: 'info' }
  });

  const navigate = useNavigate();

  const checkPermission = useCallback((permissions, action) => {
    return permissions.some(permission => 
      permission.controller.toLowerCase() === 'productcontroller' && 
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

      const [productsResponse, permissionsResponse] = await Promise.all([
        axiosInstance.get('/getAllProduct'),
        axiosInstance.get(`/groupPermission/${userGroup}`)
      ]);

      const products = productsResponse.data;
      const permissions = permissionsResponse.data.groupPermissions;

      setState(prevState => ({
        ...prevState,
        products: Array.isArray(products) ? products : [],
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
      'Bạn có chắc chắn muốn xóa sản phẩm này không?'
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: () => performDelete(id) } }));
  }, []);

  const performDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteProduct/${id}`);
      setState(prevState => ({
        ...prevState,
        products: prevState.products.filter((product) => product._id !== id),
        alert: { isOpen: true, message: 'Xóa sản phẩm thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa sản phẩm. Vui lòng thử lại.', severity: 'error' }
      }));
    }
  };

  const performBulkDelete = useCallback(async () => {
    try {
      await axiosInstance.post('/bulkDeleteProducts', { ids: state.selectedRows });
      setState(prevState => ({
        ...prevState,
        products: prevState.products.filter((product) => !state.selectedRows.includes(product._id)),
        selectedRows: [],
        alert: { isOpen: true, message: 'Xóa sản phẩm thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting products:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa sản phẩm. Vui lòng thử lại.', severity: 'error' }
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
      `Bạn có chắc chắn muốn xóa ${state.selectedRows.length} sản phẩm đã chọn không?`
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: performBulkDelete } }));
  }, [state.selectedRows, performBulkDelete]);

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Tên sản phẩm', width: 200 },
    { field: 'description', headerName: 'Mô tả', width: 300 },
    { field: 'price', headerName: 'Giá', width: 100 },
    { field: 'image', headerName: 'URL hình ảnh', width: 300 },
    { 
      field: 'category', 
      headerName: 'Danh mục', 
      width: 200,
    },
    { field: 'more', headerName: 'Thêm', width: 200 },
    { field: 'link', headerName: 'Liên kết', width: 200 },
    { field: 'availableSizes', headerName: 'Kích thước có sẵn', width: 200 },
    { field: 'availableCrusts', headerName: 'Vỏ bánh có sẵn', width: 200 },
    { 
      field: 'defaultToppings', 
      headerName: 'Toppings mặc định', 
      width: 200,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {checkPermission(state.permissions, 'update') && (
              <button
                className="editButton"
                onClick={() => navigate(`/products/edit/${params.row._id}`)}
              >
                Sửa
              </button>
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
          Sản phẩm
          {checkPermission(state.permissions, 'create') && (
            <Link to="/products/new" className="link">
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
          rows={state.products}
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

export default Productstable;