
import React, {useEffect, useState} from 'react';
import './../../../index.css';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { loginUser } from '../../apiCalls/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from './../../redux/loaderSlice.jsx';

const Login = () => {

    const dispatcher = useDispatch();
    let navigate = useNavigate();
    let[buttonStatus, setButtonStatus] = useState(false);


   let[user, setUser] = useState({
        email: '',
        password: ''
    });


    function handleChange(e) {
        setUser((prevUser)=>{
            return {
                ...prevUser, [e.target.name]: e.target.value
            }
        })
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setButtonStatus(true);

        let cleanUser = {
            email: user.email.trim(),
            password: user.password.trim()
        }

        let response = null;

         try {
                dispatcher(showLoader());
                    response = await loginUser(cleanUser);
                dispatcher(hideLoader());
                setButtonStatus(false);

            if(response.success) {
                toast.success(response.message);
                localStorage.setItem('token', response.token);
                navigate('/');
            } else {
                toast.error(response.message);
            }

        } catch(err) {
            response.message = response.message || 'Something went wrong while login!'; //runs or works for only if above signupUser() calls causes some error.
            toast.error(response.message);
            setButtonStatus(false); // if some error occur no line below await loginUser will runs here, 61 62
            dispatcher(hideLoader());
            // button and loader can be reduxed and on and off using request, response interceptors.

        }

        setUser({
            email: '', password: ''
        });

    }

   return (
     <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
            <div className="card-title">
                <h1>Login Here</h1>
            </div>
            <div className="form">
            <form onSubmit={ handleSubmit }>
                <input type="email" placeholder="Email" value={user.email} onChange={handleChange} name="email" required/>
                <input type="password" placeholder="Password"  value={user.password} onChange={handleChange} name="password" required/>
            <button type="submit" disabled={buttonStatus}>Login</button>
            </form>
            </div>
            <div className="card_terms"> 
                <span>Don't have an account yet?
                    <Link to="/signup"> 
                       Signup Here
                     </Link>
                </span>
            </div>
            </div>
    </div>
) 

}



export default Login;