import { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";

/* ---------- small inline icons (no extra dependency) ---------- */
const Icon = ({ children, size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);
const CompassIcon = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><polygon points="16 8 14 14 8 16 10 10 16 8" /></Icon>;
const MountainIcon = (p) => <Icon {...p}><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></Icon>;
const CheckCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></Icon>;
const ShieldIcon = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></Icon>;
const EyeIcon = (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>;
const EyeOffIcon = (p) => <Icon {...p}><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 5-5.9M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2" /><path d="m1 1 22 22" /></Icon>;
const ArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.6 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
        <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.4 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
);
const AppleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
);

/* ---------- validation ---------- */
const regex = {
    name: /^.{3,60}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    password: /^(?=.*\d).{8,64}$/, // 8+ chars, at least 1 number
};

function getStrength(pw) {
    let score = 0;
    if (pw.length >= 8) {
        score++
    };
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) {
        score++
    };
    if (/\d/.test(pw)) {
        score++
    };
    if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) {
        score++
    };
    return score; // 0-4
}
const STRENGTH_LABELS = ["None", "Weak", "Fair", "Good", "Strong"];

const ROLES = [
    {
        id: "traveler", title: "I'm a Traveler", badge: "Instant Hold", badgeClass: "badge-blue",
        desc: "Book desert & mountain treks", Icon: CompassIcon
    },
    {
        id: "operator", title: "Trip Operator", badge: "MTA Cert", badgeClass: "badge-orange",
        desc: "Manage guides & routes", Icon: MountainIcon
    },
];

const emptyErrors = { 
    name: "", 
    email: "", 
    password: "", 
    confirm: "", 
    terms: "" 
};

export default function Register() {
    const [role, setRole] = useState("traveler");
    const [userData, setUserData] = useState({
        fullName: "",
        email: "", 
        password: "", 
        passwordConfirm: "", 
        terms: false,
    });
    const [error, setError] = useState(emptyErrors);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverMsg, setServerMsg] = useState("");

    const strength = userData.password ? getStrength(userData.password) : 0;
    
    function validation() {
        const errs = { ...emptyErrors };
        if (!regex.name.test(userData.fullName.trim())) errs.name = "Enter your full legal name (min 3 characters)";
        if (!regex.email.test(userData.email.trim())) errs.email = "Email format not valid, e.g. name@expedition.eg";
        if (!regex.password.test(userData.password)) errs.password = "Password needs 8+ characters and at least 1 number";
        if (!userData.passwordConfirm || userData.passwordConfirm !== userData.password)
            errs.confirm = "Passwords must match";
        if (!userData.terms) errs.terms = "You must accept the Terms of Service and Privacy Policy";
        return errs;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerMsg("");

        const errs = validation();
        setError(errs);
        if (Object.values(errs).some(Boolean)) return;

        setLoading(true);
        try {
            const res = await fetch("API_URL", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    fullName: userData.fullName.trim(),
                    email: userData.email.trim(),
                    password: userData.password,
                }), // passwordConfirm and terms are not sent to the API
            });
            const data = await res.json();

            if (res.ok) {
                setUserData({ 
                    fullName: "", 
                    email: "", password: "",
                    passwordConfirm: "",
                    terms: false });
                // onSuccess?.(role, data); // e.g. navigate to Step 2
            } else {
                setServerMsg(data?.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setServerMsg("Server error. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, type, value, checked } = e.target;
        setUserData((prev) => ({ ...prev,
            [name]: type === "checkbox" ? checked : value 
        }));
    }

    return (
        <div className="registerPage">

            <main className="regMain">
                {/* ---------- left hero panel ---------- */}
                <aside className="regHero">
                    <div className="heroTop">
                        <div className="forEgyptContainerRegister">
                            <span className="dot"></span>
                            <p>CAIRO GATEWAY &amp; SINAI EXPEDITIONS</p>
                        </div>
                        <h1>Uncompromising desert expeditions, backed by official councils.</h1>
                        <p className="heroSub">
                            Join Egypt's most secure wilderness network. Direct real-time GPS fleet telemetry,
                            certified Bedouin pathfinders, and verified local operator permits.
                        </p>

                        <div className="whyBox">
                            <h3><CompassIcon size={15} /> Why sign up as a {role === "traveler" ? "Traveler" : "Trip Operator"}?</h3>
                            {role === "traveler" ? (
                                <ul>
                                    <li><CheckCircle size={14} />Instant seat holds on verified St. Catherine &amp; White Desert routes</li>
                                    <li><CheckCircle size={14} />Direct contact with licensed Bedouin guides &amp; MTA drivers</li>
                                    <li><CheckCircle size={14} />Expedition insurance with automated emergency medevac coverage</li>
                                </ul>
                            ) : (
                                <ul>
                                    <li><CheckCircle size={14} />List and manage verified routes, guides and departures</li>
                                    <li><CheckCircle size={14} />Reach travelers actively booking Egyptian expeditions</li>
                                    <li><CheckCircle size={14} />MTA certification review handled inside the platform</li>
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="heroCard">
                        <span className="heroCardLabel">ACTIVE DEPARTURE PASS</span>
                        <strong>Sinai High Mountain &amp; Blue Desert Traverse</strong>
                        <span className="heroRating">4.9 ★ Verified</span>
                    </div>

                    <div className="heroFooter">
                        <span><ShieldIcon size={14} /> Bedouin Sheikh Council &amp; MTA Certified</span>
                        <span className="heroCode">EG-EXPED #4029</span>
                    </div>
                </aside>

                {/* ---------- form card ---------- */}
                <form onSubmit={handleSubmit} className="registerContainer" noValidate>
                    <div className="registerTitleRow">
                        <div>
                            <h2 className="registerHeader">Create your account</h2>
                            <p className="registerSub">Start discovering and booking verified expeditions across Egypt in minutes.</p>
                        </div>
                        <span className="fastPass"><CompassIcon size={12} /> Fast Pass</span>
                    </div>

                    <div className="roleHeadRow">
                        <span className="sectionLabel">SELECT ACCOUNT ROLE</span>
                        <span className="stepLabel">Step 1 of 2</span>
                    </div>

                    <div className="roleGrid" role="radiogroup" aria-label="Account role">
                        {ROLES.map(({ id, title, badge, badgeClass, desc, Icon: RoleIcon }) => (
                            <button
                                type="button" key={id} role="radio" aria-checked={role === id}
                                className={`roleCard ${role === id ? "active" : ""}`}
                                onClick={() => setRole(id)}
                            >
                                <span className={`roleIcon ${id}`}><RoleIcon size={16} /></span>
                                <span className="roleText">
                                    <span className="roleTitle">{title} <em className={`badge ${badgeClass}`}>{badge}</em></span>
                                    <span className="roleDesc">{desc}</span>
                                </span>
                                {role === id && <span className="roleCheck"><CheckCircle size={18} /></span>}
                            </button>
                        ))}
                    </div>

                    <div className="socialRow">
                        <button type="button" className="socialBtn google"><GoogleIcon /> Google</button>
                        <button type="button" className="socialBtn apple"><AppleIcon /> Apple</button>
                    </div>

                    <div className="divider"><span>OR REGISTER WITH EMAIL</span></div>

                    <div className="fieldGrid">
                        <div className="field">
                            <div className="fieldHead"><label htmlFor="fullName">Full Legal Name <b>*</b></label></div>
                            <input id="fullName" name="fullName" type="text" autoComplete="name"
                                placeholder="e.g., Karim Al-Masri" value={userData.fullName} onChange={handleChange}
                                className={error.name ? "invalid" : ""} />
                            {error.name && <p className="fieldError userError">{error.name}</p>}
                        </div>

                        <div className="field">
                            <div className="fieldHead">
                                <label htmlFor="email">Email Address <b>*</b></label>
                                <span className="hint">Private</span>
                            </div>
                            <input id="email" name="email" type="email" autoComplete="email"
                                placeholder="name@expedition.eg" value={userData.email} onChange={handleChange}
                                className={error.email ? "invalid" : ""} />
                            {error.email && <p className="fieldError emailError">{error.email}</p>}
                        </div>

                        <div className="field">
                            <div className="fieldHead">
                                <label htmlFor="password">Password <b>*</b></label>
                                <span className="hint mono">8+ chars, 1 num</span>
                            </div>
                            <div className="passWrap">
                                <input id="password" name="password" autoComplete="new-password"
                                    type={showPass ? "text" : "password"} placeholder="Create passphrase"
                                    value={userData.password} onChange={handleChange}
                                    className={error.password ? "invalid" : ""} />
                                <button type="button" className="eyeBtn" onClick={() => setShowPass((s) => !s)}
                                    aria-label={showPass ? "Hide password" : "Show password"}>
                                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <div className="strengthRow">
                                <div className="strengthBars" data-level={strength}>
                                    {[1, 2, 3, 4].map((n) => <span key={n} className={strength >= n ? "on" : ""} />)}
                                </div>
                                <span className="strengthLabel">{STRENGTH_LABELS[strength]}</span>
                            </div>
                            {error.password && <p className="fieldError passError">{error.password}</p>}
                        </div>

                        <div className="field">
                            <div className="fieldHead">
                                <label htmlFor="passwordConfirm">Confirm Password <b>*</b></label>
                                <span className="hint">Must match</span>
                            </div>
                            <div className="passWrap">
                                <input id="passwordConfirm" name="passwordConfirm" autoComplete="new-password"
                                    type={showConfirm ? "text" : "password"} placeholder="Repeat passphrase"
                                    value={userData.passwordConfirm} onChange={handleChange}
                                    className={error.confirm ? "invalid" : ""} />
                                <button type="button" className="eyeBtn" onClick={() => setShowConfirm((s) => !s)}
                                    aria-label={showConfirm ? "Hide password" : "Show password"}>
                                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {error.confirm && <p className="fieldError passConfirmError">{error.confirm}</p>}
                        </div>
                    </div>

                    <label className="termsRow">
                        <input type="checkbox" name="terms" checked={userData.terms} onChange={handleChange} />
                        <span>
                            I agree to TravelOra's <a href="/terms">Terms of Service</a> and{" "}
                            <a href="/privacy">Privacy Policy</a> <b className="req">*</b> (Egyptian E-Tourism compliance notice included).
                        </span>
                    </label>
                    {error.terms && <p className="fieldError">{error.terms}</p>}

                    {serverMsg && <p className="serverMsg">{serverMsg}</p>}

                    <div className="btnsContainer">
                        <button type="submit" className="registerBtn" disabled={loading}>
                            {loading ? "Creating account..." : <>Create Account <ArrowRight size={16} /></>}
                        </button>
                        <p className="haveAccount">
                            Have an account?{" "}
                            <button type="button" className="linkBtn" ><Link to="/login">Log in</Link></button>
                        </p>
                    </div>

                    <div className="trustRow">
                        <span><ShieldIcon size={13} /> 256-bit SSL Encrypted <i>•</i> TLS 1.3 Active</span>
                        <span className="trustRight"><CheckCircle size={13} /> MTA &amp; Bedouin Sheikh Council Partner</span>
                    </div>
                </form>
            </main>

        </div>
    );
}
