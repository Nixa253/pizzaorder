import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

import ErrorBoundary from './ErrorBoundary';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { format } from 'date-fns';


const Orderstable = () => {
  const [state, setState] = useState({
    orders: [],
    selectedRows: [],
    permissions: [],
    isLoading: true,
    confirmDialog: { isOpen: false, title: '', content: '' },
    alert: { isOpen: false, message: '', severity: 'info' }
  });

  const checkPermission = useCallback((permissions, action) => {
    return permissions.some(permission => 
      permission.controller.toLowerCase() === 'ordercontroller' && 
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

      const [ordersResponse, permissionsResponse] = await Promise.all([
        axiosInstance.get('/orders'),
        axiosInstance.get(`/groupPermission/${userGroup}`)
      ]);

      const orders = ordersResponse.data;
      const permissions = permissionsResponse.data.groupPermissions;

      setState(prevState => ({
        ...prevState,
        orders: Array.isArray(orders) ? orders : [],
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
      'Confirm Deletion',
      'Are you sure you want to delete this order?'
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: () => performDelete(id) } }));
  }, []);

  const performDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteOrder/${id}`);
      setState(prevState => ({
        ...prevState,
        orders: prevState.orders.filter((order) => order._id !== id),
        alert: { isOpen: true, message: 'Order deleted successfully', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting order:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Error deleting order. Please try again.', severity: 'error' }
      }));
    }
  };

  const handleBulkDelete = () => {
    if (state.selectedRows.length === 0) {
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'No orders selected for deletion', severity: 'warning' }
      }));
      return;
    }
    openConfirmDialog(
      'Confirm Bulk Deletion',
      `Are you sure you want to delete ${state.selectedRows.length} selected orders?`
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: performBulkDelete } }));
  };

  const performBulkDelete = async () => {
    try {
      await axiosInstance.post('/bulkDeleteOrders', { ids: state.selectedRows });
      setState(prevState => ({
        ...prevState,
        orders: prevState.orders.filter((order) => !state.selectedRows.includes(order._id)),
        selectedRows: [],
        alert: { isOpen: true, message: 'Selected orders deleted successfully', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting orders:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Error deleting orders. Please try again.', severity: 'error' }
      }));
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'iduser', headerName: 'ID User', width: 250 },
    { field: 'price', headerName: 'Total Amount', width: 160 },
    { field: 'dateadded', headerName: 'Order Date', width: 220 ,
      valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy')

    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {checkPermission(state.permissions, 'update') && (
              <Link to={`/orders/edit/${params.row._id}`} className="editButton">
                Edit
              </Link>
            )}
            {checkPermission(state.permissions, 'delete') && (
              <div
                className="deleteButton"
                onClick={() => handleDelete(params.row._id)}
              >
                Delete
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
          Orders
          {checkPermission(state.permissions, 'create') && (
            <Link to="/orders/new" className="link">
              Add New
            </Link>
          )}
          {checkPermission(state.permissions, 'delete') && (
            <div className="linkDelete" onClick={handleBulkDelete}>
              Delete Selected
            </div>
          )}
        </div>
        <DataGrid
          className="datagrid"
          rows={state.orders}
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
            <Button onClick={closeConfirmDialog}>Cancel</Button>
            <Button onClick={() => {
              state.confirmDialog.onConfirm();
              closeConfirmDialog();
            }} autoFocus>
              Confirm
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

export default Orderstable;