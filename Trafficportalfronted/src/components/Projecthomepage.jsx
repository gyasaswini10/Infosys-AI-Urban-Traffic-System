import React, { useState } from 'react';
import '../css/Projecthomepage.css';
import '../css/Auth.css'; // New styles
import { BASEURL, callApi, setSession } from '../api';

const Projecthomepage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login' or 'signup'
  const [message, setMessage] = useState({ text: '', type: '' });

  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup State
  const [signupData, setSignupData] = useState({
    fullname: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  // Forgot Password State
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const openValidModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setMessage({ text: '', type: '' });
  };

  const closeModal = (e) => {
    // Check if clicked exactly on overlay OR if triggered manually
    if ((e.target && e.target.className === 'modal-overlay') || e === 'close') {
      setShowModal(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = () => {
    setMessage({ text: '', type: '' });
    const missingFields = [];
    if (!loginData.email) missingFields.push('Email');
    if (!loginData.password) missingFields.push('Password');

    if (missingFields.length > 0) {
      setMessage({ text: `Please fill in: ${missingFields.join(', ')}`, type: 'error' });
      return;
    }

    const data = JSON.stringify({
      email: loginData.email,
      password: loginData.password
    });

    callApi("POST", BASEURL + "users/signin", data, (res) => {
      const rdata = res.split('::');
      if (rdata[0] === '200') {
        setSession("csrid", rdata[1], 1);
        window.location.replace("/dashboard");
      } else {
        setMessage({ text: rdata[1], type: 'error' });
      }
    });
  };

  const handleSignupSubmit = () => {
    setMessage({ text: '', type: '' });
    const { fullname, email, role, password, confirmPassword } = signupData;
    const missingFields = [];

    if (!fullname) missingFields.push('Full Name');
    if (!email) missingFields.push('Email');
    if (!role) missingFields.push('Role');
    if (!password) missingFields.push('Password');
    if (!confirmPassword) missingFields.push('Confirm Password');

    if (missingFields.length > 0) {
      setMessage({ text: `Please fill in: ${missingFields.join(', ')}`, type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    const data = JSON.stringify({
      fullname,
      email,
      role,
      password
    });

    callApi("POST", "http://localhost:8080/users/signup", data, (res) => {
      const resp = res.split('::');
      if (resp[0] === "200") {
        alert(resp[1]); // Keep alert for success as per original flow or switch to UI message
        setModalType('login');
      } else {
        setMessage({ text: resp[1], type: 'error' });
      }
    });
  };

  const handleForgotPassword = () => {
    if (!loginData.email) {
      setMessage({ text: 'Please enter your email first', type: 'error' });
      return;
    }
    const url = "http://localhost:8080/users/forgotpassword/" + loginData.email;
    callApi("GET", url, "", (res) => {
      const data = res.split("::");
      if (data[0] === "200") {
        setMessage({ text: data[1], type: 'success' });
      } else {
        setMessage({ text: data[1], type: 'error' });
      }
    });
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-icon">🚦</div>
          <span className="brand-name">TrafficPortal</span>
        </div>
        <div className="navbar-actions">
          <button className="nav-btn-signin" onClick={() => openValidModal('login')}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Traffic System – <span className="highlight-text">Making Roads Safer</span>
          </h1>
          <p className="hero-subtitle">
            Welcome to Smart Traffic Management.<br/>
            We use technology to monitor traffic, reduce congestion, and improve road safety.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={() => openValidModal('signup')}>
              Get Started
            </button>
            <button className="cta-button secondary" onClick={() => openValidModal('login')}>
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Info Sections Grid */}
      <section className="info-grid">
        {/* Features */}
        <div className="info-card">
          <div className="card-header">Our Features</div>
          <ul className="card-list">
            <li>Real-time traffic monitoring</li>
            <li>Vehicle counting and tracking</li>
            <li>Traffic signal control system</li>
            <li>Accident and congestion alerts</li>
            <li>Data reports for better planning</li>
          </ul>
        </div>

        {/* For Drivers */}
        <div className="info-card">
          <div className="card-header">For Drivers</div>
          <ul className="card-list">
            <li>Check live traffic updates</li>
            <li>Find fastest routes</li>
            <li>Avoid traffic jams</li>
          </ul>
        </div>

        {/* For Authorities */}
        <div className="info-card">
          <div className="card-header">For Authorities</div>
          <ul className="card-list">
            <li>Control traffic signals smartly</li>
            <li>Analyze traffic flow</li>
            <li>Improve city transport</li>
          </ul>
        </div>
      </section>

      {/* Slogan & Footer */}
      <footer className="footer-section">
        <h2 className="footer-slogan">Safe Roads. Smart Cities. Better Travel.</h2>
        <div className="footer-flow">
          <span>Track</span> <span className="arrow">→</span> <span>Manage</span> <span className="arrow">→</span> <span>Improve</span>
        </div>
      </footer>

      {/* Glassmorphism Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={() => closeModal('close')}>&times;</span>
            <div className="modal-header">
              <h2>{modalType === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            </div>
            
            <div className="modal-body">
              {modalType === 'login' && (
                <div className="form-group">
                  <div className="input-wrapper">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Enter your email"
                        autoFocus
                      />
                  </div>
                  <div className="input-wrapper">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Enter your password"
                      />
                  </div>
                  <div className="forgot-password" style={{textAlign:'right', fontSize:'0.85rem'}}>
                    <span onClick={handleForgotPassword} style={{color:'#007bff', cursor:'pointer'}}>Forgot Password?</span>
                  </div>
                  <button className="submit-btn" onClick={handleLoginSubmit}>Sign In</button>
                  <div className="switch-mode">
                    Don't have an account? <span onClick={() => setModalType('signup')}>Sign Up</span>
                  </div>
                </div>
              )}

              {modalType === 'signup' && (
                <div className="form-group">
                  <div className="input-wrapper">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullname"
                        value={signupData.fullname}
                        onChange={handleSignupChange}
                        placeholder="John Doe"
                      />
                   </div>
                   <div className="input-wrapper">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder="email@example.com"
                      />
                   </div>
                   <div className="input-wrapper">
                      <label>Role</label>
                      <select name="role" value={signupData.role} onChange={handleSignupChange}>
                        <option value="">Select Role</option>
                        <option value="1">Admin</option>
                        <option value="2">Manager</option>
                        <option value="3">Driver</option>
                        <option value="4">Customer</option>
                      </select>
                   </div>
                   <div className="input-wrapper">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="Create Password"
                      />
                   </div>
                   <div className="input-wrapper">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        placeholder="Confirm Password"
                      />
                   </div>
                  <button className="submit-btn" onClick={handleSignupSubmit}>Register</button>
                  <div className="switch-mode">
                    Already have an account? <span onClick={() => setModalType('login')}>Sign In</span>
                  </div>
                </div>
              )}

              {message.text && (
                <div className={`message-box ${message.type}`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projecthomepage;