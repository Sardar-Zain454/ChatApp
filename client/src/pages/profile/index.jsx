import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import dayjs from "dayjs";
import toast from 'react-hot-toast';
import { uploadProfilePicThunk } from "./../../redux/userThunks";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

let imageBase64String = '';

let Profile = () => {

     let { user } = useSelector(state => state.userReducer);
     const dispatcher = useDispatch();
     let [image, setImage] = useState('');

     useEffect(()=>{
        if(user?.profilePic) {
            setImage(user?.profilePic);
        }

        return () => {
            imageBase64String = '';
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
         const file = eventObject.target.files[0]; // this is the actual file selected from computer (PC).
        if(!file) return;

        if(!navigator.onLine) {
            toast.error("Check your connection!");
            imageBase64String = "";
            eventObject.target.value = ''; // this is the name or path of the selected files from computer (PC).
            return;
        }

            // file.name is the name of file profile.png
            // file.type is the string image style like image/png
            // file.size is the size of the file in bytes.

    const allowedTypes = [
        'image/jpeg', 
        'image/png',  
        'image/webp', 
        'image/bmp', 
    ];

    if (!allowedTypes.includes(file.type)) {
        toast.error("Please! select any image file");
        eventObject.target.value = ''; // this is the name or path of the selected files from computer (PC).
        return;
    }
         const reader = new FileReader(file);   // creates the object
         reader.readAsDataURL(file); // image to base 64 string
        
        // event listener when file reading is complete totally.
        reader.onloadend = async () => {
                imageBase64String = reader.result;
        }
    }

    let onFileUpload = async () => {

        if(imageBase64String) {

            dispatcher(showLoader());
                await dispatcher(uploadProfilePicThunk(imageBase64String));
            dispatcher(hideLoader());
        imageBase64String = '';
        } else {
            toast("Select any image first");
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
                <button type="button" id="uploadProfilePicBtn" onClick={onFileUpload}>Upload</button>
            </div>
            
        </div>
    </div>
    )
}

export default Profile;