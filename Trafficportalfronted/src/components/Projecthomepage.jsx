import React, { useState } from 'react';
import '../css/Projecthomepage.css';
import '../css/Auth.css'; // New styles
import { BASEURL, callApi, setSession } from '../api';
import trafficHomeBg from '../assets/traffic_home_page.png';
import aboutBg from '../assets/about_section_bg.png';
import trafficHomeBg1 from '../assets/trafficpage1.jpg';
import Contact from './Contact';
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

    const data = {
      email: loginData.email,
      password: loginData.password
    };

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

    const data = {
      fullname,
      email,
      role,
      password
    };

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
          <span className="logo-icon">🌀</span>
          <span className="brand-name">TrafficPortal</span>
        </div>
        <div className="navbar-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
          <a href="#contact" className="nav-link">Contact</a>
          <button className="nav-link" style={{ fontWeight: '700' }} onClick={() => openValidModal('login')}>LOGIN</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">Welcome to<br />TrafficPortal</h1>
          <p className="hero-subtitle">Transforming Your Traffic Experience for Smarter Cities</p>
        </div>
        <div className="hero-image-container" style={{ backgroundImage: `url(${trafficHomeBg})` }}>
        </div>
      </header>

      {/* About / Discover Section */}
      <section id="about" className="about-section" style={{ backgroundImage: `url(${trafficHomeBg1})` }}>
        <div className="about-overlay-card">
          <h2 className="about-title">Discover TrafficPortal</h2>
          <p className="about-desc">
            Your Gateway to Smarter Traffic Solutions.
            Monitor city traffic in real-time, plan your travel efficiently, and actively contribute to city traffic insights.
            Our platform is designed to promote smart city initiatives by empowering citizens with robust planning tools.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2 className="section-header">Testimonials</h2>

        <div className="testimonial-card">
          <div className="testi-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1974&auto=format&fit=crop')" }}></div>
          <div className="testi-content">
            <div className="stars">★★★★★</div>
            <div style={{ height: '10px' }}></div>
            <div className="testi-role">Professional Driver and Logistics Planner</div>
            <h3 className="testi-name">Michael Johnson</h3>
            <p className="testi-text">
              "The platform's travel planning tools helped me save time and frustration during peak hours. Highly recommended for anyone navigating the city!"
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <Contact />
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>TrafficPortal</div>
        <div>Copyright © 2026 All rights reserved</div>
        <div>Powered By SITE123 - Free website builder</div>
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
                  <div className="forgot-password">
                    <span onClick={handleForgotPassword}>Forgot Password?</span>
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