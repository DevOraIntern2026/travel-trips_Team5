import "./Login.css"
import { useEffect, useState } from "react";
import container from "../../assets/images/loginImages/Container.png"
import googleLogo from "../../assets/images/loginImages/google.png"
import appleLogo from "../../assets/images/loginImages/apple.png"
import interAdmin from "../../assets/images/loginImages/interAdmin.png"
import encrypted from "../../assets/images/loginImages/encrypted.png"
import forEgypt from "../../assets/images/loginImages/forEgypt.png"
import lockPass from "../../assets/images/loginImages/encryption.png"
import eyeIcon from "../../assets/images/loginImages/eye.png"
import atIcon from "../../assets/images/loginImages/at.png"
import verification from "../../assets/images/loginImages/verification.png"
import security from "../../assets/images/loginImages/security.png"
import stalite from "../../assets/images/loginImages/stalite.png"
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";

export default function Login() {
    const { isLoggedIn, setIsLoggedIn, user, setUser } = useAppContext(); // Access the context value
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    })
    const [serverError, setServerError] = useState("")
    useEffect(()=>{
        if(isLoggedIn){
            navigate("/dashboard",{replace:true})
        }
    },[isLoggedIn,navigate])
    async function handleSubmit(e) {

        e.preventDefault();
        try{
            
            const response = await fetch(
                "http://localhost:3000/api/v1/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );
            const data = await response.json();
            console.log("Login response:", data);
            if(!response.ok){
                setServerError(data.message || "Something went wrong. Please try again later.");
                return;
            }
            
            // Handle successful login, e.g., store token, redirect, etc.
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            if(localStorage.getItem("accessToken")){

                setIsLoggedIn(true); // Update the context state to indicate the user is logged in
            }
            setUser(data.user); // Update the user information in the context
            navigate("/dashboard");
        }catch (error) {
            setServerError("Something went wrong. Please try again later.");
        }
            
        

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
                <div className="satelliteRelay">

                    <div className="relayTop">

                        <div className="relayTitle">

                            <div className="relayIcon">
                                <img src={stalite} alt="satalite" />
                            </div>

                            <div>
                                <h3>ACTIVE FLEET SATELLITE RELAY</h3>
                                <p>Wadi Feiran &amp; St. Catherine Expedition Hubs</p>
                            </div>

                        </div>

                        <div className="liveGrid">
                            <span className="liveDot"></span>
                            <span>Live Grid</span>
                        </div>

                    </div>


                    <div className="relayStats">

                        <div className="relayStat">
                            <strong>18</strong>
                            <span>Field Operatives</span>
                        </div>

                        <div className="relayStat">
                            <strong>100%</strong>
                            <span>Route Safety Rate</span>
                        </div>

                        <div className="relayStat">
                            <strong>42ms</strong>
                            <span>Telemetry Sync</span>
                        </div>
                    </div>
                </div>
                <div className="pioneerFooter">

                    <div className="certificatesContainer">
                        <div className="security">
                            <img src={security} alt="" />
                            <p>ISO-27001 Data Security</p>
                        </div>
                        <span className="dot"></span>
                        <div className="encryption">
                            <img src={lockPass} alt="encrypted" />
                            <p>256-Bit SSL Encrypted</p>
                        </div>
                        <span className="dot"></span>
                        <div className="verification">
                            <img src={verification} alt="" />
                            <p>Verified Operator Escort</p>
                        </div>
                    </div>


                    <p className="trustedText">
                        Trusted by over 14,000 global travelers, desert research institutions,
                        and certified desert guides since 2018.
                    </p>

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
                            <img className="eyeIcon" src={eyeIcon}
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
                                />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>
                        <p className="serverError">{serverError}</p>

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
