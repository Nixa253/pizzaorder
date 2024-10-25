import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewCoupon from "./pages/new/NewCoupon";
import NewCategory from "./pages/new/NewCategory";
import NewProduct from "./pages/new/NewProduct";
import NewPermission from "./pages/new/NewPermission";
import NewTopping from "./pages/new/NewTopping";
import NewOrder from "./pages/new/NewOrder";
import NewUser from "./pages/new/NewUser";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route index element={<List initialTable="usertable"/>} />
              {/* <Route path=":userId" element={<Single />} /> */}
              <Route
                path="new"
                element={<NewUser title="Add New User" />} 
              />
               <Route
                path="edit/:userId"
                element={<NewUser title="Edit User" />}               
              />
            </Route>
            <Route path="categories">
            <Route index element={<List initialTable="categoriestable"/>} />
            <Route
                path="new"
                element={<NewCategory title="Add New Category" />}               
              />
              <Route
                path="edit/:categoryId"
                element={<NewCategory title="Edit Category" />}               
              />
            </Route>
            <Route path="products"> 
              <Route index element={<List initialTable="productstable"/>} />
              <Route
                path="new"
                element={<NewProduct title="Add New Product" />}  
              />
              <Route
                path="edit/:productId"
                element={<NewProduct title="Edit Product" />}               
              />
            </Route> 
            <Route path="toppings"> 
              <Route index element={<List initialTable="toppingtable"/>} />
              <Route
                path="new"
                element={<NewTopping title="Add New Topping" />}  
              />
              <Route
                path="edit/:toppingId"
                element={<NewTopping title="Edit Topping" />}               
              />
            </Route>
            <Route path="vouchers">
            <Route index element={<List initialTable="vouchertable"/>} />
              <Route
                path="new"
                element={<NewCoupon title="Add New Voucher" />}   
              />
              <Route
                path="edit/:voucherId"
                element={<NewCoupon title="Edit Voucher" />}               
              />
            </Route>
            <Route path="orders">
              <Route index element={<List initialTable="orderstable"/>} />
              <Route
                path="new"
                element={<NewOrder title="Add New Order" />}
              />
              <Route
                path="edit/:orderId"
                element={<NewOrder title="Edit Order" />}               
              />
            </Route>
            <Route path="group">
              <Route index element={<List initialTable="grouptable"/>} />
            </Route>
            <Route path="permissions">
              <Route index element={<List initialTable="permissions" />} />
              <Route path=":groupId" element={<List initialTable="permissions" />} />
              <Route
                path="new"
                element={<NewPermission title="Add New Permission" />} 
              />
            </Route>          
            <Route path="profile" >
              <Route index element={<Single />}  />
              <Route
                path="edit/:userId"
                element={<New title="Edit Profile" />}               
              /> 
            </Route> 
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;