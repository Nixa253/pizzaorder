import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DiscountIcon from '@mui/icons-material/Discount';
import ConfirmLogout from "./ConfirmLogout";
import { Link, useNavigate} from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useState } from "react";


const Sidebar = ({ setCurrentTable }) => {
  const { dispatch } = useContext(DarkModeContext);
  const [userGroup, setUserGroup] = useState('');
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  useEffect(() => {
    const group = localStorage.getItem('userGroup');
    setUserGroup(group);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userGroup');
    navigate('/login');
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <span className="logo">DOMINI ADMIN</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <li onClick={() => setCurrentTable("datatable")}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          {userGroup === '66d94d28c11c24619def8cd7' && (
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li onClick={() => setCurrentTable("usertable")}>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
        )}
          <Link to="/categories" style={{ textDecoration: "none" }}>
            <li onClick={() => setCurrentTable("categoriestable")}>
              <CategoryIcon className="icon" />
              <span>Categories</span>
            </li>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
          <li onClick={() => setCurrentTable("productstable")}>          
              <StoreIcon className="icon" />
              <span>Products</span>
            </li>
          </Link> 
          <Link to="/toppings" style={{ textDecoration: "none" }}>
          <li onClick={() => setCurrentTable("toppingtable")}>          
              <BakeryDiningIcon className="icon" />
              <span>Toppings</span>
            </li>
          </Link>
          <Link to="/vouchers" style={{ textDecoration: "none" }}>
            <li onClick={() => setCurrentTable("vouchertable")}>
              <DiscountIcon className="icon" />
              <span>Vouchers</span>
            </li>
          </Link>
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <li onClick={() => setCurrentTable("orderstable")}>
              <CreditCardIcon className="icon" />
              <span>Orders</span>
            </li>
          </Link>
          <p className="title">ROLE</p>
          {userGroup === '66d94d28c11c24619def8cd7' && (
          <Link to="/group" style={{ textDecoration: "none" }}>
            <li onClick={() => setCurrentTable("grouptable")}>
              <GroupsIcon className="icon" />
              <span>Group</span>
            </li>
          </Link>
        )}
          {userGroup === '66d94d28c11c24619def8cd7' && (
            <Link to="/permissions" style={{ textDecoration: "none" }}>
              <li onClick={() => setCurrentTable("permissions")}>
                <AdminPanelSettingsIcon className="icon" />
                <span>Permissions</span>
              </li>
            </Link>
          )}
          {/* <p className="title">SERVICE</p>
          {userGroup === '66d94d28c11c24619def8cd7' && (
            <>
              <li>
                <SettingsSystemDaydreamOutlinedIcon className="icon" />
                <span>System Health</span>
              </li>
              <li>
                <PsychologyOutlinedIcon className="icon" />
                <span>Logs</span>
              </li>
            </>
          )}
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li> */}
          <p className="title">USER</p>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
          </Link>
          <li onClick={handleOpenLogoutDialog}>
        <ExitToAppIcon className="icon" />
        <span>Logout</span>
      </li>
      <ConfirmLogout 
        open={openLogoutDialog} 
        handleClose={handleCloseLogoutDialog} 
        handleLogout={handleLogout}
      />
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;