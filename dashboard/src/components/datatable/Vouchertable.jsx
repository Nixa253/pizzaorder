import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

import ErrorBoundary from './ErrorBoundary';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { format } from 'date-fns';

const Vouchertable = () => {
  const [state, setState] = useState({
    vouchers: [],
    selectedRows: [],
    permissions: [],
    isLoading: true,
    confirmDialog: { isOpen: false, title: '', content: '' },
    alert: { isOpen: false, message: '', severity: 'info' }
  });

  const checkPermission = useCallback((permissions, action) => {
    return permissions.some(permission => 
      permission.controller.toLowerCase() === 'vouchercontroller' && 
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

      const [vouchersResponse, permissionsResponse] = await Promise.all([
        axiosInstance.get('/vouchers'),
        axiosInstance.get(`/groupPermission/${userGroup}`)
      ]);

      const vouchers = vouchersResponse.data;
      const permissions = permissionsResponse.data.groupPermissions;

      setState(prevState => ({
        ...prevState,
        vouchers: Array.isArray(vouchers) ? vouchers : [],
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
      'Bạn có chắc chắn muốn xóa voucher này?'
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: () => performDelete(id) } }));
  }, []);

  const performDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteVoucher/${id}`);
      setState(prevState => ({
        ...prevState,
        vouchers: prevState.vouchers.filter((voucher) => voucher._id !== id),
        alert: { isOpen: true, message: 'Xóa voucher thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Lỗi khi xóa voucher:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa voucher. Vui lòng thử lại.', severity: 'error' }
      }));
    }
  };

  const performBulkDelete = useCallback(async () => {
    try {
      await axiosInstance.post('/bulkDeleteVouchers', { ids: state.selectedRows });
      setState(prevState => ({
        ...prevState,
        vouchers: prevState.vouchers.filter((voucher) => !state.selectedRows.includes(voucher._id)),
        selectedRows: [],
        alert: { isOpen: true, message: 'Xóa nhiều voucher thành công', severity: 'success' }
      }));
    } catch (error) {
      console.error('Lỗi khi xóa nhiều voucher:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Lỗi khi xóa nhiều voucher. Vui lòng thử lại.', severity: 'error' }
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
      'Xác nhận xóa nhiều',
      `Bạn có chắc chắn muốn xóa ${state.selectedRows.length} voucher đã chọn?`
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: performBulkDelete } }));
  }, [state.selectedRows, performBulkDelete]);

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'code', headerName: 'Mã', width: 150 },
    { field: 'description', headerName: 'Mô tả', width: 200 },
    { field: 'discountType', headerName: 'Loại giảm giá', width: 150 },
    { field: 'discountValue', headerName: 'Giá trị giảm giá', width: 150 },
    { field: 'minimumOrderValue', headerName: 'Giá trị đơn hàng tối thiểu', width: 180 },
    { field: 'maximumDiscountValue', headerName: 'Giá trị giảm giá tối đa', width: 200 },
    { 
      field: 'startDate', 
      headerName: 'Ngày bắt đầu', 
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy')
    },
    { 
      field: 'endDate', 
      headerName: 'Ngày kết thúc', 
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy')
    },
    { field: 'quantity', headerName: 'Số lượng', width: 120 },
    { field: 'usageLimitPerAccount', headerName: 'Giới hạn sử dụng mỗi tài khoản', width: 200 },
    { field: 'usedCount', headerName: 'Số lần đã sử dụng', width: 120 },
    { field: 'status', headerName: 'Trạng thái', width: 120 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {checkPermission(state.permissions, 'update') && (
              <Link to={`/vouchers/edit/${params.row._id}`} className="editButton">
                Chỉnh sửa
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
          Vouchers
          {checkPermission(state.permissions, 'create') && (
            <Link to="/vouchers/new" className="link">
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
          rows={state.vouchers}
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

export default Vouchertable;