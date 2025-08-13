
import { useSelector } from 'react-redux';


function UserList({ searchKey }) {

  let { allUsers } = useSelector(state => state.userReducer); // state represent store variable in store.jsx and state.userReducer; represent pertinent initialValue (object) eventually this value injects to user variable


     let getFullName = (user) => {

       let fn = user?.firstname;
       let ln = user?.lastname;

       if(!fn || !ln) return 'Anonymous User';

       let fname = fn.charAt(0).toUpperCase() +
                   fn.substring(1).toLowerCase();

       let lname = ln.charAt(0).toUpperCase() + 
                   ln.slice(1).toLowerCase();
  
     return `${fname} ${lname}`;
  }

  
  let getInitials = (user) => {
       let fn = user?.firstname;
       let ln = user?.lastname;

    if(!fn || !ln)  return 'AU'; 
    
    return `${fn.charAt(0).toUpperCase()}${ln.charAt(0).toUpperCase()}`;
  }

  let getEmail = (user) => {
    let email = user?.email;
    if(!email) return "no email found!";

    return email.toLowerCase();
}

  let searchKEY = searchKey?.toLowerCase().trim();

    return(
          allUsers
          .filter((user) => {
              return (
                (user.firstname.toLowerCase().trim().includes(searchKEY) ||
                user.lastname.toLowerCase().trim().includes(searchKEY) ||
                (user.firstname+" "+user.lastname).toLowerCase().trim().includes(searchKEY)) &&
                searchKEY
              )
          })
          .map((user) => {
              return (
            <div class="user-search-filter">
                  <div class="filtered-user">
                      <div class="filter-user-display">
                              {/* <img src={user.profilePic} alt="Profile Pic" class="user-profile-image" />  */}
                          <div class="user-default-profile-pic">
                              {getInitials(user)}
                          </div>
                          <div class="filter-user-details">
                              <div class="user-display-name">{getFullName(user)}</div>
                                  <div class="user-display-email">{getEmail(user)}</div>
                          </div>
                          <div class="user-start-chat">
                                  <button class="user-start-chat-btn">Start Chat</button>
                          </div>
                      </div>
                  </div>                        
            </div>
              )
          })
          
        
        
        // <div class="user-search-filter">
        //     <div class="filtered-user">
        //         <div class="filter-user-display">
        //                 {/* <img src={user.profilePic} alt="Profile Pic" class="user-profile-image" />  */}
        //             <div class="user-default-profile-pic">
        //                 {getInitials()}
        //             </div>
        //             <div class="filter-user-details">
        //                 <div class="user-display-name">{getFullName()}</div>
        //                     <div class="user-display-email">{getEmail()}</div>
        //             </div>
        //             <div class="user-start-chat">
        //                     <button class="user-start-chat-btn">Start Chat</button>
        //             </div>
        //         </div>
        //     </div>                        
        // </div>
    );
}

export default UserList;

 