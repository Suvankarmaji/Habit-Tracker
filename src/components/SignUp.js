import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './signup.module.css';
import loginImg from './loginpagephoto.jpg';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
    agree: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agree) {
      setError('You must agree to the Terms of Use.');
      return;
    }

    // Basic mock signup saving (since there is no real DB here)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ username: formData.username, email: formData.email, password: formData.password });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Redirect down to SignIn
    navigate('/SignIn');
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.leftBox}>
        <img src={loginImg} alt="Login Visual" />
        </div>
        <div className={styles.rightBox}>
          <div className={styles.signUp}>
            <h1>Sign Up</h1>
            {error && <p style={{ color: 'red', marginLeft: '0px', marginTop: '-10px', marginBottom: '10px' }}>{error}</p>}

            <div className={styles.inputGroup}>
              <label htmlFor="firstName">Full Name</label>
              <input type="text" id="firstName" placeholder="Name..." value={formData.firstName} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Email address..." value={formData.email} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="Username..." value={formData.username} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="•••••••" value={formData.password} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="repeatPassword">Repeat Password</label>
              <input type="password" id="repeatPassword" placeholder="•••••••" value={formData.repeatPassword} onChange={handleChange} />
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="agree" checked={formData.agree} onChange={handleChange} />
              <label htmlFor="agree">I agree to the <b>Terms of Use</b></label>
            </div>
          </div>

          <div className={styles.button}>
            <button onClick={handleSubmit}>Sign Up</button>
            <div className={styles.signInLink}>
              Already a member? <Link to="/SignIn">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
