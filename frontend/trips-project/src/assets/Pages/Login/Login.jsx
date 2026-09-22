import { Link } from "react-router-dom";
import "./login.css"
import { useState } from "react";

export default function Login() {

const [userData,setUserData]=useState({
    email:"",
    password:"",
})
function handleSubmit(e){
    e.preventDefault();
    console.log(userData)
    console.log("loggedIn successfully")
}
function handleChange(e){
    const {name,type,value,checked}=e.target
    setUserData({
        ...userData,
        [name]:type==="checkbox"?checked:value

    })    
}
return (
    <form onSubmit={handleSubmit} className='loginContainer'>
        <h2 className='loginHeader'>Login</h2>
        <div className='userLogin'>
            <label htmlFor="email" className='email'>Email</label>
            <input id='email' 
            type='text' 
            placeholder='Email'
            required
            onChange={handleChange}
            name="email"
            value={userData.email}/>

            <label htmlFor="password">Password</label>        
            <input id='password' 
            type='password' 
            placeholder='Password'
            onChange={handleChange}
            name="password"
            value={userData.password}
            required/>
        </div>

        <div className='btnsContainer'>
            <button className='loginBtn'>Login</button>

            <label >Don't have account yet?</label>        
            <Link to="/register" className='registerBtn' >Register</Link>
        </div>

    </form>
)
}
