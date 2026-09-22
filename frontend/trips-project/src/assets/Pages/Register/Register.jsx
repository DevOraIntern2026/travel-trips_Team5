import { useState } from "react";
import "./register.css"

export default function Register() {

const [userData,setUserData]=useState({
    email:"",
    username:"",
    password:"",
    passwordConfirm:"",
})
function handleSubmit(e){
    e.preventDefault();
    console.log(userData)
    console.log("Registered successfully")
}
function handleChange(e){
    const {name,type,value,checked}=e.target
    setUserData({
        ...userData,
        [name]:type==="checkbox"?checked:value

    })    
}

return (
<form onSubmit={handleSubmit} className='registerContainer'>
        <h2 className='registerHeader'>Register</h2>
        <div className='userRegister'>
            <label htmlFor="email" className='email'>Email</label>
            <input id='email' 
            name="email" 
            onChange={handleChange} 
            value={userData.email}
            type='text' 
            placeholder='Email'
            required/>

            <label htmlFor="username">Username</label>        
            <input id='username' 
            name="username" 
            onChange={handleChange} 
            value={userData.username} 
            type='text' 
            placeholder='username'
            required/>
            
            <label htmlFor="password">Password</label>        
            <input id='password' 
            name="password" 
            onChange={handleChange}
            value={userData.password} 
            type='password' 
            placeholder='Password'
            required/>
            
            <label htmlFor="passwordConfirm">Confirm password</label>        
            <input id='passwordConfirm' 
            name="passwordConfirm" 
            onChange={handleChange} 
            value={userData.passwordConfirm} 
            type='password' 
            placeholder='Re-enter Password'
            required/>

        </div>

        <div className='btnsContainer'>
            <button className='registerBtn'>Register</button>
        </div>

    </form>  )
}
