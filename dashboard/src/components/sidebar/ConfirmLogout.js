import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import "./confirmLogout.scss";

const ConfirmLogout = ({ open, handleClose, handleLogout }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <ExitToAppIcon className="logout-icon" />
        Confirm Logout
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to logout from your account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="cancel-button">
          Cancel
        </Button>
        <Button onClick={handleLogout} className="confirm-button" autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLogout;