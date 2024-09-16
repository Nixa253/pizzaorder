import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import './datatable.scss';

// Custom Confirmation Dialog
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

// Custom Alert component for user-facing messages
import { Alert, Snackbar } from '@mui/material';

const Categoriestable = () => {
  const [state, setState] = useState({
    categories: [],
    selectedRows: [],
    permissions: {
      canDelete: false,
      canEdit: false,
      canCreate: false
    },
    isLoading: true,
    confirmDialog: { isOpen: false, title: '', content: '' },
    alert: { isOpen: false, message: '', severity: 'info' }
  });

  const checkPermission = useCallback((permissions, action) => {
    return permissions.some(permission => permission.action.toLowerCase() === action);
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
        permissions: {
          canDelete: checkPermission(permissions, 'delete'),
          canEdit: checkPermission(permissions, 'update'),
          canCreate: checkPermission(permissions, 'create')
        },
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
  }, [checkPermission]);

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
      'Are you sure you want to delete this category?'
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: () => performDelete(id) } }));
  }, []);

  const performDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteCategory/${id}`);
      setState(prevState => ({
        ...prevState,
        categories: prevState.categories.filter((category) => category._id !== id),
        alert: { isOpen: true, message: 'Category deleted successfully', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Error deleting category. Please try again.', severity: 'error' }
      }));
    }
  };

  const handleBulkDelete = useCallback(() => {
    if (state.selectedRows.length === 0) {
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'No rows selected for deletion', severity: 'warning' }
      }));
      return;
    }

    openConfirmDialog(
      'Confirm Bulk Deletion',
      `Are you sure you want to delete ${state.selectedRows.length} selected categories?`
    );
    setState(prev => ({ ...prev, confirmDialog: { ...prev.confirmDialog, onConfirm: performBulkDelete } }));
  }, [state.selectedRows]);

  const performBulkDelete = async () => {
    try {
      await axiosInstance.post('/bulkDeleteCategories', { ids: state.selectedRows });
      setState(prevState => ({
        ...prevState,
        categories: prevState.categories.filter((category) => !state.selectedRows.includes(category._id)),
        selectedRows: [],
        alert: { isOpen: true, message: 'Categories deleted successfully', severity: 'success' }
      }));
    } catch (error) {
      console.error('Error deleting categories:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { isOpen: true, message: 'Error deleting categories. Please try again.', severity: 'error' }
      }));
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 250 },
    { field: 'nameCategory', headerName: 'Name', width: 250 },
    { field: 'image', headerName: 'Image URL', width: 500 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {state.permissions.canEdit && (
              <Link to={`/categories/edit/${params.row._id}`} className="editButton">
                Edit
              </Link>
            )}
            {state.permissions.canDelete && (
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
      <div className="datatable">
        <div className="datatableTitle">
          Categories
          {state.permissions.canCreate && (
            <Link to="/categories/new" className="link">
              Add New
            </Link>
          )}
          {state.permissions.canDelete && (
            <div className="linkDelete" onClick={handleBulkDelete}>
              Delete Selected
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
  );
};

export default Categoriestable;