import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewCategory from "./pages/new/NewCategory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
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
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route index element={<List initialTable="usertable"/>} />
              <Route path=":userId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
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
              <Route index element={<List />} />
              <Route path=":productId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Product" />}
              />
            </Route>
            <Route path="coupons">
              <Route index element={<List />} />
              <Route path=":couponId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Coupon" />}
              />
            </Route>
            <Route path="orders">
              <Route index element={<List />} />
              <Route path=":orderId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Order" />}
              />
            </Route>
            <Route path="group">
              <Route index element={<List initialTable="grouptable"/>} />
              <Route path=":groupId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Group" />}
              />
            </Route>
            <Route path="permissions">
              <Route index element={<List initialTable="permissions" />} />
              <Route path=":groupId" element={<List initialTable="permissions" />} />
              <Route path=":permissionId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Permission" />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;