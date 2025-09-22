import { useState } from "react";
import Search from "./search";
import UserList from "./userList";

 const Sidebar = ({socket}) => {

   let[searchKey, setSearchKey] = useState(() => '');


  return (
      <div className="app-sidebar">
          <Search 
              searchKey={searchKey}
              setSearchKey={setSearchKey}>
          </Search>
           <UserList
              searchKey = {searchKey} socket = {socket}>
          </UserList>
      </div>
  )
}
export default Sidebar;

