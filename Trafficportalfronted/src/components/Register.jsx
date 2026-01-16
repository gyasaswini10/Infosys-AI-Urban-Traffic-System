import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASEURL, callApi } from '../api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        role: 4 // Default to Customer
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        callApi("POST", BASEURL + "users/signup", formData, (response) => {
            if (response.startsWith("200")) {
                alert("Registration Successful");
                navigate('/login');
            } else {
                alert("Registration Failed: " + response);
            }
        });
    };

    return (
        <div className="register-container" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', flexDirection:'column'}}>
            <h2>Register</h2>
            <input name="fullname" placeholder="Full Name" onChange={handleChange} style={{margin:'10px', padding:'10px'}} />
            <input name="email" placeholder="Email" onChange={handleChange} style={{margin:'10px', padding:'10px'}} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} style={{margin:'10px', padding:'10px'}} />
            <select name="role" onChange={handleChange} value={formData.role} style={{margin:'10px', padding:'10px'}}>
                <option value="4">Customer</option>
                <option value="3">Driver</option>
                <option value="2">Fleet Manager</option>
                <option value="1">Admin</option>
            </select>
            <button onClick={handleRegister} style={{padding:'10px 20px', background:'#28a745', color:'white', border:'none', cursor:'pointer'}}>Register</button>
            <p onClick={() => navigate('/login')} style={{cursor:'pointer', color:'blue'}}>Already have an account? Login</p>
        </div>
    );
}
