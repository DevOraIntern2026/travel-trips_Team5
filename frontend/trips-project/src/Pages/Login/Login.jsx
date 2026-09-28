import "./Login.css"
import { useState } from "react";
import container from "../../assets/images/loginImages/Container.png"
import googleLogo from "../../assets/images/loginImages/google.png"
import appleLogo from "../../assets/images/loginImages/apple.png"
import interAdmin from "../../assets/images/loginImages/interAdmin.png"
import encrypted from "../../assets/images/loginImages/encrypted.png"
import forEgypt from "../../assets/images/loginImages/forEgypt.png"
import lockPass from "../../assets/images/loginImages/secured.png"
import eyeIcon from "../../assets/images/loginImages/eye.png"
import atIcon from "../../assets/images/loginImages/at.png"

export default function Login() {
    const [showPassword,setShowPassword]=useState(false)
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    })
    function handleSubmit(e) {
        e.preventDefault();
        console.log(userData)
        console.log("loggedIn successfully")
    }
    function handleChange(e) {
        const { name, type, value, checked } = e.target
        setUserData({
            ...userData,
            [name]: type === "checkbox" ? checked : value

        })
    }
    return (
        <div className="loginPage">

            <div className="pioneerContainer">
                <div className="pioneerBackground"></div>
                <div className="pioneerHeader">
                    
                    <div className="forEgyptContainer">
                        <img src={forEgypt} alt="" />
                        <p>Egypt & Middle East Wilderness Gateway</p>
                    </div>
                    <h1 className="pioneerHeaderText">Pioneering journeys into the world's most timeless sanctuaries.</h1>
                    <h3 className="details">Sinai High Mountains, White Desert chalk monoliths, and the ancient
                        Red Sea coral plateaus curated with authentic Bedouin guardianship
                        and live satellite logistics.</h3>
                </div>
            </div>
            
            <div className="loginFormSide">


                <form onSubmit={handleSubmit} className='loginContainer'>
                    <h2 className='loginHeader'>Welcome back</h2>
                    <p className="logistics">Log in to manage bookings, expediting logistics, and member files.</p>

                    <div className='unifiedPortal'>
                        <img src={container} alt="container" />
                        <p><strong>Unified Portal:</strong> Travelers, Certified Guides, and Fleet Admins are
                            automatically routed on authentication.</p>
                    </div>

                    <div className="availableLoginContainer">
                        <button type="button" className="google"><img src={googleLogo} alt="google-logo" />Google</button>
                        <button type="button" className="apple"><img src={appleLogo} alt="apple-logo" />Apple</button>
                    </div>

                    <p className="emailAccess">OR EMAIL ACCESS</p>
                    <div className='userLogin'>
                        <label htmlFor="email" className='email'>Email Address <span className="required">*</span></label>
                        <div className="inputWrapper">
                        <img src={atIcon} alt="at" />
                        <input id='email'
                            type='text'
                            placeholder='name@organization.com'
                            required
                            onChange={handleChange}
                            name="email"
                            value={userData.email} />
                        </div>
                        <div className="passLabels">
                            <label htmlFor="password">Password <span className="required">*</span></label>
                            <label className="encrypted"><img src={encrypted} alt="encrypted" />Encrypted </label>
                        </div>
                        <div className="inputWrapper">
                            <img src={lockPass} alt="lock" />
                            <input id='password'
                                type={showPassword ? "text" : "password"}
                                placeholder='••••••••••••'
                                onChange={handleChange}
                                name="password"
                                value={userData.password}
                                required 
                                />
                            <img  className="eyeIcon" src={eyeIcon} 
                            alt="eye"
                            onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        <div className="rememberContainer">
                            <div className="rememberData">
                                <input id='remember'
                                    type='checkbox'
                                    onChange={handleChange}
                                    name="remember"
                                    value={userData.password}
                                    required />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>

                    <div className='btnsContainer'>
                        <button className='loginBtn'>Log in</button>

                    </div>
                    <p className="noAccount">Don't have an account? <a className="registerLink" href="/register">Register as Traveler or Operator</a></p>
                    <p className="internalAdmin"><img src={interAdmin} alt="internalAdmin" />Internal Admin accounts are managed directly via System Console.</p>
                    <div className="policies">
                        <p>Terms of Service</p>
                        <span className="dot"></span>
                        <p>Privacy Policy</p>
                        <span className="dot"></span>
                        <p>Safety Standards</p>
                    </div>

                </form>
            </div>
        </div>
    )
}
