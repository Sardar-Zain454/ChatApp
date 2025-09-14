
import {useState, useEffect} from 'react';
import './../../../index.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from './../../redux/loaderSlice.jsx';
import { loginThunk } from '../../redux/userThunks.js';
import { updateInitialDataFetched } from '../../redux/userSlice.jsx'; 

const Login = () => {

    const dispatcher = useDispatch();
    let[buttonStatus, setButtonStatus] = useState(false);
    let navigate = useNavigate();

      useEffect(() => {
            if(localStorage.getItem('token') && localStorage.getItem('token ') !== 'undefined') {
                 navigate('/');
            }
        }, []);


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

        let cleanUser = {
            email: user.email.trim(),
            password: user.password.trim()
        }
            
        setButtonStatus(true);
        dispatcher(showLoader());

        // no way that error comes her
          await dispatcher(loginThunk(cleanUser)); // if fulfilled then only token is stored

          if(localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
                // first check token if it exists or not
                dispatcher(updateInitialDataFetched(true)); // {type: user/updateInitialDataFetched, payload: true}
          }


          dispatcher(hideLoader());
          setButtonStatus(false);


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