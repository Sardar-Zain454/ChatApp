import { useState, useEffect } from 'react';
import './../../../index.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from './../../redux/loaderSlice.jsx'
import { signupThunk } from '../../redux/userThunks.js';

const Signup = () => {

    const dispatcher = useDispatch();
    let navigate = useNavigate();
    // for to achieve throtlling.
    const[buttonStatus, setButtonStatus] = useState(false);

     
    let[user, setUser] = useState({
         firstname: '',
         lastname: '',
         email: '',
         password: ''
    });

    useEffect(() => {
        if(localStorage.getItem('token') && localStorage.getItem('token ') !== 'undefined') {
             navigate('/');
        }
    }, []);





    function handleChange(e) {
        setUser((prevUser) => {
            return {...prevUser, [e.target.name]: e.target.value } 
         });
    }

    async function handleSubmit(e) {
        e.preventDefault();     
        
        let cleanUser = {
                firstname: user.firstname.trim(), 
                lastname: user.lastname.trim(),
                email: user.email.trim(), // email is also lowercased in backend
                password: user.password.trim()
        };


        setButtonStatus(true);
        dispatcher(showLoader());
        await dispatcher(signupThunk(cleanUser)) // no way that error comes here
        dispatcher(hideLoader());
        setButtonStatus(false);



          // REMEBERS IT:
        // try{
        //     dispatcher(showLoader());
        //     response = await signupUser(cleanUser);
        //     setButtonStatus(false);
        //     dispatcher(hideLoader());

        //    if(response.success) {
        //          toast.success(response.message);
        //    } else {
        //       toast.error(response.message);
        //    }

        // }catch(err) {
        //     response.message = response.message || 'Something went wrong while registration!'; //runs or works for only if above signupUser() calls causes some error.
        //     toast.error(response.message);
        //     setButtonStatus(false); // if some error occur no line below await loginUser will runs here these two lines 61 62
        //     dispatcher(hideLoader()); 

        // }

        // setUser({
        //     firstname: '', lastname: '', email: '', password: ''
        // });
        
    }
    
    return(
        <>
         <div className="container">
                <div className="container-back-img"></div>
                <div className="container-back-color"></div>
                <div className="card">
                    <div className="card-title">
                        <h1>Create Account</h1>
                    </div>
                    <div className="form">
                    <form onSubmit={handleSubmit}>
                        <div className="column">
                            <input type="text" placeholder="First Name" onChange={handleChange} value={user.firstname} name="firstname" required/>
                            <input type="text" placeholder="Last Name" onChange={handleChange} value={user.lastname} name="lastname" required/>
                        </div>
                        <input type="email" placeholder="Email" onChange={handleChange} value={user.email} name="email" required/>
                        <input type="password" placeholder="Password" onChange={handleChange} value={user.password} name="password" required/>
                        <button type="submit" disabled={buttonStatus}>Sign Up</button>
                    </form>
                    </div>
                    <div className="card_terms">
                    <span>Already have an account?
                     <Link to="/login">Login Here</Link>
                    </span>
                    </div>
                </div>
         </div>
        </>
    )
}

export default Signup;
