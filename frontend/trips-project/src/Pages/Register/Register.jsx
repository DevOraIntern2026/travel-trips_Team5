import { useState } from "react";
import "./Register.css"

export default function Register() {

const [userData,setUserData]=useState({
    email:"",
    username:"",
    password:"",
    passwordConfirm:"",
})
const regex={
    emailReg:/^(\w{1,30}@\w+\.(\w){0,3})$/,
    userReg:/^(.{3,30})$/,
    passReg:/^(.{8,30})$/,
}
const [error,setError]=useState({
    emailErr:"",
    userErr:"",
    passErr:"",
    passConfirmErr:"",
})    
function validation(){
const newErrors={
    emailErr:"",
    userErr:"",
    passErr:"",
    passConfirmErr:"",
}    
if(regex.emailReg.test(userData.email)===false){
    newErrors.emailErr="Email form not valid should be example@example.com"
    // return newErrors.emailErr;
    console.log(newErrors.emailErr)
}
if(regex.userReg.test(userData.username)===false){
    newErrors.userErr="Username should be at least 3 characters"
    console.log(newErrors.userErr)
}
if(regex.passReg.test(userData.password)===false){
    newErrors.passErr="Password should be at least 8 characters"
    console.log(newErrors.passErr)
}
if(userData.passwordConfirm!==userData.password){
    newErrors.passConfirmErr="Password should be identical"
    console.log(newErrors.passConfirmErr)
}
    return newErrors;
}


async function handleSubmit(e) {
    e.preventDefault();

    console.log(userData);

    const errors = validation();

    // Put the errors into React state
    setError(errors);

    // If at least one error exists, stop
    if (Object.values(errors).some(err => err !== "")) {
        return;
    }

    try {
        const res = await fetch("API_URL", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await res.json();

        if (res.ok) {
            console.log("Registered Successfully", data);

            setUserData({
                email: "",
                username: "",
                password: "",
                passwordConfirm: "",
            });
        } else {
            console.log("Registration failed", data);
        }
    } catch (err) {
        console.log("Server error", err);
    }
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
            {error.emailErr&&<p className="emailError">{error.emailErr}</p>}
            <label htmlFor="username">Username</label>        
            <input id='username' 
            name="username" 
            onChange={handleChange} 
            value={userData.username} 
            type='text' 
            placeholder='username'
            required/>
            {error.userErr&&<p className="userError">{error.userErr}</p>}
            
            <label htmlFor="password">Password</label>        
            <input id='password' 
            name="password" 
            onChange={handleChange}
            value={userData.password} 
            type='password' 
            placeholder='Password'
            required/>
            {error.passErr&&<p className="passError">{error.passErr}</p>}
            
            <label htmlFor="passwordConfirm">Confirm password</label>        
            <input id='passwordConfirm' 
            name="passwordConfirm" 
            onChange={handleChange} 
            value={userData.passwordConfirm} 
            type='password' 
            placeholder='Re-enter Password'
            required/>
            {error.passConfirmErr&&<p className="passConfirmError">{error.passConfirmErr}</p>}

        </div>

        <div className='btnsContainer'>
            <button className='registerBtn'>Register</button>
        </div>
        {/* {!Object.values(error).every((err)=>err==="")&&<p>Registered successfully</p>} */}
    </form>  )
}
