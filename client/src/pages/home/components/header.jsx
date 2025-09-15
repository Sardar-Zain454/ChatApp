import {useSelector} from 'react-redux';


 const Header = () => {
 
  let { user } = useSelector(state => state.userReducer); // state represent store variable in store.jsx and state.userReducer; represent pertinent initialValue (object) eventually this value injects to user variable
 
  let getFullName = () => {
       let fn = user?.firstname;
       let ln = user?.lastname;

       if(!fn || !ln) return 'Anonymous User';

       let fname = fn.charAt(0).toUpperCase() +
                   fn.substring(1).toLowerCase();

       let lname = ln.charAt(0).toUpperCase() + 
                   ln.slice(1).toLowerCase();
  
     return `${fname} ${lname}`;
  }

  
  let getInitials = () => {
       let fn = user?.firstname;
       let ln = user?.lastname;

    if(!fn || !ln)  return 'AU'; 
    
    return `${fn.charAt(0).toUpperCase()}${ln.charAt(0).toUpperCase()}`;
  }



  return (
    <div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
          Quick Chat
    </div>
    <div className="app-user-profile">
        <div className="logged-user-name">{getFullName()}</div>
        <div className="logged-user-profile-pic">{getInitials()}</div>
    </div>
</div>
  )
}

export default Header;
