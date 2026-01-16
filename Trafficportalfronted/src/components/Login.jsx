import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASEURL, callApi } from '../api';
import '../css/Login.css'; // Assuming you might want to add CSS later

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const payload = { email, password };
        callApi("POST", BASEURL + "users/signin", JSON.stringify(payload), (response) => {
            if (response.startsWith("200")) {
                const token = response.split("::")[1];
                sessionStorage.setItem("token", token);
                
                // Fetch user details to determine role
                callApi("POST", BASEURL + "users/getdetails", JSON.stringify({ csrid: token }), (user) => {
                    sessionStorage.setItem("user", JSON.stringify(user));
                    const role = user.role;
                    if (role === 1) navigate('/admin');
                    else if (role === 2) navigate('/fleet-manager');
                    else if (role === 3) navigate('/driver');
                    else if (role === 4) navigate('/customer');
                    else navigate('/');
                });
            } else {
                alert("Invalid Credentials");
            }
        });
    };

    return (
        <div className="login-container" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', flexDirection:'column'}}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{margin:'10px', padding:'10px'}} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{margin:'10px', padding:'10px'}} />
            <button onClick={handleLogin} style={{padding:'10px 20px', background:'#007bff', color:'white', border:'none', cursor:'pointer'}}>Login</button>
            <p onClick={() => navigate('/register')} style={{cursor:'pointer', color:'blue'}}>New here? Register</p>
        </div>
    );
}
