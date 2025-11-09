import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import dayjs from "dayjs";

let Profile = () => {

     let { user } = useSelector(state => state.userReducer);
     let [image, setImage] = useState('');

     useEffect(()=>{
        if(user?.profilePic) {
            setImage(user?.profilePic);
        }
     },
      [user]);
    
     function getInitials() {
       if(!user) {
          return "AU";
       } 
       return (user?.firstname?.charAt(0)+user?.lastname?.charAt(0))?.toUpperCase();
     }

     let getFullName = () => {
        if(!user) {
            return "Anonymous User!"
        }
        let f = user?.firstname?.charAt(0)?.toUpperCase() + user?.firstname?.slice(1)?.toLowerCase();
        let l = user?.lastname?.charAt(0)?.toUpperCase() + user?.lastname?.slice(1)?.toLowerCase();
        return `${f} ${l}`;
     }

     let getEmail = () => {
        if(!user) {
            return "anonymous@gmail.com";
        }
        return user?.email; 
     }

     let accountCreationDate = () => {
        if(!user) return "xxxx_xx_xx:xx";
        let timeStamp = dayjs(user?.createdAt);
        return timeStamp?.format('MMMM D YYYY, hh:mm a');
     }

     let onFileSelect = async (eventObject) => {
         const file = eventObject.target.files[0];

    const allowedTypes = [
        'image/jpeg', 
        'image/png',  
        'image/webp', 
        'image/bmp', 
    ];
    if (!allowedTypes.includes(file.type)) {
       // show toaster there.
    }
         const reader = new FileReader(file);   // creates the object
         reader.readAsDataURL(file); // image to base 64 string
        
        // event listener when file reading is complete
        reader.onloadend = async () => {
                setImage(reader.result); // base 64 is stored in image state
        }
    }

    return (
       <div className="profile-page-container">
        <div className="profile-pic-container">
            {image ?
             (<img src={image}
                 alt="PP"
                 className="user-profile-pic-upload" 
            />):
             <div className="user-default-profile-avatar">
                {getInitials()}
            </div>
        }
           
        </div>

        <div className="profile-info-container">
            <div className="user-profile-name">
                <h1>{getFullName()}</h1>
            </div>
            <div>
                <b>Email: </b>{getEmail()}
            </div>
            <div>
                <b>Account Created: </b>{accountCreationDate()}
            </div>
            <div className="select-profile-pic-container">
                <input type="file" onChange={ onFileSelect } />
            </div>
        </div>
    </div>
    )
}

export default Profile;