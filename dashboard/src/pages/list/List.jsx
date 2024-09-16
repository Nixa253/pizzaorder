import React, { useState, useEffect } from "react";
import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";
import Grouptable from "../../components/datatable/Grouptable";
import Permissionstable from "../../components/datatable/Permissionstable";
import Usertable from "../../components/datatable/Usertable";
import Categoriestable from "../../components/datatable/Categoriestable";
const List = ({ initialTable }) => {
  const [currentTable, setCurrentTable] = useState(initialTable || "datatable");

  useEffect(() => {
    setCurrentTable(initialTable);
  }, [initialTable]);

  const renderTable = () => {
    switch (currentTable) {
      case "datatable":
        return <Datatable />;
      case "usertable":
        return <Usertable />;
      case "categoriestable":
        return <Categoriestable />;
      case "grouptable":
        return <Grouptable />;
      case "permissions":
        return <Permissionstable />;
      default:
        return <Datatable />;
    }
  };

  return (
    <div className="list">
      <Sidebar setCurrentTable={setCurrentTable} />
      <div className="listContainer">
        <Navbar />
        {renderTable()}
      </div>
    </div>
  );
};

export default List;