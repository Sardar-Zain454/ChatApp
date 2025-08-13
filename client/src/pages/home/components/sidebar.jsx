import { useState } from "react";
import Search from "./search";

 const Sidebar = () => {

   let[searchKey, setSearchKey] = useState(() => '');

  return (
      <div className="app-sidebar">
          <Search 
              searchKey={searchKey}
              setSearchKey={setSearchKey}>
          </Search>
              {/* <!--USER LIST--> */}
      </div>
  )
}

export default Sidebar;

